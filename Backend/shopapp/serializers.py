from rest_framework import serializers
from .models import Product, Cart, CartItem
from django.contrib.auth import get_user_model

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'image', 'description', 'category', 'price']


class DetailedProductSerializer(serializers.ModelSerializer):
    similar_products = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'slug', 'image', 'description', 'similar_products']

    def get_similar_products(self, product):
        products= Product.objects.filter(category=product.category).exclude(id=product.id)
        serializer = ProductSerializer(products, many=True)
        return serializer.data

class CartItemSerializer(serializers.ModelSerializer):
    product= ProductSerializer(read_only=True)
    total= serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ['id', 'quantity', 'product','total'] 

    def get_total(self, cartitem):
        total= cartitem.quantity * cartitem.product.price
        return total

class CartSerializer(serializers.ModelSerializer):
    items= CartItemSerializer(read_only=True, many=True)
    sum_total= serializers.SerializerMethodField()
    num_of_items= serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ['id', 'cart_code', 'items' , 'sum_total', 'num_of_items','created_at', 'modified_at']

    def get_sum_total(self, cart):
        sum_total= sum([item.quantity * item.product.price for item in cart.items.all()])
        return sum_total
    
    def get_num_of_items(self, cart):
        num_of_items= sum([item.quantity for item in cart.items.all()])
        return num_of_items
    


class SimpleCartSerializers(serializers.ModelSerializer):
    number_of_items= serializers.SerializerMethodField() 
    class Meta:
        model=Cart
        fields= ['id', 'cart_code', 'number_of_items']

    def get_number_of_items(self, cart):
        number_of_items= sum([item.quantity for item in cart.items.all()])
        return number_of_items


class NewCartItemSerializer(serializers.ModelSerializer):
    product= ProductSerializer(read_only=True)
    order_id= serializers.SerializerMethodField()
    order_date= serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ['id',  'product', 'quantity', 'order_id', 'order_date'] 

    def get_order_id(self, cartitem):
        return cartitem.cart.id

    def get_order_date(self, cartitem):
        return cartitem.cart.created_at

class UserSerializers(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'email', 'city', 'state', 'address', 'phone', 'items'
        ]

    def get_items(self, user):
        cartitems = CartItem.objects.filter(cart__user=user, cart__paid=True)[:10]
        serializer = NewCartItemSerializer(cartitems, many=True)
        return serializer.data
