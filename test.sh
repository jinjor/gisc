#!/bin/bash

set -x

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
# too many args
node src/cli ls boo > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# too few args
node src/cli add > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# bad alias name
node src/cli add add > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# bad alias name
node src/cli add remove > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# bad alias name
node src/cli add ls > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# bad alias name
node src/cli add get > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# bad alias name
node src/cli add share > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# repository not found
node src/cli add jinjor/unknown > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# path not found
node src/cli add jinjor/gisc unknown > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# too many args
node src/cli remove foo bar > /dev/null 2>&1
[[ $? = 0 ]] && exit 1
# alias not found
node src/cli unknown > /dev/null 2>&1
[[ $? = 0 ]] && exit 1

set -e

node src/cli get . example tmp/p1
node src/cli get . example/public tmp/p2
node src/cli get ./example . tmp/deeply/nested/p3
node src/cli get . example/public/index.html tmp/index.html
node src/cli get -f . example/public/index.html tmp/index.html

node src/cli add test . example
node src/cli ls
node src/cli test tmp/p4
node src/cli remove test