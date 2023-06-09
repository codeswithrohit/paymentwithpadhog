const https = require('https');
const PaytmChecksum = require('paytmchecksum');
import Order from "../../models/Order"
import Project from "../../models/Project"
import connectDb from "../../middleware/mongoose"

const handler = async (req, res) => {
  if (req.method == 'POST') {
    // Check if the cart is tampered with -- [Pending]
    let project, sumTotal = 0;
    let cart = req.body.cart;

    // Check if the details are valid -- [Pending]

    // Initiate an Order corresponding to this order id -- [Pending]
    let order = new Order({
      name: req.body.name,
      email: req.body.email,
      orderId: req.body.oid,
      phone: req.body.phone,
      amount: 5,
    });
    await order.save();

    var paytmParams = {
      body: {
        requestType: "Payment",
        mid: process.env.NEXT_PUBLIC_PAYTM_MID,
        websiteName: "YOUR_WEBSITE_NAME",
        orderId: req.body.oid,
        callbackUrl: `${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`,
        txnAmount: {
          value: 5,
          currency: "INR",
        },
        userInfo: {
          custId: req.body.email,
        },
      },
    };

    /*
    * Generate checksum by parameters we have in body
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      process.env.PAYTM_MKEY
    );

    paytmParams.head = {
      signature: checksum,
    };

    var post_data = JSON.stringify(paytmParams);

    const requestAsync = async () => {
      return new Promise((resolve, reject) => {
        var options = {
          hostname: 'securegw.paytm.in',
          port: 443,
          path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${req.body.oid}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length,
          },
        };

        var response = "";
        var post_req = https.request(options, function (post_res) {
          post_res.on('data', function (chunk) {
            response += chunk;
          });

          post_res.on('end', function () {
            let ress = JSON.parse(response).body;
            ress.success = true;
            ress.clearCart = false;
            resolve(ress);
          });
        });

        post_req.write(post_data);
        post_req.end();
      });
    };

    try {
      let myr = await requestAsync();
      res.status(200).json(myr);
    } catch (error) {
      console.log('Error initializing payment:', error);
      res.status(500).json({ error: 'Failed to initialize payment' });
    }
  }
};

export default connectDb(handler);
