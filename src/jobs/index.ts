import cron from 'node-cron';
import { sendBroadcasts } from './sendBroadcasts';
import { sendWarranties } from './sendWarranties';
import { pingSupabase } from './pingSupabase';
import { cleanupOldMessages } from '../lib';

pingSupabase();

cron.schedule('0 4 1,6,11,16,21,26 * *', pingSupabase);

cron.schedule('0 6 * * *', () => {
  cleanupOldMessages();
  sendBroadcasts();
  sendWarranties();
});

cron.schedule('0 14 * * *', () => {
  cleanupOldMessages();
  sendBroadcasts();
});
