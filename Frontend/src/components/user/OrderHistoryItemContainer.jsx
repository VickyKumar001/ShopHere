import React from 'react';
import OrderHistoryItem from './OrderHistoryItem';

const OrderHistoryItemContainer = ({ orderItems }) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card h-100">
          <div
            className="card-header"
            style={{ backgroundColor: '#6050DC', color: 'white' }}
          >
            <h5 className="mb-0">Order History</h5>
          </div>

          <div
            className="card-body"
            style={{ maxHeight: '300px', overflowY: 'auto' }}
          >
            {orderItems && orderItems.length > 0 ? (
              orderItems.map((item) => (
                <OrderHistoryItem key={item.id} item={item} />
              ))
            ) : (
              <p className="text-muted">No past orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryItemContainer;
