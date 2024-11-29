
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class Products(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ProductID = models.BigIntegerField(unique=True)
    ProductCode = models.CharField(max_length=255, unique=True)
    ProductName = models.CharField(max_length=255)
    ProductImage = models.ImageField(upload_to="uploads/", blank=True, null=True)
    CreatedDate = models.DateTimeField(auto_now_add=True)
    UpdatedDate = models.DateTimeField(blank=True, null=True)
    CreatedUser = models.ForeignKey(User, related_name="user_products", on_delete=models.CASCADE)
    IsFavourite = models.BooleanField(default=False)
    Active = models.BooleanField(default=True)
    HSNCode = models.CharField(max_length=255, blank=True, null=True)
    TotalStock = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)

    def __str__(self):
        return self.ProductName

    def update_total_stock(self):
        """Update total stock based on stock movements"""
        total_purchased = self.stocks.filter(is_purchase=True).aggregate(
            models.Sum('quantity')
        )['quantity__sum'] or 0
        total_sold = self.stocks.filter(is_purchase=False).aggregate(
            models.Sum('quantity')
        )['quantity__sum'] or 0
        self.TotalStock = total_purchased - total_sold
        self.save()


    class Meta:
        db_table = "products_product"
        verbose_name = "product"
        verbose_name_plural = "products"
        unique_together = (("ProductCode", "ProductID"),)
        ordering = ("-CreatedDate", "ProductID")

class Variant(models.Model):
    product = models.ForeignKey(Products, related_name="variants", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product.ProductName} - {self.name}"


class SubVariant(models.Model):
    variant = models.ForeignKey(Variant, related_name="subvariants", on_delete=models.CASCADE)
    option = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.variant.name}: {self.option}"




class Stock(models.Model):
    product = models.ForeignKey(Products, related_name="stocks", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])  # Must be positive
    is_purchase = models.BooleanField()  # True for Purchase, False for Sale
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.product.update_total_stock()