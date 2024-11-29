# products/urls.py
from django.urls import path
from .views import CreateProductAPIView, ListProductsAPIView, AddStockAPIView, RemoveStockAPIView

urlpatterns = [
    path('create/', CreateProductAPIView.as_view(), name='create-product'),
    path('list/', ListProductsAPIView.as_view(), name='list-products'),
    path('<str:product_id>/add-stock/', AddStockAPIView.as_view(), name='add-stock'),
    path('<str:product_id>/remove-stock/', RemoveStockAPIView.as_view(), name='remove-stock'),
]