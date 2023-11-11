import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x434395cA409031a9916d8aE4AE958115775653fb";
export const RPC_PROVIDER_URL = "https://eth-goerli.g.alchemy.com/v2/FUW4pWDSTzFTLsyHZZFUt01qdl1aQ-L8";
export const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL);
export const owner = new ethers.Wallet("0x75f5af58fa5ecce049820bd2973959540b7a05b896b5c90e5c4c95ec99747bb0", provider);
export const governorInterface = new ethers.Interface([
  "function register(address user, uint semaphoreID) external returns (bool)"
]);
