import * as fs from 'fs';

import { Injectable } from '@nestjs/common';
import { JwtSignOptions } from '@nestjs/jwt';
import { parse } from 'dotenv';
import { RedisClientOptions } from 'redis';


@Injectable()
export class ConfigService {
  private readonly envFiles = ['.env', '.env.local'];
  private readonly envProvider: Record<string, string> = {};

  constructor () {
    this.envFiles.map((fileName) => {
      if (fs.existsSync(fileName)) {
        Object.assign(this.envProvider, parse(fs.readFileSync(fileName)));
      }
    });
  }

  get server () {
    return {
      host: this.get('SERVER_HOST'),
      port: this.getNumber('SERVER_PORT'),
    };
  }

  get isProduction (): boolean {
    return this.nodeEnv === 'production';
  }

  get isDevelopment (): boolean {
    return this.nodeEnv !== 'production';
  }

  get nodeEnv (): string {
    return this.get('NODE_ENV');
  }

  get prettyLogs (): boolean {
    return this.getBoolean('PRETTY_LOGS');
  }

  get uiClientUrl (): string {
    return this.get('UI_CLIENT_URL');
  }

  get uiAdminUrl (): string {
    return this.get('UI_ADMIN_URL');
  }

  get jwtParams () {
    return {
      tokenTTL: {
        access: '1h',
        refresh: '7d',
      },
    };
  }

  get getJwtConfig (): JwtSignOptions {
    return {
      secret: this.get('JWT_SECRET'),
    };
  }

  get typeormConfig () {
    return {
      host: this.get('POSTGRES_HOST'),
      port: this.getNumber('POSTGRES_PORT'),
      username: this.get('POSTGRES_USER'),
      password: this.get('POSTGRES_PASSWORD'),
      database: this.get('POSTGRES_DB'),
      logging: this.getBoolean('POSTGRES_LOGGING'),
    };
  }

  get redisConfig (): RedisClientOptions {
    return {
      socket: {
        host: this.get('REDIS_HOST'),
        port: this.getNumber('REDIS_PORT'),
      },
      password: this.get('REDIS_PASSWORD'),
    };
  }

  get s3 () {
    return {
      bucket: this.get('AWS_S3_BUCKET'),
      region: this.get('AWS_S3_REGION'),
      endpoint: this.get('AWS_S3_ENDPOINT'),
      accessKeyId: this.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.get('AWS_SECRET_ACCESS_KEY'),
    };
  }

  get airlabs () {
    return {
      imgBaseUrl: 'https://airlabs.co/img/airline/m/',
      baseUrl: 'https://airlabs.co/api/v9',
      apiKey: this.get('AIRLABS_API_KEY'),
    };
  }

  get emailParams () {
    return {
      from: this.get('FROM_EMAIL'),
    };
  }

  get googleMaps () {
    return {
      key: this.get('GOOGLE_MAPS_API_KEY'),
      placeId: this.get('GOOGLE_MAPS_PLACE_ID'),
    };
  }

  get braintree () {
    return {
      environment: {
        server: this.get('BRAINTREE_SERVER'),
        port: this.get('BRAINTREE_PORT'),
        authUrl: this.get('BRAINTREE_AUTH_URL'),
        ssl: this.get('BRAINTREE_SSL'),
        graphQLServer: this.get('BRAINTREE_GRAPHQL_SERVER'),
        graphQLPort: this.get('BRAINTREE_GRAPHQL_PORT'),
      },
      merchantId: this.get('BRAINTREE_MERCHANT_ID'),
      publicKey: this.get('BRAINTREE_PUBLIC_KEY'),
      privateKey: this.get('BRAINTREE_PRIVATE_KEY'),
    };
  }

  get jpmorgan () {
    const isEnabled = this.getBoolean('JPMORGAN_IS_ENABLED');
    const isProduction = this.getBoolean('JPMORGAN_IS_PRODUCTION');
    const test = {
      accessTokenEndpoint: 'https://idag2.jpmorganchase.com/adfs/oauth2/token/',
      baseEndpoint: 'https://merchant-api.checkout-cat.merchant.jpmorgan.com/v1',
      clientID: 'CC-105239-G033121-229409-PROD',
      resourceID: 'JPMC:URI:RS-105239-85484-HelixAPIEntitlementsCAT-PROD',
      merchantId: '481902',
    };
    const prod = {
      accessTokenEndpoint: 'https://idag2.jpmorganchase.com/adfs/oauth2/token/',
      baseEndpoint: 'https://merchant-api.checkout.merchant.jpmorgan.com/v1',
      clientID: 'CC-105239-K033004-229425-PROD',
      resourceID: 'JPMC:URI:RS-105239-85485-HelixAPIEntitlements-PROD',
      merchantId: '481902',
    };

    return {
      isEnabled,
      isProduction,
      ...(isProduction ? prod : test),
    };
  }

  get googleRecaptcha () {
    return {
      secret: this.get('GOOGLE_RECAPTCHA_SECRET_KEY'),
    };
  }

  get telegramBot () {
    return {
      token: this.get('TELEGRAM_TOKEN'),
    };
  }

  get telegramContactForm () {
    return {
      chatId: this.get('TELEGRAM_CONTACT_FORM_CHAT_ID'),
    };
  }

  get telegramPromoterScore () {
    return {
      chatId: this.get('TELEGRAM_PROMOTER_SCORE_CHAT_ID'),
    };
  }

  get telegramZohoErrors () {
    return {
      chatId: this.get('TELEGRAM_ZOHO_ERRORS_CHAT_ID'),
    };
  }

  get telegramOrders () {
    return {
      chatId: this.get('TELEGRAM_ORDER_CHAT_ID'),
    };
  }

  get telegramOrdersBackup () {
    return {
      chatId: this.get('TELEGRAM_ORDERS_BACKUP_CHAT_ID'),
    };
  }

  get telegramPayments () {
    return {
      chatId: this.get('TELEGRAM_PAYMENTS_CHAT_ID'),
    };
  }

  get openWeatherMap () {
    return {
      apiKey: this.get('OPEN_WEATHER_MAP_API_KEY'),
      baseUrl: 'https://api.openweathermap.org/data/2.5',
      imgBaseUrl: 'https://openweathermap.org/img/wn/',
    };
  }

  get smtp () {
    return {
      host: this.get('SMTP_HOST'),
      domain: this.get('SMTP_MAIL_DOMAIN'),
      port: this.getNumber('SMTP_PORT'),
      user: this.get('SMTP_USER'),
      password: this.get('SMTP_PASSWORD'),
    };
  }

  get mailgun () {
    return {
      apiKey: this.get('MAILGUN_API_KEY'),
    };
  }

  get commonEmailReceivers () {
    return {
      leads: this.getArray('COMMON_EMAIL_RECEIVER_LEADS'),
      orders: this.getArray('COMMON_EMAIL_RECEIVER_ORDERS'),
    };
  }

  private get (key: string): string {
    if (key in this.envProvider) return this.envProvider[key];
    else throw new Error(`Environment variable ${key} is not defined`);
  }

  private getArray (key: string): string[] {
    return this.get(key).split(',').map((i) => i.trim()).filter(Boolean);
  }

  private getBoolean (key: string): boolean {
    return this.get(key) === 'true';
  }

  private getNumber (key: string): number {
    return Number(this.get(key));
  }
}
