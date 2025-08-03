import cron from 'node-cron';
import { sendBroadcasts } from './sendBroadcasts';
import { sendWarranties } from './sendWarranties';

cron.schedule('0 9 * * *', () => {
  sendBroadcasts();
  sendWarranties();
});

cron.schedule('0 17 * * *', () => {
  sendBroadcasts();
});

// cron.schedule('* * * * *', () => {
//   sendBroadcasts();
//   sendWarranties();
// });

// sendWarranties();
