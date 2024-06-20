import {
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  PrivateKey,
} from "@hashgraph/sdk";
const myAccountId = process.env.REACT_APP_MY_ACCOUNT_ID;
const myPrivateKey = process.env.REACT_APP_MY_PRIVATE_KEY;
const supplyKey = PrivateKey.generate();

export default async function createToken(
  client,
  tokenName,
  tokenSymbol,
  decimals,
  initialSupply
) {
  console.log(client, tokenName, tokenSymbol, decimals, initialSupply);
  let tokenCreateTx = new TokenCreateTransaction()
    .setTokenName(tokenName)
    .setTokenSymbol(tokenSymbol)
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(decimals)
    .setInitialSupply(initialSupply)
    .setTreasuryAccountId(myAccountId)
    .setSupplyType(TokenSupplyType.Infinite)
    .setSupplyKey(supplyKey)
    .freezeWith(client);

  let tokenCreateSign = await tokenCreateTx.sign(
    PrivateKey.fromStringECDSA(myPrivateKey)
  );
  let tokenCreateSubmit = await tokenCreateSign.execute(client);
  let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
  let tokenId = tokenCreateRx.tokenId.toString();
  console.log(`- Created token with ID: ${tokenId} `);

  return tokenId;
}
