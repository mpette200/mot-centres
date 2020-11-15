'''Creates a list of all of the valid prefix parts of the postcode
based on the names of all CSV files in the data folder
'''

# import sys
import os
import json

# PATH = sys.argv[1]
PATH = '/e/DOCS/20_non/05-map-data/data/codepo_aug2020/Data/CSV/'
FILE_OUT = 'all_prefix.json'

all_files = [f for f in os.listdir(PATH) if f.endswith('.csv')]
all_prefixs = {f[:-4]: 0 for f in all_files}

with open(PATH + FILE_OUT, newline='', mode='w') as f_out:
    json.dump(all_prefixs, f_out, indent=2)
