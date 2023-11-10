import { config as dotenvconfig } from 'dotenv';
dotenvconfig();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";


const config: HardhatUserConfig = {
  networks: {
    georli: {
      url: `https://georli.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY || ''],
    },
  },
  solidity: "0.8.19",
};

export default config;
