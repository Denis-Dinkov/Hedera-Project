import { Client, Hbar } from "@hashgraph/sdk";

async function envSetup() {
  const myAccountId = process.env.REACT_APP_MY_ACCOUNT_ID;
  const myPrivateKey = process.env.REACT_APP_MY_PRIVATE_KEY;

  if (!myAccountId || !myPrivateKey) {
    throw new Error(
      "Environment variables REACT_APP_MY_ACCOUNT_ID and REACT_APP_MY_PRIVATE_KEY must be present"
    );
  }

  const client = Client.forTestnet();

  //Set your account as the client's operator
  client.setOperator(myAccountId, myPrivateKey);

  //Set the default maximum transaction fee (in Hbar)
  client.setDefaultMaxTransactionFee(new Hbar(100));

  //Set the maximum payment for queries (in Hbar)
  client.setDefaultMaxQueryPayment(new Hbar(50));

  return [client, myAccountId, myPrivateKey];
}

export default envSetup;
