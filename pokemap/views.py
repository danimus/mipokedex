# Celery
from celery import group
from pokemap.tasks import find_poi

from django.shortcuts import render
from django.http import HttpResponse
import json
from django.conf import settings

# Required imports
import os
import re
import sys
import json
import time
import struct
import random
import logging
import requests
import argparse
import pprint


# Required for PGoAPI
from pgoapi import PGoApi
from pgoapi.utilities import f2i, h2f
from pgoapi import utilities as util

from google.protobuf.internal import encoder
from geopy.geocoders import GoogleV3
from s2sphere import Cell, CellId, LatLng

def home(request):

	return render(request, 'pokemap/index.html', {"maps_api": settings.MAPS_KEY})

# Create your views here.
def PokemonLocation(request, latitude, longitude):

	position = (float(latitude), float(longitude),0)
	step_size = 0.0015
	step_limit = 49
	coords = generate_spiral(position[0], position[1], step_size, step_limit)

	job = group([
		find_poi.subtask((coords[0:10],position, 1)),
		find_poi.subtask((coords[10:20],position, 2)),
		find_poi.subtask((coords[20:30],position, 3)),
		find_poi.subtask((coords[30:40],position, 4)),
		find_poi.subtask((coords[40:50],position, 1)),
	])

	result = job.apply_async()
	data = result.join()

	json_dict  = []

	if data != []:
		for d in data:
			json_dict += d
		print json_dict

	##find_poi(api, position[0], position[1])
	return HttpResponse(json.dumps(json_dict), content_type="application/json")



def generate_spiral(starting_lat, starting_lng, step_size, step_limit):
	coords = [{'lat': starting_lat, 'lng': starting_lng}]
	steps,x,y,d,m = 1, 0, 0, 1, 1
	rlow = 0.0
	rhigh = 0.0005

	while steps < 49:
		while 2 * x * d < m and steps < step_limit:
			x = x + d
			steps += 1
			lat = x * step_size + starting_lat + random.uniform(rlow, rhigh)
			lng = y * step_size + starting_lng + random.uniform(rlow, rhigh)
			coords.append({'lat': lat, 'lng': lng})
		while 2 * y * d < m and steps < step_limit:
			y = y + d
			steps += 1
			lat = x * step_size + starting_lat + random.uniform(rlow, rhigh)
			lng = y * step_size + starting_lng + random.uniform(rlow, rhigh)
			coords.append({'lat': lat, 'lng': lng})

		d = -1 * d
		m = m + 1
	return coords