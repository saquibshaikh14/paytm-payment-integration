# Paytm payment integration (NODEJS)

Simple and illustrative Paytm payment integration example.

## Installation

Download the repo. Unzip it and use ```npm install``` to install all the dependencies. 

```bash
cd paytm-payment-integration

npm install
```
Setup envirnoment variable.
```env
MERCHANT_KEY = YOUR_MERCHANT_KEY
MERCHANT_ID = YOUR_MERCHANT_ID
```
## Dependencies

* express
* ejs
* nodemon
* dotenv
* cors


## Usage

```bash
cd paytm-payment-integration

npm start
```
* Open http://localhost:3000 in your browser
* Fill up the form and submit
* It will redirect to paytm payment page
* Fill the details and complete payment.

## Use in existing project
Copy ```paytm``` folder in your project

```javaScript
const {initializePayment, verifyPayemntAuthenticity} = require('./paytm/managePayment');

//use uuid instead of crypto for generating orderId.
const crypto = require('crypto'); 

//payment route
app.post('/payment', async(req, res)=>{
    //get amount from req.body (or as needed).
    const {amount} = req.body;
    const orderId = crypto.randomBytes(16).toString("hex");

    //create paytmParams for generating checksumhash and txnToken.
    let paytmParams = {};
    paytmParams.body = {
        "requestType"   : "Payment",
        "mid"           : process.env.MERCHANT_ID,
        "websiteName"   : process.env.WEBSITE,
        "orderId"       : orderId,
        "callbackUrl"   : "http://localhost:3000/verify-payment",
        "txnAmount"     : {
            "value"     : amount,
            "currency"  : "INR",
        }
    };

    //initializePayment returns txnInfo containing txnToken.
    let txnInfo = await initializePayment(paytmParams);

    //create hidden inputs field from hiddenInput object
    const hiddenInput = {
        txnToken    : txnInfo.body.txnToken,
        mid         : process.env.MERCHANT_ID,
        orderId     : orderId
    }
    //see 'intermediateForm.ejs' for form example.
});

//callbackUrl.
//post data sent by paytm with payament information
app.post('/verify-payment', (req, res)=>{
    
    //req.body contains all data sent by paytm related to payment.
    //check checksumhash to verify transaction is not tampered.

    //verifyPaymentAuthenticity verifies checsumhash and return paymentObject or false(if failed to match or mismatch).
    const paymentObject = await verifyPayemntAuthenticity(req.body);
    //do otherstuff i.e. save to database verify for payment completed/aborted/failed etc.
});
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

