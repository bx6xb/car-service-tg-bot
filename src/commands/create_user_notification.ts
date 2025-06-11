import { Context } from 'telegraf';
import { createNotification } from '../lib';

export const createUserNotification = async (ctx: Context) => createNotification(ctx, 'user');
