import React from 'react';
import OrderItem from './OrderItem';
import styles from './OrderSummary.module.css';

const OrderSummary = ({ cartItems, cartTotal, tax, shipping}) => {
  // You can pass a real total value via props or state later
  const totalAmount = (cartTotal+tax+shipping).toFixed(2); // example value

  return (
    <div className='col-md-8'>
      <div className={`card mb-4 ${styles.card}`}>
        <div className='card-header' style={{ backgroundColor: "#6050DC", color: "#fff" }}>
          <h5>Cart Summary</h5>
        </div>
        <div className='card-body'>
          <div className='px-3' style={{ height: "300px", overflow: "auto" }}>
            {cartItems.map(item => <OrderItem key={item.id} item={item} />)}
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center px-4 py-3 bg-light">
          <h6 className="mb-0 fw-semibold">Total</h6>
          <span className="fw-bold fs-5 text-success">₹ {totalAmount} </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
