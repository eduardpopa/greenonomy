import * as GreenomContract from '../contracts/Greenom.json';
import * as Item from '../contracts/Item.json';
import * as Market from '../contracts/Market.json';

export const environment = {
  production: false,
  geenonomy: {
    apiKey: 'prodKey',
    providerUrl: 'http://127.0.0.1:8545',
    contractGreenomAddress: '0x3d7f842a9b085702EcC9f39F8F04E6F37406cEdE',
    contractItemAddress: '0xB96f1c9a8301bd0DE8076088521B4fa4872C0a4C',
    contractMarketAddress: '0xb105d96170dbb99bc2F7B75Df007Ebe9a8121cB5',
    contractGreenomABI: GreenomContract.abi,
    contractIemABI: Item.abi,
    contractMarketABI: Market.abi,
  },
};
