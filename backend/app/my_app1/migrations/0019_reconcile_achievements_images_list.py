from django.db import migrations


ENSURE_ACHIEVEMENT_IMAGES_LIST_SQL = """
ALTER TABLE public.achievements
    ADD COLUMN IF NOT EXISTS images_list character varying(500)[];
ALTER TABLE public.achievements
    ALTER COLUMN images_list TYPE character varying(500)[]
    USING images_list::character varying(500)[];
UPDATE public.achievements
SET images_list = ARRAY[]::character varying(500)[]
WHERE images_list IS NULL;
ALTER TABLE public.achievements
    ALTER COLUMN images_list SET NOT NULL;
"""


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0018_actors_gender_override'),
    ]

    operations = [
        migrations.RunSQL(
            sql=ENSURE_ACHIEVEMENT_IMAGES_LIST_SQL,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
