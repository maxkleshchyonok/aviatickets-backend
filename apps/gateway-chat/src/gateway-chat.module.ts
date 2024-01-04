
import { Module } from '@nestjs/common';
import { GatewayChatController } from 'chat/gateway-chat.controller';
import { GatewayChatService } from 'chat/gateway-chat.service';
import { SocketModule } from 'chat/socket/socket.module';

@Module({
  imports: [
    SocketModule,
  ],
  controllers: [GatewayChatController],
  providers: [GatewayChatService],
})
export class GatewayChatModule {}
