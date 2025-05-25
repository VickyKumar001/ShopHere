import { useEffect, useState } from "react";
import api from "../api";

function useCartData() {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0.00);
    const [loading, setloading] = useState(false);
    const tax = 4.00


    const cart_code = localStorage.getItem("cart_code")
    useEffect(() => {
        setloading(true);
        api.get(`get_cart?cart_code=${cart_code}`
        ).then(res => {
            console.log(res.data);
            setloading(false);
            setCartItems(res.data.items);
            setCartTotal(res.data.sum_total);
        }).catch(err => {
            console.log(err.message);   
            setloading(false);
        });
    }, [cart_code])

    return { cartItems, cartTotal, loading, tax, setCartItems, setCartTotal, setloading };
}

export default useCartData