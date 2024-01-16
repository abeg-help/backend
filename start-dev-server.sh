#!/bin/bash

DIRECTORY="./"

# Check if the build directory exists
if [ -d "$DIRECTORY/build" ]; then
  # If the build directory exists, run 'npx nodemon'
  npx nodemon
else
  # If the build directory does not exist, run 'npm run build' and then 'npx nodemon'
  npm run build && npx nodemon
fi