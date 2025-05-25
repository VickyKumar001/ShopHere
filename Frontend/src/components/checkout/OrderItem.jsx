import React from 'react'
import { BASE_URL } from '../../api'

const OrderItem = ({item}) => {
    return (
        <div className='d-flex justify-content-between align-items-center mb-2' style={{borderBottom: "1px solid #ccc"}}>
            <div className='d-flex align-items-center'>
                <img src={`${BASE_URL}${item.product.image}`} alt="Product Image" 
                style={{width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px"}}/>
                <div className='ms-3'>
                    <h6 className='fw-bold mb-0'>{item.product.name}</h6>
                    <small>Quantity: {item.quantity}</small>
                </div>
            </div>
            <div>   
                <h6>₹ {item.total}</h6>
            </div>
        </div>
    )
}

export default OrderItem