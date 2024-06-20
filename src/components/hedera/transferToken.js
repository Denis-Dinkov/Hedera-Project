import {
  TokenAssociateTransaction,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
} from "@hashgraph/sdk";

const myAccountId = process.env.REACT_APP_MY_ACCOUNT_ID;
const myPrivateKey = process.env.REACT_APP_MY_PRIVATE_KEY;

export default async function transferToken(client, tokenId) {
  const newAccPrivateKey = PrivateKey.generateECDSA();

  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccPrivateKey.publicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);

  const getReceipt = await newAccount.getReceipt(client);
  const newAccountId = getReceipt.accountId;

  const query = await new AccountBalanceQuery()
    .setAccountId(myAccountId)
    .execute(client);

  console.log(
    "The new account balance is: " + query.hbars.toTinybars() + " tinybar."
  );

  let associateToken = await new TokenAssociateTransaction()
    .setAccountId(newAccountId)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(newAccPrivateKey);

  const associateTokenSubmit = await associateToken.execute(client);
  const associateTokenReceipt = await associateTokenSubmit.getReceipt(client);
  console.log(
    `Associated Token ${associateTokenReceipt.status} with account ${newAccountId}`
  );

  const tokenTransfer = await new TransferTransaction()
    .addTokenTransfer(tokenId, myAccountId, -5)
    .addTokenTransfer(tokenId, newAccountId, 5)
    .freezeWith(client)
    .sign(PrivateKey.fromStringECDSA(myPrivateKey));

  const tokenTransferSubmit = await tokenTransfer.execute(client);
  const tokenTransferReceipt = await tokenTransferSubmit.getReceipt(client);

  console.log(
    `Transferred NFT ${tokenId} with serial ${tokenTransferReceipt.serials[0].low}`
  );
}
