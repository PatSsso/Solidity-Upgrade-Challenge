import 'hardhat-deploy';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

import { ethers } from 'ethers';
import { HardhatUserConfig } from 'hardhat/types';
import { HardhatNetworkForkingUserConfig } from 'hardhat/src/types/config';

import './tasks';

const {
  ALCHEMY_KEY_POLYGON,
  ALCHEMY_KEY_MUMBAI,
  PRIVATE_KEY_POLYGON,
  PRIVATE_KEY_MUMBAI,
  FORKING_ENV,
  FORKING_BLOCK,
  POLYGONSCAN_API_KEY,
} = process.env;

const POLYGON_MAINNET = `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY_POLYGON}`;
const POLYGON_MUMBAI = `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY_MUMBAI}`;

const privateKeyPolygon = PRIVATE_KEY_POLYGON || ethers.Wallet.createRandom().privateKey;
const privateKeyMumbai = PRIVATE_KEY_MUMBAI || ethers.Wallet.createRandom().privateKey;

if (privateKeyPolygon != PRIVATE_KEY_POLYGON) {
  console.warn('Private key for Polygon is randomly generated. Suggesting adding it to the environment.');
}

if (privateKeyMumbai != PRIVATE_KEY_MUMBAI) {
  console.warn('Private key for Polygon Mumbai is randomly generated. Suggesting adding it to the environment.');
}

const accounts = [];
accounts.push({
  balance: '1'.padEnd(20, '0'),
  privateKey: '0x4aa5c38059cacf37597c2ba756a1eb21d5850ada843590eaedfc6b717022597b',
});

accounts.push({
  balance: '1'.padEnd(20, '0'),
  privateKey: '0xb71dd31c59a12c59d696474980d4352c97d77d0ab8bb198edddb1bc0abe684a1',
});

accounts.push({
  balance: '1'.padEnd(20, '0'),
  privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
});

accounts.push({
  balance: '1'.padEnd(20, '0'),
  privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
});

let forkingConfig: {
  forking: HardhatNetworkForkingUserConfig;
  deploy: string[];
};

switch (FORKING_ENV) {
  case 'ethereum':
    forkingConfig = {
      forking: {
        enabled: true,
        url: POLYGON_MAINNET,
        blockNumber: FORKING_BLOCK ? parseInt(FORKING_BLOCK || '15976035', 10) : 15976035,
      },
      deploy: ['deploy/ethereum'],
    };
    break;
  case 'polygon':
    forkingConfig = {
      forking: {
        enabled: true,
        url: POLYGON_MAINNET,
        blockNumber: FORKING_BLOCK ? parseInt(FORKING_BLOCK || '35641062', 10) : 35641062,
      },
      deploy: ['deploy/polygon'],
    };
    break;
  case '':
  case undefined:
    forkingConfig = {
      forking: { enabled: false, url: '', blockNumber: undefined },
      deploy: [],
    };
    break;
  default:
    throw new Error(`Forking for '${FORKING_ENV}' unsupported.`);
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      forking: FORKING_ENV ? { ...forkingConfig.forking } : undefined,
      deploy: FORKING_ENV ? forkingConfig.deploy : undefined,
      accounts: accounts,
      live: false,
      saveDeployments: true,
      tags: ['test', 'local'],
      chainId: 8545,
    },
    localhost: {
      url: ' http://127.0.0.1:8545/',
      deploy: FORKING_ENV ? forkingConfig.deploy : undefined,
      accounts: accounts.map((a) => a.privateKey),
      chainId: 8545,
    },
    polygon: {
      url: POLYGON_MAINNET,
      accounts: [privateKeyPolygon],
      chainId: 137,
      live: true,
      saveDeployments: true,
      tags: ['polygon', 'mainnet'],
      gasMultiplier: 2,
    },
    mumbai: {
      url: POLYGON_MUMBAI,
      accounts: [privateKeyMumbai],
      chainId: 80001,
      live: true,
      saveDeployments: true,
      tags: ['polygon', 'testnet'],
      gasMultiplier: 2,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
  },
  paths: {
    artifacts: 'artifacts',
    cache: 'cache',
    deploy: 'deploy/localhost',
    deployments: 'deployments',
    sources: 'contracts',
    tests: 'test',
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
    alwaysGenerateOverloads: true,
  },
  mocha: {
    timeout: 80000,
    grep: `@${FORKING_ENV || ''}`,
    invert: !FORKING_ENV,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
};

export default config;
