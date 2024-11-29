import uuid
import time 
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
import json


from .models import Products, Variant, SubVariant, Stock
from .serializers import ProductSerializer, StockSerializer

logger = logging.getLogger(__name__)

class CreateProductAPIView(APIView):
    def post(self, request):
        try:
            # Fallback to a default user if no authentication
            user = request.user if request.user.is_authenticated else User.objects.first()

            # Add default values if not provided
            request.data['ProductID'] = request.data.get('ProductID', int(time.time()))
            request.data['ProductCode'] = request.data.get('ProductCode', f'PROD-{int(time.time())}')
            
            # Handle image upload
            product_image = request.FILES.get('ProductImage')
            
            # Parse variants from JSON
            variants_data = json.loads(request.data.get('variants', '[]'))
            
            # Prepare data for serializer
            data = {
                'ProductName': request.data.get('ProductName'),
                'ProductID': request.data['ProductID'],
                'ProductCode': request.data['ProductCode'],
                'variants': variants_data
            }
            
            serializer = ProductSerializer(data=data)
            if not serializer.is_valid():
                # Log validation errors
                logger.error(f"Validation Errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Save the product
            with transaction.atomic():
                product = serializer.save(CreatedUser=user, ProductImage=product_image)
            
            # Return success response
            return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            logger.error(f"Product creation error: {str(e)}")
            return Response(
                {"error": "Unable to create productt", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ListProductsAPIView(APIView):
    def get(self, request):
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        
        start = (page - 1) * page_size
        end = start + page_size
        
        products = Products.objects.all()[start:end]
        total_products = Products.objects.count()
        
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response({
            'products': serializer.data,
            'total': total_products,
            'page': page,
            'pages': (total_products + page_size - 1) // page_size
        })  

class AddStockAPIView(APIView):
    def post(self, request, product_id):
        try:
            logger.error(f"Received product_id: {product_id}")
            logger.error(f"Full request data: {request.data}")
            print("Received Variantss:", request.data.get('variants'))   

            # Try to get the product using ProductID instead of UUID
            try:
                # Use ProductID instead of UUID
                product = Products.objects.get(ProductID=product_id)
            except Products.DoesNotExist:
                return Response({'error': f'Product with ID {product_id} not found'}, status=status.HTTP_404_NOT_FOUND)
            
            quantity = request.data.get('quantity')
            logger.error(f"Quantity: {quantity}")

            # Validate quantity
            if not quantity or int(quantity) <= 0:
                return Response({'error': 'Quantity must be a positive integer'}, status=status.HTTP_400_BAD_REQUEST)

            # Create stock entry
            stock_entry = Stock.objects.create(
                product=product,
                quantity=int(quantity),
                is_purchase=True
            )
            
            serializer = StockSerializer(stock_entry)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Detailed error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class RemoveStockAPIView(APIView):
    def post(self, request, product_id):
        try:
            logger.error(f"Received product_id: {product_id}")
            logger.error(f"Full request data: {request.data}")

            # Use ProductID instead of UUID
            try:
                product = Products.objects.get(ProductID=product_id)
            except Products.DoesNotExist:
                return Response({'error': f'Product with ID {product_id} not found'}, status=status.HTTP_404_NOT_FOUND)
            
            quantity = request.data.get('quantity')
            logger.error(f"Quantity: {quantity}")

            # Validate quantity
            if not quantity or int(quantity) <= 0:
                return Response({'error': 'Quantity must be a positive integer'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if sufficient stock is available
            if product.TotalStock < int(quantity):
                return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create a stock entry for sale
            stock_entry = Stock.objects.create(
                product=product,
                quantity=int(quantity),
                is_purchase=False
            )
            
            serializer = StockSerializer(stock_entry)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            logger.error(f"Detailed error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
