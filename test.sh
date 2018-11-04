#!/bin/bash

rm -rf tmp
mkdir tmp

# too few arguments
node index tmp/p . > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# unknown options
node index tmp/p . example --unknown > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# unknown protocol
node index tmp/p . example --protocol=unknown > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# template dir not found
node index tmp/p . not_exist > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# existing dir
node index tmp . example > /dev/null 2>&1
[[ $? = 0 ]] && exit 1

set -e

node index tmp/p1 . example --protocol=git
node index tmp/p2 . example/public --protocol=git
node index tmp/p3 ./example . --protocol=git