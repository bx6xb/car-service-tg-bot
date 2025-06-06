import { config } from 'dotenv';
import { notFound } from './lib';

config();

export const BOT_TOKEN = process.env.BOT_TOKEN;
notFound('bot token', BOT_TOKEN);

export const PG_USER = process.env.PG_USER;
notFound('user', PG_USER);

export const PG_HOST = process.env.PG_HOST;
notFound('host', PG_HOST);

export const PG_DATABASE = process.env.PG_DATABASE;
notFound('database', PG_DATABASE);

export const PG_PASSWORD = process.env.PG_PASSWORD;
notFound('password', PG_PASSWORD);

export const PG_PORT = process.env.PG_PORT;
notFound('port', PG_PORT);
