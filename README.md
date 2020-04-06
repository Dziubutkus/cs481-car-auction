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
ganache-cli
```
Or if you are using Ganache GUI, run it.

**Change owner address**

Copy the first address from the output and update the owner variable in `migrations/2_deploy.js`
```
const owner = "0xDF6E105b95A6Ea73B9c06733F445D543a1F6c5dc"
```

Replace content of AuctionSolution.sol with your solidity code. 

**!Replace the code inside, not the file!**

**Change compiler version**

If you are using solidity 0.6.0, then change the compiler version in `truffle-config.js`

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

**Insert a pic**

Some students might have 1-2 more reverts. 

**finish this**
