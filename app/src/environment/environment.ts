import * as GreenomContract from '../contracts/Greenom.json';
import * as Item from '../contracts/Item.json';
import * as Market from '../contracts/Market.json';

export const environment = {
  production: false,
  geenonomy: {
    apiKey: 'prodKey',
    providerUrl: 'http://127.0.0.1:8545',
    contractGreenomAddress: '0xE37b4F763c210486A696BCA0EB4c213835Cf24C5',
    contractItemAddress: '0x9c39C71F7ba8F9c8B2209e6C9668D89a441023F6',
    contractMarketAddress: '0x2008B8565FeFa63C5B6b07b81a8499EB9D8dbb76',
    contractGreenomABI: GreenomContract.abi,
    contractIemABI: Item.abi,
    contractMarketABI: Market.abi,
  },
};
