"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mpta_1 = require("../utils/mpta");
const logger_1 = __importDefault(require("../utils/logger"));
function logResults(results) {
    if (results.status === 200) {
        logger_1.default.info(`  
      ========== start ==========  
      function: Request Logger  
      status: ${results.status}  
      message: ${results.message}  
      transaction: ${results.transaction_id}  
      ========== ended ==========  
    `);
    }
    else {
        logger_1.default.info(`  
      ========== start ==========  
      function: Request Logger  
      status: ${results.status}  
      message: ${results.message}  
      ========== ended ==========  
    `);
    }
}
function handleError(error) {
    console.error(error.message);
}
function cronJob() {
    (0, mpta_1.getAccessToken)()
        .then(getToken => {
        if (!getToken) {
            throw new Error('Auth failed');
        }
        return (0, mpta_1.getFormattedDetailSales)().then(detailSales => ({ getToken, detailSales }));
    })
        .then(({ getToken, detailSales }) => (0, mpta_1.sendDetailSalesToMpta)(getToken.access_token, detailSales))
        .then(logResults)
        .catch(handleError);
}
cronJob();
