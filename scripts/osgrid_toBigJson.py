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

# PATH = sys.argv[1]
PATH = '/e/DOCS/20_non/05-map-data/data/codepo_aug2020/Data/CSV/'

all_files = [f for f in os.listdir(PATH) if f.endswith('.csv')]


def parse_line(lines, dict_out):
    '''line consists of the following fields:
    postcode, positional_quality_indicator, easting, northing,
     + other non-relevant info.

    quality indicator of 90 means it is location info
    so these are skipped

    example input:
    "BA1 0AQ",10,375350,164482, ....... other fields

    writes output to dictionary with key as postcode:
    {XXXX XXX: [Easting, Northing]}
    '''

    for line in lines:
        fields = line.split(',')
        postcode = fields[0][1:-1]
        quality = fields[1]
        easting = float(fields[2])
        northing = float(fields[3])

        if quality == '90':
            # skip because location missing
            continue

        if ' ' not in postcode:
            # some postcodes are missing spaces
            postcode = postcode[0:4] + ' ' + postcode[4:]

        dict_out[postcode] = [easting, northing]


coords = {}
for fname in all_files:
    with open(PATH + fname, newline='') as rows:
        parse_line(rows, coords)

output_name = 'all_grid.json'
with open(PATH + output_name, newline='', mode='w') as f_out:
    json.dump(coords, f_out, indent=2)
