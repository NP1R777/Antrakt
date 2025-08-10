from django.apps import AppConfig


class MyApp1Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'my_app1'

    def ready(self):
        # Lazily create the bucket on startup if using MinIO storage
        from django.conf import settings
        if getattr(settings, 'USE_MINIO_STORAGE', False):
            try:
                import boto3
                from botocore.exceptions import ClientError

                s3_client = boto3.client(
                    's3',
                    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                    region_name=settings.AWS_S3_REGION_NAME,
                )
                bucket = settings.AWS_STORAGE_BUCKET_NAME
                try:
                    s3_client.head_bucket(Bucket=bucket)
                except ClientError:
                    s3_client.create_bucket(Bucket=bucket)
                    # Make objects publicly readable by default via bucket policy
                    public_policy = {
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Sid": "PublicReadGetObject",
                                "Effect": "Allow",
                                "Principal": "*",
                                "Action": ["s3:GetObject"],
                                "Resource": [f"arn:aws:s3:::{bucket}/*"]
                            }
                        ]
                    }
                    s3_client.put_bucket_policy(
                        Bucket=bucket,
                        Policy=__import__('json').dumps(public_policy)
                    )
            except Exception:
                # Fail silently to not block app startup in dev
                pass
