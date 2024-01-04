import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';


@Injectable()
export class SocketService {
    constructor (@Inject(CACHE_MANAGER) private cacheManager: Cache) {}


    async handleMessage() {
        
    }

    async setUser(socketId: string, clientId: string) {
        await this.cacheManager.set(clientId, socketId)
    }
}
