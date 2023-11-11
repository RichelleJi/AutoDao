import * as ethers from "ethers";
import { withSessionRoute } from "@/utils/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import { CONTRACT_ADDRESS, governorInterface, owner } from "@/config/rpc";

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
