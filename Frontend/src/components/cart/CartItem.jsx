import React, { useState } from 'react';
import api, { BASE_URL } from '../../api';
import { toast } from 'react-toastify';

const CartItem = ({ item, setCartTotal, cartItems, setCartItems, setNumCartItems }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const [loading, setLoading] = useState(false);

    const itemId = { item_id: item.id };


    const updateCartItem = () => {
        setLoading(true);
        api.patch("update_quantity/", {
            item_id: item.id,
            quantity: quantity,
        })
            .then(res => {
                const updatedItem = res.data.data;
                const updatedCartItems = cartItems.map(item =>
                    item.id === updatedItem.id ? updatedItem : item
                );
                setCartItems(updatedCartItems);
                setLoading(false);
                const total = updatedCartItems.reduce((acc, curr) => acc + curr.total, 0)
                toast.success("Cart item Updated Successfully");
                setCartTotal(total);
                setNumCartItems(cartItems.map((cartitem) => cartitem.id == item.id ? res.data.data : cartitem)
                    .reduce((acc, curr) => acc + curr.quantity, 0))


            })
            .catch(err => console.log(err.message));
    };

    function deleteCartItem() {
        const confirmDelete = window.confirm("Are you sure you want to remove this item from your cart?");
        if (!confirmDelete) return;

        api.post("delete_cartitem/", { item_id: item.id })
            .then(res => {
                console.log(res.data);
                toast.success("Item removed from cart");

                const updatedCartItems = cartItems.filter(cartitem => cartitem.id !== item.id);
                setCartItems(updatedCartItems);

                const newTotal = updatedCartItems.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0);
                setCartTotal(newTotal);

                const newQuantity = updatedCartItems.reduce((acc, curr) => acc + curr.quantity, 0);
                setNumCartItems(newQuantity);
            })
            .catch(err => {
                console.error("Failed to delete item:", err.message);
                toast.error("Failed to remove item from cart.");
            });
    }


    return (
        <div
            className="card mb-3 border-0 shadow-sm"
            style={{
                maxWidth: '720px',
                height: '140px',
                margin: '0 auto',
                borderRadius: '16px',
            }}
        >
            <div className="d-flex h-100 align-items-center px-3 py-3">
                <div
                    className="me-3 d-flex justify-content-center align-items-center bg-light"
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}
                >
                    <img
                        src={`${BASE_URL}${item.product.image}`}
                        className="img-fluid"
                        alt="Product"
                        style={{ maxHeight: '90px', objectFit: 'contain' }}
                    />
                </div>
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="mb-0 text-truncate fw-semibold" style={{ maxWidth: '60%' }}>
                            {item.product.name}
                        </h6>
                        <span className="text-muted fw-bold">₹ {item.product.price}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2" style={{ gap: '30px' }}>
                        <div className="input-group input-group-sm" style={{ width: '110px' }}>
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            >
                                −
                            </button>
                            <div className="form-control text-center fw-bold">
                                {quantity}
                            </div>
                            <button
                                className="btn btn-outline-secondary "
                                type="button"
                                onClick={() => setQuantity(prev => prev + 1)}
                            >
                                +
                            </button>
                        </div>
                        <button
                            className="btn btn-sm btn-primary text-white"
                            onClick={updateCartItem}
                            disabled={loading}
                        >
                            <i className="bi bi-arrow-repeat me-1"></i> {loading ? 'Updating...' : 'Update'}
                        </button>
                        <button
                            className="btn btn-sm btn-danger text-white"
                            onClick={deleteCartItem}
                        >
                            <i className="bi bi-trash me-1"></i> Remove
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CartItem;
