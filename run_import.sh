#!/bin/sh

ulimit -s 65500; node --stack-size=65500 import.js

