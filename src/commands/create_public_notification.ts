import { bot } from '../config';
import { createNotification } from '../lib';

bot.command('create_public_notification', (ctx) => createNotification(ctx, 'public'));
