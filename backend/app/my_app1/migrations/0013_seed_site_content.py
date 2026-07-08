from django.db import migrations


SITE_CONTENT = [
    # key, section, label, multiline, order, default value
    ("nav.logo", "Шапка", "Логотип (монограмма)", False, 10, "ННТ"),
    ("nav.brand_full", "Шапка", "Полное название театра", False, 20,
     "Норильский народный театр"),

    ("hero.title", "Главная (над фото)", "Заголовок", False, 10,
     "Норильский народный театр"),
    ("hero.subtitle", "Главная (над фото)", "Подзаголовок", True, 20,
     "Где каждый находит свою сцену и раскрывает творческий потенциал"),

    ("footer.tagline", "Футер", "Описание под названием", True, 10,
     "Профессиональная театральная студия, где каждый может раскрыть "
     "свой творческий потенциал и найти свою сцену."),
    ("footer.director", "Футер", "Руководитель", False, 20,
     "Дустимов Андрей Аидмазонович"),
    ("footer.email", "Футер", "Email", False, 30, "ADustimov@mail.ru"),
    ("footer.phone", "Футер", "Телефон", False, 40, "+7-913-161-00-34"),
    ("footer.address", "Футер", "Адрес", False, 50,
     "г. Норильск, ул. Орджоникидзе, д. 15"),
    ("footer.hours", "Футер", "Часы работы", False, 60,
     "Пн-Сб: 10:00 - 22:00, Вс: 11:00 - 20:00"),
    ("footer.partner_title", "Футер", "Заголовок блока партнёра", False, 70,
     "Наш партнёр"),
    ("footer.partner_text", "Футер", "Текст о партнёре", True, 80,
     "Городской центр культуры — центр развития творчества и досуга "
     "жителей Норильска с 1992 года."),
    ("footer.copyright", "Футер", "Копирайт (год добавляется автоматически)",
     False, 90, "Норильский народный театр. Все права защищены."),

    ("about.title", "О театре", "Заголовок страницы", False, 10, "О театре"),
    ("about.intro", "О театре", "Вступительный текст", True, 20,
     "Театр-студия «Антракт» была основана в 2021 году под руководством "
     "художественного руководителя Андрея Аидмазоновича Дустимова."),
    ("about.mission_title", "О театре", "Заголовок «Миссия»", False, 30,
     "Наша миссия"),
    ("about.mission_text", "О театре", "Текст миссии", True, 40,
     "Мы создаём пространство, где рождается настоящее искусство. "
     "Творчество норильчан для норильчан: вместе мы создаём театр!"),
]


BIRTHDAY_GREETINGS = [
    "Сегодня день рождения у {name}! 🎉 Коллектив Норильского народного театра "
    "от всей души поздравляет и желает вдохновения, ярких ролей и оваций!",
    "С днём рождения, {name}! 🎂 Пусть каждый выход на сцену дарит радость, "
    "а зал всегда встречает тёплыми аплодисментами!",
    "Поздравляем {name} с днём рождения! 🌟 Желаем творческих успехов, "
    "крепкого здоровья и незабываемых премьер!",
]


def seed(apps, schema_editor):
    SiteContent = apps.get_model('my_app1', 'SiteContent')
    for key, section, label, multiline, order, value in SITE_CONTENT:
        SiteContent.objects.get_or_create(
            key=key,
            defaults={
                'value': value,
                'section': section,
                'label': label,
                'multiline': multiline,
                'order': order,
            },
        )

    BirthdayGreeting = apps.get_model('my_app1', 'BirthdayGreeting')
    if not BirthdayGreeting.objects.exists():
        for text in BIRTHDAY_GREETINGS:
            BirthdayGreeting.objects.create(text=text, is_active=True)


def unseed(apps, schema_editor):
    SiteContent = apps.get_model('my_app1', 'SiteContent')
    SiteContent.objects.filter(key__in=[row[0] for row in SITE_CONTENT]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('my_app1', '0012_birthdaygreeting_sitecontent_and_more'),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
