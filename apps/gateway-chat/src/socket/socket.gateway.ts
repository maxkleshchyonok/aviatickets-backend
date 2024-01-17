import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { SocketService } from "chat/socket/socket.service";
import { Server, Socket } from "socket.io";
import { MessageDto } from "chat/dtos/message.dto";


@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    private server: Server

    constructor (private readonly socketService: SocketService) {}

    
    @SubscribeMessage('sendMessage') 
    async handleSendMessage(@ConnectedSocket() socket: Socket, @MessageBody() payload: MessageDto) {
        const roomId = `${[socket.user.id, payload.reciever].sort().join()}`
        this.sendMessage(roomId, 'newMessage', payload)
    }

    // Создаем темповую комнату при подключении клиента
    @SubscribeMessage('createTempRoom')
    async handleCreateTempRoom(@ConnectedSocket() socket: Socket) {
        const user = socket.user
        const tempRoomId = user.id + 'temp'
        await this.socketService.createRoom(tempRoomId, [], [user.id])
    }

    // Sales соединяет себя и клиента и получает его сообщения 
    @SubscribeMessage('joinConversation')
    async joinConversation(@ConnectedSocket() socket: Socket, @MessageBody() payload) {
        const user = socket.user
        const clientId = payload.clientId
        const userTempRoom = await this.socketService.getRoom(payload.clientId + 'temp')
        let existingMessages = []
        if (userTempRoom.messages) {
            existingMessages = userTempRoom.messages
        }
        const roomId = user.id + clientId
        this.socketService.createRoom(roomId, existingMessages, [user.id, clientId])
        socket.join(roomId)
        this.server.to(roomId).emit('newMessages', existingMessages)
        const client = await this.socketService.getUser(clientId)
        socket.in(client.socketId).socketsJoin(roomId)
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        console.log(`Socket ${socket.id} disconnected`)
        if (socket.user.role == 'client') {
            
            await this.handleClientDisconnection(socket)
            console.log('in user disconnect')
        }
        if (socket.user.role == 'sales') {
            await this.handleSalesDisconnection(socket)
        }
    }

    async handleConnection(@ConnectedSocket() socket: Socket) {
        if (socket.user.role == 'client') {
            await this.handleClientConnection(socket)
        }
        if (socket.user.role == 'sales') {
            await this.handleSalesConnection(socket)
        }
    }

    async afterInit(server: any) {
        const queue = await this.socketService.getRoom('supportQueue')
        if (!queue) {
            this.socketService.createRoomWithoutExpiry('supportQueue', [], []);
        }
        const desk = await this.socketService.getRoom('supportDesk')
        if (!desk) {
            this.socketService.createRoomWithoutExpiry('supportDesk', [], []);
        }
        
    }

    private handleSalesDisconnection(socket: Socket) {
        this.leaveRoom(socket, 'supportDesk', 0)
    }

    private async handleClientDisconnection(socket: Socket) {
        console.log('in handler')
        const existingUser = await this.socketService.getUser(socket.user)
        console.log(existingUser)
        if (existingUser.rooms.includes('supportQueue')) {
            this.leaveRoom(socket, 'supportQueue', 0)
        }
    }

    private async handleSalesConnection(socket: Socket) {
        const user = socket.user 
        const sales = await this.socketService.getUser(user)
        await this.joinRoom(socket, 'supportDesk', 0)
        const queue = await this.socketService.getRoom('supportQueue')
        this.server.to(socket.id).emit('awaitingClients', queue.users)
        const rooms = sales.rooms
        this.server.to(socket.id).emit('conversations', rooms)
    }

    private async handleClientConnection(socket: Socket) {
        const user = socket.user
        const existingUser = await this.socketService.getUser(user)
        if (!existingUser) {
            await this.socketService.setUser(user, socket.id)
            await this.socketService.createRoom(socket.id, [], [user.id])
            await this.joinRoom(socket, "supportQueue", 0)
            await this.sendMessage('supportDesk', 'newClient', {id: user.id, name: user.name}, 0)
            return
        }

        if (!existingUser.rooms.includes('supportQueue')) {
            const userConversationRoom = await this.socketService.getRoom(existingUser.rooms[1])
            const messageHistory = userConversationRoom.messages
            await this.sendMessage(socket.id, 'messageHistory', messageHistory)
        }
        this.socketService.setUserSocket(user, socket.id)
    }

    private async joinRoom(socket: Socket, roomId: string, ttl?: number) {
        await this.socketService.saveRoomEntry(socket.user, roomId, ttl)
        socket.join(roomId)
    }

    private async leaveRoom(socket: Socket, roomId: string, ttl?: number) {
        await this.socketService.leaveRoom(socket.user, roomId, ttl)
        socket.leave(roomId)
    } 

    private async sendMessage(roomId: string, messageType: string, message: any, ttl?: number) {
        await this.socketService.saveMessage(roomId, message, ttl)
        this.server.to(roomId).emit(messageType, message)
    }
}