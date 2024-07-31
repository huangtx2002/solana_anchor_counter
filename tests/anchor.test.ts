import * as anchor from "@coral-xyz/anchor";
import * as web3 from '@solana/web3.js';
import { Program, web3 as anchorWeb3 } from '@project-serum/anchor';
import { assert } from 'chai';
import { AnchorCounter } from "../target/types/anchor_counter";

// Configure the client to use the local cluster.
const provider = anchor.AnchorProvider.env()
anchor.setProvider(provider);
const pg = anchor.workspace.AnchorCounter as Program<AnchorCounter>;

describe("anchor-counter", () => {
  // Generate keypair for the new account
  const counterKp = new web3.Keypair();

  it("Is initialized!", async () => {
    // Send transaction
    const txHash = await pg.methods
      .initialize()
      .accounts({
        counter: counterKp.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([counterKp])
      .rpc();

    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await provider.connection.confirmTransaction(txHash);

    // Fetch the created account
    const initCounter = await pg.account.counter.fetch(
      counterKp.publicKey
    );

    console.log("On-chain data is:", initCounter.count.toString());

    // Check whether the data on-chain is equal to local 'counter'
    const expectCount = new anchor.BN(0);
    assert(expectCount.eq(initCounter.count));
  });

  it("Is incremented!", async () => {
    // Send transaction
    const txHash = await pg.methods
      .increment()
      .accounts({
        counter: counterKp.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await provider.connection.confirmTransaction(txHash);

    // Fetch the created account
    const incrementCounter = await pg.account.counter.fetch(
      counterKp.publicKey
    );

    console.log("On-chain data is:", incrementCounter.count.toString());

    // Check whether the data on-chain is equal to local 'counter'
    const expectCount = new anchor.BN(1);
    assert(expectCount.eq(incrementCounter.count));
  });

  it("Is incremented again!", async () => {
    // Send transaction
    const txHash = await pg.methods
      .increment()
      .accounts({
        counter: counterKp.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await provider.connection.confirmTransaction(txHash);

    // Fetch the created account
    const incrementCounter = await pg.account.counter.fetch(
      counterKp.publicKey
    );

    console.log("On-chain data is:", incrementCounter.count.toString());

    // Check whether the data on-chain is equal to local 'counter'
    const expectCount = new anchor.BN(2);
    assert(expectCount.eq(incrementCounter.count));
  });
});
