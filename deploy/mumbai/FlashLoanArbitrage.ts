import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  const provider = '0xeb7A892BB04A8f836bDEeBbf60897A7Af1Bf5d7F';
  const dai = '0xF14f9596430931E177469715c591513308244e8F';
  const usdc = '0xe9DcE89B076BA6107Bb64EF30678efec11939234';
  const dex = '0x31854860714bAf9C2F968c16f36a5974b03264d4';

  await deployments.deploy('FlashLoanArbitrage', {
    from: deployer,
    args: [provider, dai, usdc, dex],
    log: true,
  });
};

func.tags = ['FlashLoanArbitrage'];

export default func;
