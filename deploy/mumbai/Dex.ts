import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  const dai = '0xF14f9596430931E177469715c591513308244e8F';
  const usdc = '0xe9DcE89B076BA6107Bb64EF30678efec11939234';

  await deployments.deploy('Dex', {
    from: deployer,
    args: [dai, usdc],
    log: true,
  });
};

func.tags = ['Dex'];

export default func;
