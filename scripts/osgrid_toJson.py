'''converts osgrid csv files to json format

example input:
    "BA1 0AQ",10,375350,164482, ....... other fields

    writes output to json file with postcode as key
    and easting, northing as list:
        {XXXX XXX: [Easting, Northing]}
'''

# import sys
import os
import json
from ToBigJson import parse_line

# PATH = sys.argv[1]
PATH = '/e/DOCS/20_non/05-map-data/data/codepo_aug2020/Data/CSV/'

all_files = [f for f in os.listdir(PATH) if f.endswith('.csv')]

for fname in all_files:
    with open(PATH + fname, newline='') as rows:
        coords = {}
        parse_line(rows, coords)

    output_name = fname.replace('.csv', '.json')
    with open(PATH + output_name, newline='', mode='w') as f_out:
        json.dump(coords, f_out, indent=2)
