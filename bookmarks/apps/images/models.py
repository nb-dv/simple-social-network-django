from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Image(models.Model):
    # TODO(mk-dv): Check for grammar.
    """
    An image is added by an user.

    Attributes:
        image (ImageField):
            The image.
        user (ForeignKey):
            A user who added this image.
        users_liked (ManyToManyField):
            Users who liked this image.
        title (CharField):
            Image title.
        description (TextField):
            Image description.
        url (URLField):
            Link to source of image.
        slug (SlugField):
            Image slug generated from title.
        created (DateField):
            The date the image was created.
    """

    image = models.ImageField(upload_to='images/%Y/%m/%d/')

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='images_created',
        on_delete=models.CASCADE
    )

    users_liked = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='images_liked',
        blank=True
    )

    title = models.CharField(max_length=200),
    description = models.TextField(blank=True)
    url = models.URLField()
    slug = models.SlugField(max_length=200, blank=True)
    created = models.DateField(auto_now_add=True, db_index=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
