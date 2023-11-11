import { useEffect, useState } from "react";
import * as ethers from "ethers";
import axios from "axios";
var Diff = require("text-diff");

const CONTRACT_ADDRESS = "0x23d3B7aFfD6D7dC228007F1C6A15fE332E21baBc";
const RPC_PROVIDER_URL =
  "https://eth-goerli.alchemyapi.io/v2/FSb4UHc6BDhnIwM61H07jRS70vjMe0gN";
const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL);
const contractInterface = new ethers.Interface([
  "function prompt() view returns (string)",
]);

function getWallet(): ethers.Wallet {
  const privateKey = localStorage.getItem("key");
  if (!privateKey) {
    const wallet = ethers.Wallet.createRandom();
    localStorage.setItem("key", wallet.privateKey);
    return wallet as unknown as ethers.Wallet;
  } else {
    return new ethers.Wallet(privateKey);
  }
}

export function Profile({ semaphoreId }: { semaphoreId: string }) {
  const wallet = getWallet();
  const [prompt, setPrompt] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [registered, setRegistered] = useState(false);

  console.log("ethereum address", wallet.address);

  var diff = new Diff(); // options may be passed to constructor; see below
  var textDiff = diff.main(newPrompt, prompt); // produces diff array
  const diffHtml = diff.prettyHtml(textDiff); // produces a formatted HTML string
  // console.log("diff", textDiff);

  useEffect(() => {
    (async function () {
      if (!prompt) {
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractInterface,
          provider
        );
        const prompt = await contract.prompt();
        console.log("Prompt:", prompt);
        setPrompt(prompt);
        setNewPrompt(prompt);
      }
    })();
  }, []);

  return (
    <div className="my-8 text-center">
      {!registered && (
        <button
          className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setRegistered(true);
            axios.post("/api/register", {
              semaphoreId,
              address: wallet.address,
            });
          }}
        >
          Register
        </button>
      )}
      {registered && (
        <>
          <textarea
            className="w-full h-64 mt-8 text-black"
            placeholder="Loading..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div
            className="diff text-left"
            dangerouslySetInnerHTML={{ __html: diffHtml }}
          />

          <button
            className="mt-3 bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
            // onClick={() => postProfile({ foo: "bar" })}
          >
            Propose prompt
          </button>

          <div className="mt-3">
            <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">
              Vote for
            </button>
            <button className="ml-2 bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">
              Vote against
            </button>
          </div>
        </>
      )}
    </div>
  );
}
