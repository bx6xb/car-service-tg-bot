import { bot } from '../config';
import { createNotification } from '../lib';

bot.command('create_user_notification', (ctx) => createNotification(ctx, 'user'));
