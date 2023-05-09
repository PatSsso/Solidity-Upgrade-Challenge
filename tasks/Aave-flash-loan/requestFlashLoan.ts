import { task } from 'hardhat/config';
import { Contract } from 'ethers';

// npx hardhat getBalance --token <address> --network <network>

/*
    npx hardhat request \
    --token "0xF14f9596430931E177469715c591513308244e8F" \
    --amount 5000000000000000000 \
    --network mumbai
*/

task('request', 'Request a flash loan')
  .addParam('token', 'The address of the token')
  .addParam('amount', 'The amount of the flash loan')
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const { token, amount } = taskArgs;

    console.log('Current block number:', await ethers.provider.getBlockNumber());

    const signer = ethers.provider.getSigner();

    const contractArtifacts = await hre.deployments.get('FlashLoanArbitrage');
    console.log(`${'FlashLoanArbitrage'} deployed at: ${contractArtifacts.address}`);

    const contract = new Contract(contractArtifacts.address, contractArtifacts.abi, signer);

    const tx = await contract.requestFlashLoan(token, amount, ethers.constants.HashZero, 0);

    console.log(`The address of the contract receiving the funds: ${contract.address}`);
    console.log(`The address of the asset being flash-borrowed: ${token}`);
    console.log(`The amount of the asset being flash-borrowed: ${amount}`);
    console.log('Extra information:');
    console.log(`Referral code: ${0}`);

    console.log(`txHash: ${tx.hash}`);
  });
