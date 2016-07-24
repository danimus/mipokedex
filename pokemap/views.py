# Celery
from celery import group
from pokemap.tasks import find_poi

from django.shortcuts import render
from django.http import HttpResponse
import json

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
	return render(request, 'pokemap/index.html')

# Create your views here.
def PokemonLocation(request, latitude, longitude):

	USERNAME = 'lapokedex'
	PASSWORD = '123456aA?'
	POSITION = (float(latitude), float(longitude))
	AUTH_SERVICE='ptc'

	step_size = 0.0015
	step_limit = 49
	coords = generate_spiral(POSITION[0], POSITION[1], step_size, step_limit)


	job = group([
	    find_poi.subtask((coords[0:10],)),
	    find_poi.subtask((coords[10:20],)),
	    find_poi.subtask((coords[20:30],)),
	    find_poi.subtask((coords[30:40],)),
	    find_poi.subtask((coords[40:50],)),
	])



	print " "
	print " "
	print "START"
	print " "
	print " "

	result = job.apply_async()
	data = result.join()

	json_dict  = []

	if data != []:
		for d in data:
			json_dict += d
		print json_dict

	print " "
	print " "
	print "END"
	print " "
	print " "


	##find_poi(api, POSITION[0], POSITION[1])
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