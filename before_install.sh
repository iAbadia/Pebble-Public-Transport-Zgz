#!/bin/bash
set -e
echo 'pBuild 1.0'
echo 'Installing Pebble SDK and its Dependencies...'

cd ~ 
mkdir -p ~/pebble-dev
touch ~/pebble-dev/ENABLE_ANALYTICS

# Get the Pebble SDK and toolchain
PEBBLE_SDK_VER=${PEBBLE_SDK#PebbleSDK-}
if [ ! -d $HOME/pebble-dev/${PEBBLE_SDK} ]; then
  wget https://s3.amazonaws.com/assets.getpebble.com/pebble-tool/pebble-sdk-${PEBBLE_SDK_VER}.tar.bz2 -O PebbleSDK-${PEBBLE_SDK_VER}.tar.bz2
  wget http://assets.getpebble.com.s3-website-us-east-1.amazonaws.com/sdk/arm-cs-tools-ubuntu-universal.tar.gz

  # Extract the SDK
  tar jxvf PebbleSDK-${PEBBLE_SDK_VER}.tar.bz2 -C ~/pebble-dev/
  # Extract the toolchain
  tar zxvf arm-cs-tools-ubuntu-universal.tar.gz -C ~/pebble-dev/${PEBBLE_SDK}

  # Install the Python library dependencies locally
  cd ~/pebble-dev/${PEBBLE_SDK}
  virtualenv --no-site-packages .env
  source .env/bin/activate
  pip install -r requirements.txt
  deactivate
fi
