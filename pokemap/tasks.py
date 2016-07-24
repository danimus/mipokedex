from celery import Celery

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


#app = Celery('tasks', backend='amqp', broker='amqp://localhost')
app = Celery('tasks', backend='amqp', broker='amqp://localhost')


@app.task
def find_poi(coords):

    # LIST POKEMONS
    #pokemon_list=json.load(open('pokemon.json'))

	USERNAME = 'lapokedex'
	PASSWORD = '123456aA?'
	POSITION = (40.762426, -73.982627,0)
	AUTH_SERVICE='ptc'

	# instantiate pgoapi
	api = PGoApi()

	# provide player position on the earth
	api.set_position(*POSITION)

	if not api.login(AUTH_SERVICE, USERNAME, PASSWORD):
		return


	poi = []
	for coord in coords:
	    lat = coord['lat']
	    lng = coord['lng']
	    api.set_position(lat, lng, 0)


	    origin = CellId.from_lat_lng(LatLng.from_degrees(lat, lng)).parent(15)
	    walk = [origin.id()]
	    right = origin.next()
	    left = origin.prev()

	    # Search around provided radius
	    for i in range(10):
	        walk.append(right.id())
	        walk.append(left.id())
	        right = right.next()
	        left = left.prev()

	    # Return everything
	    cell_ids = sorted(walk)

	    timestamps = [0,] * len(cell_ids)
	    api.get_map_objects(latitude = util.f2i(lat), longitude = util.f2i(lng), since_timestamp_ms = timestamps, cell_id = cell_ids)
	    response_dict = api.call()
	    if 'status' in response_dict['responses']['GET_MAP_OBJECTS']:
	        if response_dict['responses']['GET_MAP_OBJECTS']['status'] == 1:
	            for map_cell in response_dict['responses']['GET_MAP_OBJECTS']['map_cells']:
	                if 'wild_pokemons' in map_cell:
	                    for pokemon in map_cell['wild_pokemons']:
	                        pokekey = '{}-{}'.format(pokemon['spawnpoint_id'], pokemon['pokemon_data']['pokemon_id'])
	                        pokemon['hides_at'] = time.time() + pokemon['time_till_hidden_ms']/1000
	                        poi.append(pokemon)


	return poi









