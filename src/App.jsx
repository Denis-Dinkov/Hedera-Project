import React, { useEffect, useState } from "react";
import MyGroup from "./components/MyGroup.jsx";
import envSetup from "./components/hedera/envSetup.js";
import createToken from "./components/hedera/createToken.js";
import "./styles/App.css";
import transferToken from "./components/hedera/transferToken.js";

function App() {
  const [client, setClient] = useState();
  const [myAccountId, setMyAccountId] = useState();
  const [btcTokenId, setBtcTokenId] = useState();
  const [ethTokenId, setEthTokenId] = useState();
  const [usdTokenId, setUsdTokenId] = useState();

  const [creatingETHToken, setCreatingETHToken] = useState(false);
  const [creatingBTCToken, setCreatingBTCToken] = useState(false);
  const [creatingUSDToken, setCreatingUSDToken] = useState(false);

  async function createBTCToken() {
    setCreatingBTCToken(true);
    const tokenId = await createToken(client, "Bitcoin", "BTC", 8, 21000000);
    setBtcTokenId(tokenId);
    setCreatingBTCToken(false);
  }

  async function createETHToken() {
    setCreatingETHToken(true);
    const tokenId = await createToken(client, "Ethereum", "ETH", 8, 100000000);
    setEthTokenId(tokenId);
    setCreatingETHToken(false);
  }

  async function createUSDToken() {
    setCreatingUSDToken(true);
    const tokenId = await createToken(client, "USDT", "USDT", 2, 100000000);
    setUsdTokenId(tokenId);
    setCreatingUSDToken(false);
  }

  async function transferTokenToAlice() {
    await transferToken(client, btcTokenId);
  }
  useEffect(() => {
    async function setup() {
      const [client, myAccountId] = await envSetup();
      setClient(client);
      setMyAccountId(myAccountId);
    }
    setup();
  }, []);

  return (
    <div className="App">
      <h1 className="header">Welcome ${myAccountId}!</h1>
      <MyGroup
        buttonLabel={
          creatingBTCToken ? "Creating Token..." : "Create BTC Token"
        }
        fcn={createBTCToken}
        text={btcTokenId && `BTC Token ID: ${btcTokenId.toString()}`}
      />

      <MyGroup
        buttonLabel={
          creatingETHToken ? "Creating Token..." : "Create ETH Token"
        }
        fcn={createETHToken}
        text={ethTokenId && `ETH Token ID: ${ethTokenId}`}
      />

      <MyGroup
        buttonLabel={
          creatingUSDToken ? "Creating Token..." : "Create USDT Token"
        }
        fcn={createUSDToken}
        text={usdTokenId && `USDT Token ID: ${usdTokenId}`}
      />

      <MyGroup
        buttonLabel={"Transfer USDT Token to Alice"}
        fcn={transferTokenToAlice}
      />

      <div className="logo">
        <div className="symbol">
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
          >
            <path
              d="M20 0a20 20 0 1 0 20 20A20 20 0 0 0 20 0"
              className="circle"
            ></path>
            <path
              d="M28.13 28.65h-2.54v-5.4H14.41v5.4h-2.54V11.14h2.54v5.27h11.18v-5.27h2.54zm-13.6-7.42h11.18v-2.79H14.53z"
              className="h"
            ></path>
          </svg>
        </div>
        <span>Hedera</span>
      </div>
    </div>
  );
}
export default App;
