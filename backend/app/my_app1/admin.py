from django.contrib import admin
from .models import SiteContent, BirthdayGreeting, ActorBirthday


@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    list_display = ('key', 'section', 'label', 'updated_at')
    list_filter = ('section',)
    search_fields = ('key', 'label', 'value')


@admin.register(BirthdayGreeting)
class BirthdayGreetingAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'is_active')
    list_filter = ('is_active',)


@admin.register(ActorBirthday)
class ActorBirthdayAdmin(admin.ModelAdmin):
    list_display = ('id', 'actor', 'birth_date')
    search_fields = ('actor__name',)
