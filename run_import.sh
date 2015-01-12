#!/bin/sh

ulimit -s 65500; ulimit -n 2048; node --stack-size=65500 import.js

