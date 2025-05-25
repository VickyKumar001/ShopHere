import React, { useState } from 'react'
import styles from './PaymentSection.module.css'
import api from '../../api';

const PaymentSection = () => {

    const cart_code= localStorage.getItem("cart_code");
    const [loading, setLoading] = useState(false);

    function makePayment() {
        setLoading(true);
        api.post("initiate_payment/", { cart_code })
            .then(res => {
                setLoading(false);
                const paytmParams = res.data.payment_data;
                const paytmUrl = res.data.paytm_url;

                // Create form element
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = paytmUrl;

                // Add payment data as hidden fields
                for (const key in paytmParams) {
                    if (paytmParams.hasOwnProperty(key)) {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = paytmParams[key];
                        form.appendChild(input);
                    }
                }

                // Append form to body and submit
                document.body.appendChild(form);
                form.submit();
            })
            .catch(err => {
                setLoading(false);
                console.error('Payment initiation failed:', err.message);
            });
    }


    function makePaypalPayment() {
        setLoading(true);
        api.post("initiate_paypal_payment/", { cart_code })
            .then(res => {
                setLoading(false);
                console.log(res.data);
                if(res.data.approval_url){
                    window.location.href = res.data.approval_url;
                }
            })
            .catch(err => {
                setLoading(false);
                console.error('PayPal payment initiation failed:', err.message);
            });
    }

    return (
        <div className='col-md-4'>
            <div className={`card ${styles.card}`}>
                <div className='card-header' style={{ background: '#6050DC', color: 'white' }}>
                    <h5>Payment Option</h5>
                </div>

                <div className='card-body'>
                    <button className={`btn btn-primary w-100 mb-3 ${styles.flutterwaveButton}`} id='flutterwave-button' disabled={loading} onClick={makePayment}>
                        <i className='bi bi-credit-card'></i>
                        Pay with Paytm
                    </button>

                    <button className={`btn btn-danger w-100 mb-3 ${styles.paypalButton}`} id='paypal-button' disabled={loading} onClick={makePaypalPayment}>
                        <i className='bi bi-credit-card'></i>
                        Pay with PayPal
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PaymentSection