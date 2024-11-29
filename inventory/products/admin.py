from django.contrib import admin
from .models import Products, Variant, SubVariant, Stock

@admin.register(Products)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('ProductName', 'ProductCode', 'TotalStock', 'CreatedDate')
    search_fields = ('ProductName', 'ProductCode')

@admin.register(Variant)
class VariantAdmin(admin.ModelAdmin):
    list_display = ('product', 'name')
    list_filter = ('product',)

@admin.register(SubVariant)
class SubVariantAdmin(admin.ModelAdmin):
    list_display = ('variant', 'option')
    list_filter = ('variant__product',)

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('product', 'quantity', 'is_purchase', 'timestamp')
    list_filter = ('is_purchase', 'product')