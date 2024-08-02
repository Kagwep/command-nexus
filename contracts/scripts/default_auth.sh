#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

# Check if a profile parameter is provided, default to 'dev' if not
PROFILE=${1:-sepolia}

export WORLD_ADDRESS=$(cat ./manifests/$PROFILE/manifest.json | jq -r '.world.address')

export HOST_ADDRESS=$(cat ./manifests/$PROFILE/manifest.json | jq -r '.contracts[] | select(.name == "contracts::systems::host::host" ).address')


echo "---------------------------------------------------------------------------"
echo world : $WORLD_ADDRESS
echo " "
echo host : $HOST_ADDRESS

echo "---------------------------------------------------------------------------"

echo ">>> Host auth..."
sozo -P $PROFILE auth grant --world $WORLD_ADDRESS --wait writer \
  Game,$HOST_ADDRESS \
  GameData,$HOST_ADDRESS \
  Player,$HOST_ADDRESS \
  PlayerScore,$HOST_ADDRESS \
  UnitsSupply,$HOST_ADDRESS \

echo "Default authorizations have been successfully set."