#!/bin/bash
rsync -azrP --exclude=node_modules ../puppy-scraper pi@home-server:/home/pi/sites
