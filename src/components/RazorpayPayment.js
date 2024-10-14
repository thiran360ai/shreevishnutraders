import React from 'react';
import {  Button } from 'react-bootstrap';  

const RazorpayPayment = ({ amount, onSuccess, payLoad }) => {

    var options = {
        key: "rzp_test_kCdOqP8BzGgYk9",
        key_secret:"MQOrNVMcv8va4OLk4z4GeLaY",
        amount: amount *100,
        currency:"INR",
        name:"Pay Here",
        description:"for testing purpose",
        handler: function(response){
          onSuccess({"res":true, "msg" : response.razorpay_payment_id});
        },
        prefill: {
          name:payLoad.name,
          email:payLoad.email,
          contact:payLoad.phone,
        },
        notes:{
          address:payLoad.address,
        },
        theme: {
          color:"#3399cc"
        }
      };

      const openPaymentModal = () => {

        if(!payLoad.name || !payLoad.email || !payLoad.address || !payLoad.phone){
            alert("Enter all the mantatory fields")
            return;
        }
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailPattern.test(payLoad.email)){
            alert("Enter valid email")
            return;
        }
        if(payLoad.phone.length < 10){
            alert("Enter valid phone number")
            return;
        }
        //   var pay = new window.Razorpay(options);
        //   pay.open();      
        const rzp = new window.Razorpay(options);
        //   rzp.on('payment.failed', function (response) {
        //       onSuccess({"res":false, "msg" : response.razorpay_payment_id}); // Invoke the callback with failure status
        //   });
          rzp.open();
        }

//   const options = {
//     key: 'YOUR_RAZORPAY_KEY_ID', // Enter your Razorpay Key ID
//     amount: amount * 100, // Amount in paise
//     currency: 'INR',
//     name: 'Your Company Name',
//     description: 'Test Transaction',
//     image: '/your_logo.png',
//     handler: function(response) {
//       onSuccess(true); // Invoke the callback with success status
//     },
//     prefill: {
//       name: 'Your Name',
//       email: 'your_email@example.com',
//       contact: '9999999999',
//     },
//     notes: {
//       address: 'Your Address',
//     },
//     theme: {
//       color: '#3399cc',
//     },
//   };

//   const openPaymentModal = () => {
//     // const rzp = new Razorpay(options);
//     // rzp.on('payment.failed', function (response) {
//     //   onSuccess(false); // Invoke the callback with failure status
//     // });
//     // rzp.open();
//   };

  return (
    <div>
      <Button variant="success" disabled={amount <= 0} onClick={openPaymentModal}>Proceed to Pay {amount}</Button>
    </div>
  );
};

export default RazorpayPayment;
