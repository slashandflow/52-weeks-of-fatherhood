#! /bin/bash

scp -r -P30000 ./public/* deployer@109.74.192.44:/var/www/production/52wof/current

