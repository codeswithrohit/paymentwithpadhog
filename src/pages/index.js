/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import Aos from "aos";
import "aos/dist/aos.css";
import Axios from 'axios';
import Project from '../models/Project'
import mongoose from "mongoose";

import Script from 'next/script';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession} from "next-auth/react"

export default function Home({project}) {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [user, setUser] = useState({value: null})
  const { data: session } = useSession()
  useEffect(() => {
   
    if (session) {
      setEmail(session.user.email)
    }

  }, [])
  useEffect(() => {
    if (name.length>3 && email.length>3 && phone.length>3 ) {
      setDisabled(false)
    }
    else{
      setDisabled(true)

    }
    

  }, [name, email,  phone])



  const handleChange = (e) => {


    if (e.target.name == 'name') {
      setName(e.target.value)
    }
    else if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
   
    else if (e.target.name == 'phone') {
      setPhone(e.target.value)
    }
  
    if (name && email && phone ) {
      setDisabled(false)
    }
  }


  const initiatePayment = async () => {
    setIsLoading(true)
    let oid = Math.floor(Math.random() * Date.now());

    // Get a transaction token
    const data = { oid, email: email, name,  phone };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let txnRes = await a.json()
    if (txnRes.success) {
      //console.log(txnRes)
      let txnToken = txnRes.txnToken

      var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
          "orderId": oid, /* update order id */
          "token": txnToken, /* update token value */
          "tokenType": "TXN_TOKEN",
          "amount": 5 /* update amount */
        },
        "handler": {
          "notifyMerchant": function (eventName, data) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          }
        }
      };

      window.Paytm.CheckoutJS.init(config).then(function onSuccess() {

        // after successfully updating configuration, invoke JS Checkout
        window.Paytm.CheckoutJS.invoke();
        setIsLoading(false) 
      }).catch(function onError(error) {
        setIsLoading(false) 
      });
    }
    else {
      setIsLoading(false)
     
      toast.error(txnRes.error, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }


  }


    useEffect(() => {
      Aos.init({
        duration: 1800,
        offset: 100,
        disable: "mobile",
      });
    }, []);
  return (
    <div >
      <Head>
        <title>PadhoG</title>
        <meta name="PadhoG" content="PadhoG provides learners with quick notes, project ideas, and book PDFs for competitive exams" />
        <link rel="icon" href="/icon.png" />
      </Head>

      <div className='container m-auto min-h-screen'>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Head>
        <title>checkout</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <Script type="application/javascript" crossorigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`} />
      <h1 className='font-bold text-3xl my-8 text-center text-green-500'>Checkout</h1>
      <h2 className='font-semibold text-xl'>1.User Details</h2>
      <div className="mx-auto flex my-4">
        <div className="px-2 w-1/2">
          <div className=" mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input onChange={handleChange} value={name} type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>

        <div className="px-2 w-1/2">
          <div className=" mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            {session ? <input value={session.user.email} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" readOnly /> : <input onChange={handleChange} value={email} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />}

          </div>
        </div>
      </div>
     

      <div className="mx-auto flex my-4">
        <div className="px-2 w-1/2">
          <div className=" mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone Number</label>
            <input placeholder='Your 10 Digit Phone Number' onChange={handleChange} value={phone} type="phone" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>

       
      </div>

     
      
      <div className=" sideHeart bg-green-100 p-6 m-2 ">


       
        <span className='font-bold'>Subtotal: ₹5</span>


      </div>
      {isLoading ? (
          <div className='mx-4'>
          <button  className="disabled:bg-indigo-300 flex mr-2 text-white bg-indigo-500 border-0 py-2 px-2 focus:outline-none hover:bg-indigo-600 rounded">Loading...</button>
        </div>
        ) : (
      <div className='mx-4'>
        <Link href={'/'}><button disabled={disabled} onClick={initiatePayment} className=" disabled:bg-indigo-300 flex mr-2 text-white bg-indigo-500 border-0 py-2 px-2 focus:outline-none hover:bg-indigo-600 rounded">Pay ₹{5}</button></Link>
      </div>)}




    </div>







    </div >
  )
}

export async function getServerSideProps(context) {
  let error=null;
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }
  let project = await Project.find({branch: "EE"})
  
  return {
    props: { project: JSON.parse(JSON.stringify(project)) }, // will be passed to the page component as props
  }
}
