import hre from 'hardhat';

async function main() {

  /*
  const Governor = await hre.ethers.getContractFactory("ZupassGovernor");
  const governor = await Governor.deploy("yeeeeee");

  await governor.deployed();  
  */

  const governor = await ethers.deployContract("ZupassGovernor", ["yeeeeee"]);
  await governor.waitForDeployment();

  console.log(
    `governor deployed to ${governor.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
