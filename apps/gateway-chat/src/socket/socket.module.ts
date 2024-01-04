import { Module } from '@nestjs/common';
import { SocketService } from 'chat/socket/socket.service';
import { SocketGateway } from 'chat/socket/socket.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';



@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: {
        host: 'localhost',
        port: 6379
      }
    })
  ],
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
