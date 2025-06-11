import { createNotification } from '../lib';
import { bot } from '..';

bot.command('create_public_notification', (ctx) => createNotification(ctx, 'public'));
