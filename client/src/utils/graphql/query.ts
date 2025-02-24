import { gql } from '@apollo/client';

export const GET_ALL_GAMES = gql`
  query GetAllGames {
    command_nexus_Game {
      game_id
      next_to_move
      minimum_moves
      over
      player_count
      unit_count
      nonce
      price
      clock
      penalty
      limit
      winner
      arena_host
      seed
      available_home_bases {
        base1
        base2
        base3
        base4
      }
      player_name
    }
  }
`;

export const GAME_SUBSCRIPTION = gql`
  subscription OnGameUpdate {
    command_nexus_GameUpdate {
      game_id
      next_to_move
      minimum_moves
      over
      player_count
      unit_count
      nonce
      price
      clock
      penalty
      limit
      winner
      arena_host
      seed
      available_home_bases {
        base1
        base2
        base3
        base4
      }
      player_name
    }
  }
`;