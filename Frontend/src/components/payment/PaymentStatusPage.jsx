import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import api from '../../api';

const PaymentStatusPage = () => {

  const [statusMessage, setStatusMessage] = useState('');
  const [statusSubMessage, setStatusSubMessage] = useState('');
  const location = useLocation();

 

  useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const paymentId= queryParams.get('paymentId');
      const payId = queryParams.get('PayerId');
      const ref = queryParams.get('ref');

      if(paymentId && payId && ref){
          api.post(`paypal_payment_callback/?'paymentId=${paymentId}&PayerId=${payId}&ref=${ref}`)
              .then(res => {
                  console.log(res.data)
                  setStatusMessage(res.data.message);
                  setStatusSubMessage(res.data.subMessage);
                  localStorage.removeItem("cart_code");
                  setNumberCartItems(0);
              })
              .catch(err => console.log(err.message));
      }
  }, []);

  return (
    <header className='py-5' style={{ backgroundColor: statusColor }}>
      <div className='container px-4 px-lg-5 my-5'>
        <div className='text-center text-white'>
          <h2 className='display-5 fw-bold'>{statusMessage}</h2>
          <p className='lead fw-normal text-white-75 mb-4'>{statusSubMessage}</p>
          <span>
            <Link to="/" className="btn btn-light btn-lg px-4 py-2 mx-3">View Order Details</Link>
            <Link to="/cart" className="btn btn-light btn-lg px-4 py-2">Continue Shopping</Link>
          </span>
        </div>
      </div>
    </header>
  );
};

export default PaymentStatusPage;
