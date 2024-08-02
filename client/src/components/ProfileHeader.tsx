import React, { useState,useEffect } from 'react'
import '../css/ProfileHeader.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import player from '../assets/images/player.png'
import coin from '../assets/images/coin.png'
import { Link  } from 'react-router-dom';
import '../css/item.css'
import creator from '../assets/images/player.png'
import item from '../assets/images/item.jfif'
import WalletAddress from './Customs/WAlletAddress';

import { ethers } from 'ethers';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

interface Player {
  playerAddress: string;
  username: string;
  gamesPlayed: number;
  rewardsCount: number;
  playerRank: number;
  wins: string[]; // Array storing game IDs of wins
}

interface Game {
  gameId: number;
  player1: string; 
  player2: string; 
  winner: string | null; 
}

interface Win {
  winId: number;
  winTrace: string;
  winningPlayer: string; 
}


const ProfileHeader = () => {
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide:true,
    responsive: [
      {
        breakpoint: 1160,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          swipeToSlide:true,
        }
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          swipeToSlide:true,
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        }
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 470,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          variableWidth: true,
        }
      }
    ]
  };




  const[playerInfo , setPlayerInfo] = useState<Player[] >([]);
  const[playersInfo , setPlayersInfo] = useState<Player[] >([]);
  const [tokenBalance, setTokenBalances] = useState<number | null>(null);
  const [games, setGames] = useState<Game[] | null>(null);
  const [wins, setWins] = useState<Win[] | null>(null);
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

 

    //console.log("token balances",tokenBalance);


  return (
    <>
    {/* <div className='item section__padding'>
        <div className="item-image">
          <img src={item} alt="item" />
        </div>
          <div className="item-content">
            <div className="item-content-title">
              {
                account ? (
                  <WalletAddress address={account[0]} />
                ):(
                  <h1 className='text-sky-500'> connect wallet </h1>
                )
              }
              
              <p>Tokens <span className='text-blue-500'> {tokenBalance && parseFloat(ethers.utils.formatEther(tokenBalance)) !==0  ? tokenBalance.toString() : 'play to earn tokens'}</span> </p>
            </div>
            <div className="item-content-creator">
              <div><p>Player</p></div>
              <div>
                <img src={creator} alt="creator" />
                <p> {playerInfo && playerInfo.length > 0 && (
                        <span>{playerInfo[0].username}</span>
                    )}</p>
              </div>
            </div>
            <div className="item-content-detail">
              <p>Rank: 
              {playerInfo && playerInfo.length > 0 && (
                        <span>{playerInfo[0].playerRank}</span>
                    )}
              </p>
              <p>Wins:
              {playerInfo && playerInfo.length > 0 && (
                        <span>{playerInfo[0].wins.length}</span>
                    )}
              </p>
            </div>
            <div className="item-content-buy">
              <button className="primary-btn">Buy </button>
              <button className="secondary-btn">Make Offer</button>
            </div>
          </div>
      </div>
    <div className='headerProfile section__padding'>
      <div className="headerProfile-content">
        <div>
          <h1>Play, Win, collect, and Redeem extraordinary NFTs</h1>
          <img className='shake-vertical' src={coin} alt="" />
        </div>
      </div>
      <div className="headerProfile-slider">
          <h1>Top Players</h1>
          <Slider {...settings} className='slider'>
              {playersInfo
                  .sort((a, b) => a.playerRank - b.playerRank) // Sort players by rank
                  .slice(0, 6) // Take the top six players
                  .map((player, index) => (
                      <div className='slider-card' key={index}>
                          <p className='slider-card-number'>{index + 1}</p>
                          <div className="slider-img">
                              <img src={creator} alt="" />
                          </div>
                          <Link to={`/profile/${player.username}`}>
                              <p className='slider-card-name'>{player.username}</p>
                          </Link>
                          <p className='slider-card-price'>{player.rewardsCount} <span>Tokens</span></p>
                      </div>
                  ))
              }
          </Slider>
      </div>

      <Box sx={{     width: {
      xs: '100%', 
      sm: '90%',  
      md: '60%',  
    }, typography: 'body1',color:'white' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab sx={{color:'green'}} label="Wins" value="1" />
            <Tab sx={{color:'green'}} label="Games" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
        <div className="overflow-x-auto">
            <table className="table-auto min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xl font-bold font-medium text-orange-700 uppercase tracking-wider">Win ID</th>
                        <th className="px-6 py-3 text-left text-xl font-medium text-orange-700 uppercase tracking-wider">Win Trace</th>
                        <th className="px-6 py-3 text-left text-xl font-medium text-orange-700 uppercase tracking-wider">Winning Player</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {wins && wins.map((win) => (
                        <tr key={win.winId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{win.winId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{win.winTrace}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{win.winningPlayer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </TabPanel>
        <TabPanel sx={{
          borderRadius:10
        }} value="2">
        <div className="overflow-x-auto">
            <table className="table-auto min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xl font-bold font-medium text-amber-700 uppercase tracking-wider">Game ID</th>
                        <th className="px-6 py-3 text-left text-xl font-bold font-medium text-amber-700 uppercase tracking-wider">Player 1</th>
                        <th className="px-6 py-3 text-left text-xl font-bold font-medium text-amber-700 uppercase tracking-wider">Player 2</th>
                        <th className="px-6 py-3 text-left text-xl font-bold font-medium text-amber-700 uppercase tracking-wider">Winner</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {games && games.map((game) => (
                        <tr key={game.gameId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{game.gameId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{game.player1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{game.player2}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{game.winner}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </TabPanel>
      </TabContext>
    </Box>
    </div> */}
    </>
  )
}

export default ProfileHeader;