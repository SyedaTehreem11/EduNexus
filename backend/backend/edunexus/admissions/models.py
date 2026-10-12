# Create your models here.
# admissions/models.py

from django.db import models
from django.contrib.auth.models import User


# class User(models.Model):
#     name = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     password_hash = models.CharField(max_length=255)

#     def __str__(self):
#         return self.name

class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dob = models.DateField()
    cnic = models.CharField(max_length=15)
    status = models.CharField(
        max_length=20,
        choices=[("Pending", "Pending"), ("Complete", "Complete"), ("Manual Review", "Manual Review")],
        default="Pending"
    )

    def __str__(self):
        return f"{self.user.name} - {self.status}"

class Document(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    doc_type = models.CharField(max_length=50)  # e.g. CNIC, Birth Certificate
    file_path = models.CharField(max_length=255)
    verification_status = models.CharField(
        max_length=20,
        choices=[("Verified", "Verified"), ("Missing", "Missing"), ("Manual Review", "Manual Review")],
        default="Manual Review"
    )

    def __str__(self):
        return f"{self.doc_type} - {self.verification_status}"

class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    embedding_vector = models.BinaryField(null=True, blank=True)  # store chatbot embeddings

    def __str__(self):
        return self.question
