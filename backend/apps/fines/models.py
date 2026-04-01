from django.db import models
from apps.members.models import Member
from apps.transactions.models import Transaction


class Fine(models.Model):
    STATUS_CHOICES = [
        ('unpaid', 'Unpaid'),
        ('paid', 'Paid'),
        ('waived', 'Waived'),
    ]
    
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='fine')
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='fines')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid')
    paid_at = models.DateTimeField(null=True, blank=True)
    waived_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'fines'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Fine for {self.member} - ৳{self.amount}"


class FineSettings(models.Model):
    fine_per_day = models.DecimalField(max_digits=10, decimal_places=2, default=10.00)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'fine_settings'
        verbose_name_plural = 'Fine Settings'
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists (Singleton pattern)
        if not self.pk and FineSettings.objects.exists():
            raise ValueError("Only one FineSettings instance allowed")
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        settings, _ = cls.objects.get_or_create(pk=1)
        return settings
