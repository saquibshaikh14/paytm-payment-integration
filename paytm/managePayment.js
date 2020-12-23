
const checkSum = require('./checkSum');
const https = require('https');

/**
 * 
 * call this function to create checksum and initiate payment API call.
 * @author saquib shaikh
 * @param {object} paymentObject payload to create  checksumhash.
 * @return {string} API response with txnToken and status. Use JSON.parse to get txnToken.
 */

const initializePayment = async (paymentObject) =>{
    
    const checksum = await checkSum.generateSignature(JSON.stringify(paymentObject.body), process.env.MERCHANT_KEY);
    paymentObject.head = {
        "signature"    : checksum
    };

    //call transaction init API
    return txnInfo = await initializAPIRequest(paymentObject);
    
}

/**
 * 
 * call this function to create checksum and initiate payment API call.
 * @author saquib shaikh
 * @param {object} paymentObject payload to API call.
 * @return {string} return promise with transaction info required for transaction.
 */

const initializAPIRequest = (paymentObject) =>{
    return new Promise((resolve, reject)=>{

        let post_data = JSON.stringify(paymentObject);
        let options = {

            /* for Staging */
            hostname: 'securegw-stage.paytm.in',
    
            /* for Production */
            // hostname: 'securegw.paytm.in',
    
            port: 443,
            path: `/theia/api/v1/initiateTransaction?mid=${paymentObject.body.mid}&orderId=${paymentObject.body.orderId}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };
        
        const paytmReq = https.request(options, (paytmRes)=>{

            let responseData = "";

            paytmRes.on('data', (chunk)=>responseData+=chunk);
            paytmRes.on('end', ()=>resolve(responseData));
        });

        paytmReq.on('error', (e)=>reject(e));

        paytmReq.write(post_data);
        paytmReq.end();

    });
}

/**
 * 
 * @author saquib shaikh
 * @param {object} paymentObject parameters received from paytm
 * @returns {object} return promise with paymentObject if cheksumhash verification true else returns false. 
 */

const verifyPayemntAuthenticity = (paymentObject) =>{
    return new Promise((resolve, reject)=>{
        const verifyStatus = checkSum.verifySignature(paymentObject, process.env.MERCHANT_KEY, paymentObject.CHECKSUMHASH);
        verifyStatus ? resolve(paymentObject):false;
    });
}

module.exports = {initializePayment, initializePayment, verifyPayemntAuthenticity};