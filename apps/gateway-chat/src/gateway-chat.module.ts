import { Module } from '@nestjs/common';
import { GatewayChatController } from './gateway-chat.controller';
import { GatewayChatService } from './gateway-chat.service';

@Module({
  imports: [],
  controllers: [GatewayChatController],
  providers: [GatewayChatService],
})
export class GatewayChatModule {}
