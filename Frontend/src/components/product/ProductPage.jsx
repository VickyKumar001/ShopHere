import { useEffect, useState } from "react";
import ProductPagePlaceHolder from "./ProductPagePlaceHolder";
import RelatedProducts from "./RelatedProducts";
import { useParams } from "react-router-dom";
import api, { BASE_URL } from "../../api";
import { toast } from "react-toastify";

const ProductPage = ({ setNumCartItems }) => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [similiarProducts, setSimilarProducts] = useState([]);
    const [inCart, setInCart] = useState(false);
    const cart_code = localStorage.getItem("cart_code")

    useEffect(() => {
        if (product?.id) {
            api.get(`product_in_cart?cart_code=${cart_code}&product_id=${product.id}`)
                .then(res => {
                    console.log(res.data);
                    setInCart(res.data.product_in_cart);
                })
                .catch(err => {
                    console.log(err.message);
                });
        }
    }, [product?.id, cart_code]);



    function add_item() {
        const newItem = { cart_code: localStorage.getItem("cart_code"), product_id: product.id };

        api.post("add_item/", newItem)
            .then(res => {
                console.log(res.data)
                setNumCartItems(curr => curr + 1);
                toast.success("Item added to cart successfully");
                setInCart(true);
            })
            .catch(err => console.log(err.message));
    }

    useEffect(() => {
        if (localStorage.getItem('cart_code') === null) {
            localStorage.setItem('cart_code', randomValue);
        }
    }, [])

    useEffect(() => {
        setLoading(true);
        api.get(`product_detail/${slug}`)
            .then(response => {
                console.log(response.data);
                setProduct(response.data);
                setSimilarProducts(response.data.similar_products || []);
                setLoading(false);
            })
            .catch(error => {
                console.error(error.message);
                setLoading(false);
            });
    }, [slug]);

    return loading || !product ? (
        <ProductPagePlaceHolder />
    ) : (
        <div>
            <section className='py-3'>
                <div className='container px-4 px-lg-5 my-5'>
                    <div className='row gx-4 gx-lg-5 align-items-center'>
                        <div className='col-md-6'>
                            <img
                                className='card-img-top mb-5 mb-md-0'
                                src={`${BASE_URL}${product.image}`}
                                alt='Product Image'
                            />
                        </div>
                        <div className='col-md-6'>
                            <div className='small mb-1'>SKU: BST-001</div>
                            <h1 className='display-5 fw-bolder'>{product.name}</h1>
                            <div className='fs-5 mb-5'>
                                {/* <span className='text-decoration-line-through'>$45.00</span> */}
                                <span>${product.price}</span>
                            </div>
                            <p className='lead'>{product.description}</p>
                            <div className='d-flex'>
                                {/* <input
                  className='form-control text-center me-3'
                  id='inputQuantity'
                  type='num'
                  value='1'
                  style={{ maxWidth: '3rem' }}
                /> */}
                                <button className='btn btn-outline-dark flex-shrink-0' type='button' onClick={add_item} disabled={inCart}>
                                    <i className='bi-cart-fill me-1'></i>
                                    {inCart ? "Already in Cart" : "Add to cart"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <RelatedProducts products={similiarProducts} />
        </div>
    );
};

export default ProductPage;
