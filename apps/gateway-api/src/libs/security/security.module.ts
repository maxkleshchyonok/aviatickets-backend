import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SecurityService } from './security.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('security'),
    }),
  ],
  providers: [SecurityService, AccessTokenStrategy],
  exports: [SecurityService],
})
export class SecurityModule {}
