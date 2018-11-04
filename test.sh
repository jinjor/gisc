#!/bin/bash

rm -rf tmp
mkdir tmp

# too few arguments
node cli . example > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# unknown options
node cli . example tmp/p --unknown > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# unknown protocol
node cli . example tmp/p --protocol=unknown > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# template dir not found
node cli . not_exist tmp/p > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# existing dir
node cli . example tmp > /dev/null 2>&1
[[ $? = 0 ]] && exit 1

set -e

node cli . example tmp/p1
node cli . example/public tmp/p2
node cli ./example . tmp/deeply/nested/p3
node cli . example/public/index.html tmp/index.html
node cli -f . example/public/index.html tmp/index.html