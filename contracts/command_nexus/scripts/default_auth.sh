#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

# Check if a profile parameter is provided, default to 'dev' if not
PROFILE=${1:-dev}

export WORLD_ADDRESS=$(cat ./manifests/$PROFILE/manifest.json | jq -r '.world.address')

export ARENA_ADDRESS=$(cat ./manifests/$PROFILE/manifest.json | jq -r '.command_nexus[] | select(.name == "command_nexus::systems::arena::arena" ).address')

export NEXUS_ADDRESS=$(cat ./manifests/$PROFILE/manifest.json | jq -r '.command_nexus[] | select(.name == "command_nexus::systems::nexus::nexus" ).address')




echo "---------------------------------------------------------------------------"
echo world : $WORLD_ADDRESS
echo " "
echo arena : $ARENA_ADDRESS
echo " "
echo nexus : $NEXUS_ADDRESS

echo "---------------------------------------------------------------------------"

echo ">>> Host auth..."
sozo -P $PROFILE auth grant --world $WORLD_ADDRESS --wait writer \
  Game,$ARENA_ADDRESS \
  GameData,$ARENA_ADDRESS \
  Player,$ARENA_ADDRESS \
  PlayerScore,$ARENA_ADDRESS \
  UnitsSupply,$ARENA_ADDRESS \
  UrbanBattlefield,$ARENA_ADDRESS \
  WeatherEffect,$ARENA_ADDRESS \
  Player,$NEXUS_ADDRESS\
  UnitMode,$NEXUS_ADDRESS\
  UnitState,$NEXUS_ADDRESS\
  EnvironmentInfo,$NEXUS_ADDRESS\
  UrbanBattlefield,$NEXUS_ADDRESS\
  AbilityState,$NEXUS_ADDRESS\
  Game,$NEXUS_ADDRESS\
  AirUnit,$NEXUS_ADDRESS\
  Armored,$NEXUS_ADDRESS\
  Infantry,$NEXUS_ADDRESS\
  Ship,$NEXUS_ADDRESS\
  CyberUnit,$NEXUS_ADDRESS\


echo "Default authorizations have been successfully set."