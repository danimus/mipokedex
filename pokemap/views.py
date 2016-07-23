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



# Create your views here.
def PokemonLocation(request, latitude, longitude):

	USERNAME = 'lapokedex'
	PASSWORD = '123456aA?'
	POSITION = (float(latitude), float(longitude),0)
	AUTH_SERVICE='ptc'

	# instantiate pgoapi
	api = PGoApi()

	# provide player position on the earth
	api.set_position(*POSITION)

	if not api.login(AUTH_SERVICE, USERNAME, PASSWORD):
	    return

	# chain subrequests (methods) into one RPC call

	# get player profile call
	# ----------------------
	api.get_player()

	# execute the RPC call
	response_dict = api.call()

	# apparently new dict has binary data in it, so formatting it with this method no longer works, pprint works here but there are other alternatives    
	# print('Response dictionary: \n\r{}'.format(json.dumps(response_dict, indent=2)))
	# print('Response dictionary: \n\r{}'.format(pprint.PrettyPrinter(indent=4).pformat(response_dict)))
	data = find_poi(api, POSITION[0], POSITION[1])
	return HttpResponse(json.dumps(data))

def home(request):
	return render(request, 'pokemap/index.html')



def get_pos_by_name(location_name):
    geolocator = GoogleV3()
    loc = geolocator.geocode(location_name)
    return (loc.latitude, loc.longitude, loc.altitude)

def get_cell_ids(lat, long, radius = 10):
    origin = CellId.from_lat_lng(LatLng.from_degrees(lat, long)).parent(15)
    walk = [origin.id()]
    right = origin.next()
    left = origin.prev()

    # Search around provided radius
    for i in range(radius):
        walk.append(right.id())
        walk.append(left.id())
        right = right.next()
        left = left.prev()

    # Return everything
    return sorted(walk)

def encode(cellid):
    output = []
    encoder._VarintEncoder()(output.append, cellid)
    return ''.join(output)

def find_poi(api, lat, lng):


	pokemon_list=json.load(open('pokemon.json'))

	poi = []
	step_size = 0.0015
	step_limit = 49
	coords = generate_spiral(lat, lng, step_size, step_limit)
	for coord in coords:
	    lat = coord['lat']
	    lng = coord['lng']
	    api.set_position(lat, lng, 0)

	    
	    #get_cellid was buggy -> replaced through get_cell_ids from pokecli
	    #timestamp gets computed a different way:
	    cell_ids = get_cell_ids(lat, lng)
	    timestamps = [0,] * len(cell_ids)
	    api.get_map_objects(latitude = util.f2i(lat), longitude = util.f2i(lng), since_timestamp_ms = timestamps, cell_id = cell_ids)
	    response_dict = api.call()
	    if 'status' in response_dict['responses']['GET_MAP_OBJECTS']:
	        if response_dict['responses']['GET_MAP_OBJECTS']['status'] == 1:
	            for map_cell in response_dict['responses']['GET_MAP_OBJECTS']['map_cells']:
	                if 'wild_pokemons' in map_cell:
	                    for pokemon in map_cell['wild_pokemons']:
	                        pokekey = get_key_from_pokemon(pokemon)
	                        pokemon_ids = pokekey.split('-')
	                        pokemon['pokemon_name'] = pokemon_list[pokemon_ids[1]]
	                        pokemon['hides_at'] = time.time() + pokemon['time_till_hidden_ms']/1000
	                        poi.append(pokemon)

        # time.sleep(0.51)
    # new dict, binary data
    #print('POI dictionary: \n\r{}'.format(pprint.PrettyPrinter(indent=4).pformat(poi)))
	return poi

def get_key_from_pokemon(pokemon):
    return '{}-{}'.format(pokemon['spawnpoint_id'], pokemon['pokemon_data']['pokemon_id'])

def generate_spiral(starting_lat, starting_lng, step_size, step_limit):
    coords = [{'lat': starting_lat, 'lng': starting_lng}]
    steps,x,y,d,m = 1, 0, 0, 1, 1
    rlow = 0.0
    rhigh = 0.0005

    while steps < step_limit:
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