#!/bin/bash

rm -rf tmp
mkdir tmp

# too few arguments
node src/cli get . example > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# unknown options
node src/cli get . example tmp/p --unknown > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# unknown protocol
node src/cli get . example tmp/p --protocol=unknown > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# template dir not found
node src/cli get . not_exist tmp/p > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# existing dir
node src/cli get . example tmp > /dev/null 2>&1
[[ $? = 0 ]] && exit 1

set -e

node src/cli get . example tmp/p1
node src/cli get . example/public tmp/p2
node src/cli get ./example . tmp/deeply/nested/p3
node src/cli get . example/public/index.html tmp/index.html
node src/cli get -f . example/public/index.html tmp/index.html