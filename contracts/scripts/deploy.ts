import hre from 'hardhat';

async function main() {
  const Governor = await hre.ethers.getContractFactory("ZupassGovernor");
  const governor = await hre.ethers.deploy("yeeeeeeee");
  
  await governor.deployed();

  console.log(
    `governor deployed to ${governor.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
