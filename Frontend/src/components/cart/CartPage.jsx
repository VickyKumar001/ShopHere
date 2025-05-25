import React, { useEffect, useState } from 'react'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import api from '../../api'
import Spinner from '../ui/Spinner'
import useCartData from '../../hooks/useCartData'


const CartPage = ({ setNumCartItems }) => {

    const { cartItems, cartTotal, loading, tax, setCartItems, setCartTotal, setloading  } = useCartData();

    if(loading) 
        return <div className='container my-3 py-3' style={{ height: "80vh", overflow: "scroll" }}><Spinner loading={loading} /></div>;

    if(cartItems.length === 0) 
        return <div className='container my-3 py-3' style={{ height: "80vh", overflow: "scroll" }}><h5 className='mb-3'>Your Cart is Empty</h5>
        </div>;

    return (
        <div className='container my-3 py-3' style={{ height: "80vh", overflow: "scroll" }}>
            <h5 className='mb-3'>Shopping Cart</h5>
            <div className='row'>
                <div className='col-md-8'>
                    {cartItems.map(item => <CartItem key={item.id} item={item} cartItems={cartItems} setCartItems={setCartItems} setCartTotal={setCartTotal} setNumCartItems={setNumCartItems} />)}
                </div>
                <CartSummary cartTotal={cartTotal} tax={tax} />
            </div>
        </div>
    )
}

export default CartPage