import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { SocketService } from "chat/socket/socket.service";
import { Server, Socket } from "socket.io";

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
    @WebSocketServer()
    private server: Server

    constructor (private readonly socketService: SocketService) {}

    
    @SubscribeMessage('sendMessage') 
    async handleSendMessage(@ConnectedSocket() socket: Socket, @MessageBody() payload) {
        this.server.to(`${payload.roomId}`).emit('newMessage', payload.message)
    }

    @SubscribeMessage('joinConversation')
    async joinConversation(@ConnectedSocket() socket: Socket, @MessageBody() payload) {
        socket.join(`${socket.id + payload.clientId}`)
        const clients = await this.server.in("supportQueue").fetchSockets()
        const client = clients.find(client => client.id == payload.clientId)
        client.join(`${socket.id + payload.clientId}`)
        this.server.to(`${socket.id + payload.clientId}`).emit('newMessage', `Joined room ${socket.id + payload.clientId}`)
        client.leave('supportQueue')
    }

    async handleConnection(@ConnectedSocket() socket: Socket) {
        if (socket.handshake.headers.status == 'user') {
            socket.join('supportQueue')
            this.server.to('supportDesk').emit('newClient', socket.id)
        }
        if (socket.handshake.headers.status == 'sales') {
            socket.join('supportDesk')
        }
        const userId = socket.handshake.headers.userid
        await this.socketService.setUser(userId as string, socket.id)
    }

}