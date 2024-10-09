import { getAccessToken, getFormattedDetailSales, sendDetailSalesToMpta } from '../utils/mpta';  
import logger from '../utils/logger';
import moment from 'moment';

function logResults(results: any ) {  
  if (results.status === 200) {  
    logger.info(`  
      ========== start ==========  
      function: Request Logger  
      status: ${results.status}  
      message: ${results.message}  
      transaction: ${results.transaction_id}  
      ========== ended ==========  
    `);  
  } else {  
    logger.info(`  
      ========== start ==========  
      function: Request Logger  
      status: ${results.status}  
      message: ${results.message}  
      ========== ended ==========  
    `);  
  }  
}  

function handleError(error: any) {  
  console.error(error.message);  
}  

function cronJob() {  
  getAccessToken()  
    .then(getToken => {  
      if (!getToken) {  
        throw new Error('Auth failed');  
      }
      const today = moment().tz('Asia/Yangon').format('YYYY-MM-DD');  
      return getFormattedDetailSales(today).then(detailSales => ({ getToken, detailSales }));  
    })  
    .then(({ getToken, detailSales }) => sendDetailSalesToMpta(getToken.access_token, detailSales))  
    .then(logResults)  
    .catch(handleError);  
}  

cronJob();