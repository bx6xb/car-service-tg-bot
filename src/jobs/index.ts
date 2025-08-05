import cron from 'node-cron';
import { sendBroadcasts } from './sendBroadcasts';
import { sendWarranties } from './sendWarranties';
import { cleanupOldMessages } from '../lib';

cron.schedule('0 9 * * *', () => {
  cleanupOldMessages();
  sendBroadcasts();
  sendWarranties();
});

cron.schedule('0 17 * * *', () => {
  cleanupOldMessages();
  sendBroadcasts();
});
