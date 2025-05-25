from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Product, Cart, CartItem, Transaction
from .serializers import ProductSerializer, DetailedProductSerializer, CartItemSerializer, CartSerializer, SimpleCartSerializers, UserSerializers

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes
import uuid
from decimal import Decimal
from django.conf import settings
from django.http import JsonResponse
from .paytm import generate_checksum, verify_checksum
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
import json
import paypalrestsdk


BASE_URL="http://localhost:5173"


paypalrestsdk.configure({
    "mode": "sandbox",
    "client_id": settings.PAYPAL_CLIENT_ID,
    "client_secret": settings.PAYPAL_CLIENT_SECRET
})


# Create your views here.

@api_view(['GET'])
def products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def product_detail(request, slug):
    product = Product.objects.get(slug=slug)
    serializer = DetailedProductSerializer(product)
    return Response(serializer.data)

@api_view(['POST'])
def add_item(request):
    try:
        cart_code = request.data.get('cart_code')
        product_id= request.data.get('product_id')
        cart, created = Cart.objects.get_or_create(cart_code=cart_code)
        product= Product.objects.get(id=product_id)
        cartitem, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cartitem.quantity = 1
            cartitem.save()

        serializer= CartItemSerializer(cartitem)
        return Response({'data' : serializer.data, 'message': 'Item added to cart'})
    except Exception as e:
        return Response({'error': str(e)}, status=400)


@api_view(['GET'])
def product_in_cart(request):
    cart_code = request.query_params.get('cart_code')
    product_id = request.query_params.get('product_id')

    try:
        cart = Cart.objects.get(cart_code=cart_code)
        product = Product.objects.get(id=product_id)
        product_exists_in_cart = CartItem.objects.filter(cart=cart, product=product).exists()
        return Response({'product_in_cart': product_exists_in_cart})
    
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
@api_view(['GET'])
def get_cart_stat(request):
    try:
        cart_code = request.query_params.get('cart_code')
        cart = Cart.objects.get(cart_code=cart_code, paid=False)
        serializer = SimpleCartSerializers(cart)
        return Response(serializer.data)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=404)
    


@api_view(['GET'])
def get_cart(request):
    try:
        cart_code = request.query_params.get('cart_code')
        cart = Cart.objects.get(cart_code=cart_code, paid=False)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=404)

