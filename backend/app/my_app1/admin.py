from django.contrib import admin
from .models import (SiteContent, BirthdayGreeting, ActorBirthday,
                     SiteReview, VkParserState)


@admin.register(SiteReview)
class SiteReviewAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'review_date', 'source', 'pinned', 'hidden', 'excluded')
    list_filter = ('source', 'pinned', 'hidden', 'excluded')
    search_fields = ('author_name', 'text')
    readonly_fields = ('vk_owner_id', 'vk_post_id', 'vk_comment_id')

    def delete_model(self, request, obj):
        if obj.vk_comment_id is not None:
            obj.excluded = True
            obj.save(update_fields=['excluded', 'updated_at'])
        else:
            obj.delete()

    def delete_queryset(self, request, queryset):
        queryset.filter(vk_comment_id__isnull=False).update(excluded=True)
        queryset.filter(vk_comment_id__isnull=True).delete()



@admin.register(VkParserState)
class VkParserStateAdmin(admin.ModelAdmin):
    list_display = ('initial_done', 'last_run_at', 'last_result')


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
