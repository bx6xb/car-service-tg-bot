import cron from 'node-cron';
import { sendBroadcasts } from './sendBroadcasts';
import { sendWarranties } from './sendWarranties';
import { cleanupOldMessages } from '../lib';

cron.schedule('0 6 * * *', () => {
  cleanupOldMessages();
  sendBroadcasts();
  sendWarranties();
});

cron.schedule('0 14 * * *', () => {
  cleanupOldMessages();
  sendBroadcasts();
});
