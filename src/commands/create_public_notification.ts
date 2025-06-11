import { Context } from 'telegraf';
import { createNotification } from '../lib';

export const createPublicNotification = async (ctx: Context) => createNotification(ctx, 'public');
