import React from 'react'
import OrderSummary from './OrderSummary'
import PaymentSection from './PaymentSection'
import useCartData from '../../hooks/useCartData';

const CheckoutPage = () => {

    const { cartItems, cartTotal, loading, tax, setCartItems, setCartTotal, setloading  } = useCartData();
    const shipping = 30.00;

  return (
    <div className='container my-3'>
        <div className='row'>
            <OrderSummary cartItems={cartItems} cartTotal={cartTotal} tax={tax} shipping={shipping}/>
            <PaymentSection />
        </div>
    </div>
  )
}

export default CheckoutPage