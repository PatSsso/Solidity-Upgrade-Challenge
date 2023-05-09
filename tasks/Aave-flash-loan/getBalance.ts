import { task } from 'hardhat/config';
import { Contract } from 'ethers';

// npx hardhat getBalance --token <address> --network <network>
// npx hardhat getBalance --token "0xF14f9596430931E177469715c591513308244e8F" --network mumbai
task('getBalance', 'Get token balance in contract')
  .addParam('token', 'The address of the token')
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const token = taskArgs.token;

    console.log('Current block number:', await ethers.provider.getBlockNumber());

    const signer = ethers.provider.getSigner();

    const contractArtifacts = await hre.deployments.get('FlashLoanArbitrage');
    console.log(`${'FlashLoanArbitrage'} deployed at: ${contractArtifacts.address}`);

    const contract = new Contract(contractArtifacts.address, contractArtifacts.abi, signer);

    const balance = await contract.getBalance(token);

    console.log(`Balance: ${balance}`);
  });

