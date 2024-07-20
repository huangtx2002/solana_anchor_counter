describe("anchor-counter", () => {
  // Generate keypair for the new account
  const counterKp = new web3.Keypair();

  it("Is initialized!", async () => {
    // Send transaction
    const txHash = await pg.program.methods
      .initialize()
      .accounts({
        counter: counterKp.publicKey,
        user: pg.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([counterKp])
      .rpc();

    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await pg.connection.confirmTransaction(txHash);

    // Fetch the created account
    const initCounter = await pg.program.account.counter.fetch(
      counterKp.publicKey
    );

    console.log("On-chain data is:", initCounter.count.toString());

    // Check whether the data on-chain is equal to local 'counter'
    const expectCount = new BN(0);
    assert(expectCount.eq(initCounter.count));
  });

  it("Is incremented!", async () => {
    // Send transaction
    const txHash = await pg.program.methods
      .increment()
      .accounts({
        counter: counterKp.publicKey,
        user: pg.wallet.publicKey,
      })
      .rpc();

    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await pg.connection.confirmTransaction(txHash);

    // Fetch the created account
    const incrementCounter = await pg.program.account.counter.fetch(
      counterKp.publicKey
    );

    console.log("On-chain data is:", incrementCounter.count.toString());

    // Check whether the data on-chain is equal to local 'counter'
    const expectCount = new BN(1);
    assert(expectCount.eq(incrementCounter.count));
  });

  it("Is incremented again!", async () => {
    // Send transaction
    const txHash = await pg.program.methods
      .increment()
      .accounts({
        counter: counterKp.publicKey,
        user: pg.wallet.publicKey,
      })
      .rpc();

    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await pg.connection.confirmTransaction(txHash);

    // Fetch the created account
    const incrementCounter = await pg.program.account.counter.fetch(
      counterKp.publicKey
    );

    console.log("On-chain data is:", incrementCounter.count.toString());

    // Check whether the data on-chain is equal to local 'counter'
    const expectCount = new BN(2);
    assert(expectCount.eq(incrementCounter.count));
  });
});
