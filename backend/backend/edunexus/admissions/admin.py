from django.contrib import admin
from .models import Application, Document, FAQ

admin.site.register(Application)
admin.site.register(Document)
admin.site.register(FAQ)
