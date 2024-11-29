# products/serializers.py
from rest_framework import serializers
from .models import Products, Variant, SubVariant, Stock

class SubVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVariant
        fields = ['id', 'option']

class VariantSerializer(serializers.ModelSerializer):
    subvariants = SubVariantSerializer(many=True)

    class Meta:
        model = Variant
        fields = ['id', 'name', 'subvariants']

class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, required=False)  # Allow variants in payload

    class Meta:
        model = Products
        fields = ['id', 'ProductID', 'ProductName', 'ProductCode', 'variants', 'TotalStock', 'ProductImage']
        extra_kwargs = {
            'ProductImage': {'required': False}
        }

    def create(self, validated_data):
        variants_data = validated_data.pop('variants', [])
        product = super().create(validated_data)
        
        for variant_data in variants_data:
            subvariants_data = variant_data.pop('subvariants', [])
            variant = Variant.objects.create(product=product, **variant_data)
            
            for subvariant_data in subvariants_data:
                SubVariant.objects.create(variant=variant, **subvariant_data)
        
        return product


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'product', 'quantity', 'is_purchase', 'timestamp']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be a positive integer.")
        return value

