# cs481-car-auction
Car auction homework solution for CS481

## Setup
### Install dependencies

```
npm install
```

**Run ganache**

Open a new terminal and enter:
```
ganache-cli --mnemonic cs481
```
Or if you are using Ganache GUI, run it. Make sure your port number is the same as in truffle-config.js (8545)

**Change owner address if you are using GUI and can't change mnemonic**

Copy the first address from the output and update the owner variable in `migrations/2_deploy.js`
```
const owner = "0xDF6E105b95A6Ea73B9c06733F445D543a1F6c5dc"
```

Replace content of AuctionSolution.sol with your solidity code. 

**!Replace the code inside, not the file!**

**Change compiler version**

If you are using solidity 0.6.0, then change the compiler version in `truffle-config.js`

**Change 2 require statements**
Truffle test run so fast that `now > end` does not work and needs to be changed to `now >= end`
1) in withdraw()
`require(now >= end , "You can't withdraw, the auction is still open");`
2) in buyCar()
`require(now >= end, "Auction is still ongoing"); `

## Run the test

You should be all setup by now.

Open a new terminal and run:
```
truffle test
```

## Understanding the output

If you did everything perfectly, your output should only have 1 error that shows a very insignificant difference between 2 values.
That is because it tried to call buyCar() for the second time, and was reverted, costing some little gas and I did not take that gas into account.

If the difference is significant (~2 ether), then you have a mistake in your code.

Some students might have 1-2 more reverts. It is because some students created modifiers, some added require statements, some did not, so it is only possible to know if the code is correct by manually checking it.
