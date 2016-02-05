#!/bin/bash
set -e
echo 'pBuild 1.1_iAbadia'
echo 'Installing Pebble SDK and its Dependencies...'

cd ~ 
mkdir -p ~/.pebble-sdk
touch ~/.pebble-sdk/ENABLE_ANALYTICS

# Get the Pebble SDK and toolchain
if [ ! -d $HOME/.pebble-sdk/${PEBBLE_SDK} ]; then
  wget https://s3.amazonaws.com/assets.getpebble.com/pebble-tool/${PEBBLE_SDK}.tar.bz2 -O ${PEBBLE_SDK}.tar.bz2
  wget http://assets.getpebble.com.s3-website-us-east-1.amazonaws.com/sdk/arm-cs-tools-ubuntu-universal.tar.gz

  # Extract the SDK
  tar jxf ${PEBBLE_SDK}.tar.bz2 -C ~/.pebble-sdk/
  # Extract the toolchain
  tar zxf arm-cs-tools-ubuntu-universal.tar.gz -C ~/.pebble-sdk/${PEBBLE_SDK}

  # Install the Python library dependencies locally
  cd ~/.pebble-sdk/${PEBBLE_SDK}
  virtualenv --no-site-packages .env
  source .env/bin/activate
  pip install -r requirements.txt
  deactivate
fi
