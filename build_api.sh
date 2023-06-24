#!/bin/bash
set -e

GENERATOR_URL=https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/6.6.0/openapi-generator-cli-6.6.0.jar

GENERATOR=openapi-generator-cli.jar

set -e

if [ ! -f "$GENERATOR" ]; then
        wget wget $GENERATOR_URL -O $GENERATOR
fi

cd src
rm -rf api
mkdir api
cd api

java -jar ../../$GENERATOR generate -i http://localhost:8000/openapi.json -g typescript-axios
