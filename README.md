# Description
This is my attempt at making a decentralized Solana application using the Anchor Framework.
There are many bugs, and graphic design is my passion, but if you still want to take a stab at trying
to run this anyway, you're more than welcome to.

# Dependencies
This relies on the solana tool suite and the anchor framework to compile and deploy.
The frontend is made using Vue.js (learn from my mistakes--don't do this).

- [Solana CLI utils](https://docs.solana.com/cli/install-solana-cli-tools)
- [Rust](https://doc.rust-lang.org/cargo/getting-started/installation.html)
- [Anchor-lang Framework](https://www.anchor-lang.com/docs/installation)

# Building
To build the solana program, navigate to this repo's project directory and run:
```
anchor build --release
```

# Testing
To test the Solana program locally, run the following in the project root directory:
```
anchor localnet
```
Or run a local solana validator
Note: You will need SOL for this, so you probably do not want to run this on `mainnet`
```
solana-test-validator
```
and change the provider in `Anchor.toml` to `localnet`
```
[provider]
cluster = "http://localhost:8899"
```
then run the following in the root project directory:
```
anchor deploy --provider.cluster localnet
```

To test the frontend of the application, run the following in the project directory:
```
cd app/
npm install
npm run dev
```

# Notes
If your machine doesn't support AVX2 instructions, you'll have to self-compile the Solana CLI tools,
and disable the simd option in the repo's `Cargo.toml`.

# TODO
- [X] Create the tic tac toe Solana program
- [ ] Connect the frontend to the wallet
- [ ] Manage creating and joining games
- [ ] Improve the UI (graphic design is my passion)

# Contributing
I don't know why you'd ever want to do this, but I'd appreciate the sentiments if you did.
