import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('security', () => {
  const envVarsSchema = Joi.object()
    .keys({
      ACCESS_TOKEN_SECRET: Joi.string().required(),
      REFRESH_TOKEN_SECRET: Joi.string().required(),
      ACCESS_TOKEN_LIFETIME: Joi.string().default('1d').required(),
      REFRESH_TOKEN_LIFETIME: Joi.string().default('30d').required(),
    })
    .unknown();

  const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    accessTokenOptions: {
      secret: envVars.ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: envVars.ACCESS_TOKEN_LIFETIME,
        algorithm: 'ES256',
      },
    },
    refreshTokenOptions: {
      secret: envVars.REFRESH_TOKEN_SECRET,
      signOptions: {
        expiresIn: envVars.REFRESH_TOKEN_LIFETIME,
        algorithm: 'ES256',
      },
    },
  };
});
