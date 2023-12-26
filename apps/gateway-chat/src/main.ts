import { NestFactory } from '@nestjs/core';
import { GatewayChatModule } from './gateway-chat.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayChatModule);
  await app.listen(3000);
}
bootstrap();
