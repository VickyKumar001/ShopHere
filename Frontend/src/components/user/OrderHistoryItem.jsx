import React from 'react';
import { BASE_URL } from '../../api';

const OrderHistoryItem = ({ item }) => {
  const {
    product = {},
    quantity = 0,
    order_date,
    order_id,
  } = item || {};

  const formattedDate = order_date
    ? new Date(order_date).toLocaleDateString()
    : 'N/A';

  const productImage = product.image
    ? `${BASE_URL}${product.image}`
    : '/placeholder.png';

  return (
    <div className="rounded-2xl shadow-md bg-white p-4 mb-4 transition hover:shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
        <div>
          <h5 className="text-lg font-semibold text-gray-800">Order Summary</h5>
          <p className="text-sm text-gray-500">Placed on {formattedDate}</p>
        </div>
      </div>

      <div className="border-t pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <img
            src={productImage}
            alt={product.name || 'Product image'}
            className="w-16 h-16 object-cover rounded-md border"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">
              {product.name || 'Product Name'}
            </p>
            <p className="text-xs text-gray-500">Quantity: {quantity}</p>
            <p className="text-xs text-gray-500">Order ID: {order_id || 'N/A'}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-700 font-semibold">
            Price: ₹{product?.price ? product.price.toFixed(2) : '0.00'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryItem;
