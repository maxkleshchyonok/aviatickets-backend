import {Socket} from 'socket.io'
import {verify} from 'jsonwebtoken'
import { WsException } from '@nestjs/websockets'

export function jwtMiddleware (socket: Socket, next: any) {
    const token = socket.handshake.auth.token
    if (!token) {
        const {id, role, name} = socket.handshake.headers
        socket.user = {id, role, name}
        return next()
    }
    try {
        const payload = verify(token,"your-256-bit-secret")
        socket.user = payload
    }
    catch (error) {
       console.log('sss')
    }
    next()
}