@api_view(['PATCH'])
def update_quantity(request):
    try:
        cartitem_id = request.data.get('item_id')
        quantity = request.data.get('quantity')
        quantity = int(quantity)
        cartitem = CartItem.objects.get(id=cartitem_id)
        cartitem.quantity = quantity
        cartitem.save()
        serializer = CartItemSerializer(cartitem)
        return Response({'data':serializer.data, 'message': 'CartItem  updated successfully'})
    
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
@api_view(['POST'])
def delete_cartitem(request):
    try:
        cartitem_id = request.data.get('item_id')
        cartitem = CartItem.objects.get(id=cartitem_id)
        cartitem.delete()
        return Response({'message': 'CartItem deleted successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_username(request):
    username = request.user.username
    return Response({'username': username})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    username = request.user
    serializer=UserSerializers(username)
    return Response(serializer.data)



# for paytm payment

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    if request.user:
        try:
            cart_code = request.data.get('cart_code')
            if not cart_code:
                return JsonResponse({'error': 'cart_code is required'}, status=400)

            try:
                cart = Cart.objects.get(cart_code=cart_code)
            except Cart.DoesNotExist:
                return JsonResponse({'error': 'Invalid cart_code'}, status=404)

            user = request.user
            tx_ref = str(uuid.uuid4())

            amount = sum([item.quantity * item.product.price for item in cart.items.all()])
            tax = Decimal("4.00")
            shipping = Decimal("30.00")
            total_amount = amount + tax + shipping

            transaction = Transaction.objects.create(
                ref=tx_ref,
                cart=cart,
                amount=total_amount,
                currency='INR',
                user=user,
                status='pending'
            )

            paytm_params = {
                'MID': settings.PAYTM_MERCHANT_ID,
                'ORDER_ID': tx_ref,
                'CUST_ID': str(user.id),
                'TXN_AMOUNT': str(total_amount),
                'CHANNEL_ID': settings.PAYTM_CHANNEL_ID,
                'WEBSITE': settings.PAYTM_WEBSITE,
                'INDUSTRY_TYPE_ID': settings.PAYTM_INDUSTRY_TYPE_ID,
                'CALLBACK_URL': settings.PAYTM_CALLBACK_URL,
            }

            checksum = generate_checksum(paytm_params, settings.PAYTM_SECRET_KEY)
            paytm_params['CHECKSUMHASH'] = checksum

            # Construct redirect URL
            redirect_url = f"{settings.FRONTEND_URL}/payment-status/"

            return JsonResponse({
                'payment_data': paytm_params,
                'paytm_url': settings.PAYTM_GATEWAY_URL,
                'redirect_url': redirect_url
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)





@csrf_exempt
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def payment_callback(request):
    try:
        if request.method == 'POST':
            # Determine how to read the data
            if request.content_type == 'application/json':
                received_data = json.loads(request.body)
            else:
                received_data = dict(request.POST)

        elif request.method == 'GET':
            received_data = dict(request.GET)
        else:
            return JsonResponse({'error': 'Unsupported method'}, status=405)

        print("Received data:", received_data)

        checksum = received_data.get('CHECKSUMHASH')
        if not checksum:
            return JsonResponse({'error': 'CHECKSUMHASH missing'}, status=400)

        # Prepare paytm params for verification
        paytm_params = {k: v for k, v in received_data.items() if k != 'CHECKSUMHASH'}

        is_valid = verify_checksum(paytm_params, settings.PAYTM_SECRET_KEY, checksum)

        tx_ref = received_data.get('ORDERID')
        status = received_data.get('STATUS', '').lower()

        if is_valid and tx_ref:
            transaction = Transaction.objects.filter(ref=tx_ref).first()
            if transaction:
                transaction.status = status
                transaction.save()

            return redirect(f"{settings.FRONTEND_URL}/payment-status?tx_ref={tx_ref}&status={status}")

        return redirect(f"{settings.FRONTEND_URL}/payment-status?tx_ref=NA&status=failed")

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

# for paypal payment

@api_view(['POST'])
def initiate_paypal_payment(request):
    if request.method == 'POST'and request.user.is_authenticated:
        tx_ref = str(uuid.uuid4())
        user = request.user
        cart_code = request.data.get('cart_code')
        cart = Cart.objects.get(cart_code=cart_code)
        amount = sum([item.quantity * item.product.price for item in cart.items.all()])
        tax = Decimal("4.00")
        shipping = Decimal("30.00")
        total_amount = amount + tax + shipping

        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": f"{BASE_URL}/payment-status?paymentStatus=success&ref={tx_ref}",
                "cancel_url": f"{BASE_URL}/payment-status?paymentStatus=cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Cart Items",
                        "sku": "cart_items",
                        "price": str(total_amount),
                        "currency": "USD",
                        "quantity": str(cart.items.count())
                    }]
                },

                "amount": {
                    "total": str(total_amount),
                    "currency": "USD"
                },
                "description": "Payment for cart items"
            }]
        })

        print("pay_id" , payment)

        transaction, created = Transaction.objects.get_or_create(
            ref=tx_ref,
            cart=cart,
            amount=total_amount,
            # currency='INR',
            user=user,
            status='pending'
        )

        if payment.create():
            for link in payment.links:
                if link.rel == "approval_url":
                    approval_url = link.href
                    return Response({'approval_url': approval_url})
                
        else:
            return Response({'error': payment.error}, status=400)

        return redirect(payment.links[0]['href'])

    else:
        return Response({'error': 'Invalid request'}, status=400)
    


@api_view(['POST'])
def paypal_payment_callback(request):
    payment_id = request.query_params.get('paymentId')
    payer_id = request.query_params.get('payerId')
    ref = request.query_params.get('ref')
    user = request.user

    print("refff", ref)
    transaction = Transaction.objects.filter(ref=ref)

    if payment_id and payer_id:
        payment = paypalrestsdk.Payment.find(payment_id)

        transaction.status = 'completed'
        transaction.save()
        cart = transaction.cart
        cart.paid = True
        cart.save()

        return Response({'message': 'Payment completed successfully', 'submessage': 'You have successfully placed your order' })
    else:
        return Response({'error': 'Invalid payment details'}, status=400)

   