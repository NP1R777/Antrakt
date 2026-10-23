from io import BytesIO
import warnings

from PIL import Image, ImageOps, UnidentifiedImageError
from rest_framework.exceptions import ValidationError


MAX_FILE_BYTES = 10 * 1024 * 1024
MAX_PIXELS = 16_000_000
MAX_DIMENSION = 8192
FORMATS = {'JPEG', 'PNG', 'GIF', 'WEBP'}


def normalize_image(upload, *, png=False):
    """Decode and re-encode trusted pixels only; never store the original payload."""
    raw = upload.read(MAX_FILE_BYTES + 1)
    if not raw or len(raw) > MAX_FILE_BYTES:
        raise ValidationError({'image': 'Размер изображения должен быть от 1 байта до 10 МБ.'})
    try:
        with warnings.catch_warnings():
            warnings.simplefilter('error', Image.DecompressionBombWarning)
            with Image.open(BytesIO(raw)) as source:
                width, height = source.size
                if source.format not in FORMATS:
                    raise ValidationError({'image': 'Допустимы только JPEG, PNG, WebP и статический GIF.'})
                if width * height > MAX_PIXELS or max(width, height) > MAX_DIMENSION:
                    raise ValidationError({'image': 'Максимум 16 мегапикселей и 8192 пикселя по стороне.'})
                if getattr(source, 'n_frames', 1) != 1:
                    raise ValidationError({'image': 'Анимация не поддерживается. Загрузите статическое изображение.'})
                source.verify()
            with Image.open(BytesIO(raw)) as source:
                source.load()  # Reject truncated files before contacting S3.
                oriented = ImageOps.exif_transpose(source)
                pixels = oriented.convert('RGBA')
                clean = Image.new('RGBA', pixels.size)
                clean.paste(pixels)
                output = BytesIO()
                clean.save(output, format='PNG' if png else 'WEBP', **({} if png else {'quality': 88}))
                output.seek(0)
                return output, ('png', 'image/png') if png else ('webp', 'image/webp')
    except (UnidentifiedImageError, OSError, SyntaxError, ValueError, Image.DecompressionBombError, Image.DecompressionBombWarning):
        raise ValidationError({'image': 'Файл повреждён или не является допустимым изображением.'})
