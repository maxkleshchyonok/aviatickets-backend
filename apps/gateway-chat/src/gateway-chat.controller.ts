import { Controller, Get } from '@nestjs/common';
import { GatewayChatService } from './gateway-chat.service';

@Controller()
export class GatewayChatController {
  constructor(private readonly gatewayChatService: GatewayChatService) {}

  @Get()
  getHello(): string {
    return this.gatewayChatService.getHello();
  }
}
