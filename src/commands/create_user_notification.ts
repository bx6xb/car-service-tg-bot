import { createNotification } from '../lib';
import { bot } from '..';

bot.command('create_user_notification', (ctx) => createNotification(ctx, 'user'));
