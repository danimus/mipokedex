from django.conf.urls import url, include
from . import views

app_name = 'pokemap'

urlpatterns = [

    url(r'^api/(?P<latitude>(\-?\d+(\.\d+)?)+)/(?P<longitude>(\-?\d+(\.\d+)?)+)$', views.PokemonLocation),
    url(r'^$', views.home, name='home'),

]

#urlpatterns = format_suffix_patterns(urlpatterns)


