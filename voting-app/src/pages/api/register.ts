import * as ethers from "ethers";
import { withSessionRoute } from "@/utils/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import { CONTRACT_ADDRESS, governorInterface, owner } from "@/config/rpc";

// const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
// const RPC_PROVIDER_URL = "https://eth-goerli.g.alchemy.com/v2/FUW4pWDSTzFTLsyHZZFUt01qdl1aQ-L8";
// const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL);
// const owner = new ethers.Wallet("0x75f5af58fa5ecce049820bd2973959540b7a05b896b5c90e5c4c95ec99747bb0", provider);
// const governorInterface = new ethers.Interface([
//   "function register(address user, uint semaphoreID) external returns (bool)"
// ]);

export default withSessionRoute(async function (req: NextApiRequest, res: NextApiResponse) {
  console.log("register", req.method, req.body);
  try {
    const { address, semaphoreId } = req.body;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, governorInterface, owner);
    const response = await contract.register(address, semaphoreId);
    res.status(200).send({ transactionHash: response.hash });
  } catch (error: any) {
    console.error(`[ERROR] ${error}`);
    res.status(500).send(`Unknown error: ${error.message}`);
  }
});
