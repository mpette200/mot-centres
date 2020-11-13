'''
script to read mot table as csv
and then lookup easting and northing coords

input format is a csv:

output format is a json as list of records

where postcode not found in dictionary store in separate
csv of problem postcodes
'''
import json
import io

PATH = '/e/DOCS/20_non/05-map-data/data/'
FNAME = 'mot-vehicle-testing-stations.csv'
FMISSING = 'postcode-errors.csv'

PATH_DICT = '/e/DOCS/20_non/05-map-data/data/codepo_aug2020/Data/CSV/'
F_DICT = 'all_grid.json'

# Load dict with lookup of all postcodes
with open(PATH_DICT + F_DICT) as f:
    get_coords = json.load(f)
# print(get_coords['CM1 7HF'])


def parse_line(lines, arr_out, errors_out):
    '''parses line to get relevant data

    depends on dictionary to lookup easting and northing
    of postcodes

    #   Column
    ---  ------
    0   VTS Site Number
    1   Trading Name
    2   VTS Address Line 1
    3   VTS Address Line 2
    4   VTS Address Line 3
    5   VTS Address Line 14
    6   VTS Postcode
    7   VTS Telephone Number
    8   1
    9   2
    10  3
    11  4
    12  5
    13  7

    output format a list of records
    output:
    [
        {
            Name: xxx
            Address: xxx
            Postcode: xxx
            Easting: xxx
            Northing: xxx
        },
        {
            continued ...
        }
    ]
    '''

    def join_address(txt_parts):
        '''joins address parts using commas'''
        address = ''
        for part in txt_parts:
            if len(part) > 0:
                address += part + ', '
        return address[:-2]

    for line in lines:
        fields = line.split(',')
        name = fields[1]
        address = join_address(fields[2:6])
        postcode = fields[6]

        if postcode not in get_coords:
            errors_out.write(line)
            continue

        easting, northing = get_coords[postcode]

        arr_out.append({
            'Name': name,
            'Address': address,
            'Postcode': postcode,
            'Easting': easting,
            'Northing': northing
        })


out = []
errors = io.StringIO(newline='')
with open(PATH + FNAME) as f:
    parse_line(f, out, errors)
err_txt = errors.getvalue()
errors.close()

file_out = FNAME.replace('.csv', '.json')
with open(PATH + file_out, mode='w') as f_out:
    json.dump(out, f_out, indent=2)

with open(PATH + FMISSING, mode='w') as err_out:
    err_out.writelines(err_txt)

print(err_txt[-600:])
print(json.dumps(out, indent=2)[:600])
print(json.dumps(out, indent=2)[-600:])
