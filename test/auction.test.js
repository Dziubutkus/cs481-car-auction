const { balance, ether, expectRevert } = require('@openzeppelin/test-helpers');
const { ethGetBalance } = require('./helpers/web3');

 
const should = require('chai')
    .should();


const Auction = artifacts.require('MyAuction');


contract('Auction', function ([owner, Alice, Bob, Carol, Dan]) {

    function checkVariables(account, expectedHighestBid, expectedHighestBidder, expectedMyBid, expectedNumberOfBidders) {
        it('check highestBid', async function() {
            let highestBid = await this.auction.getMyBid({from: account});
            highestBid.toString().should.be.equal(expectedHighestBid);
        });

        it('check highestBidder', async function() {
            let highestBidder = await this.auction.highestBidder.call();
            highestBidder.should.equal(expectedHighestBidder);
        });
        it('check getMyBid()', async function() {
            let myBid = await this.auction.getMyBid({from: account});
            myBid.toString().should.be.equal(expectedMyBid);
        });
        it('check numberOfBidders', async function() {
            let numberOfBidders = await this.auction.numberOfBidders.call();
            numberOfBidders.toString().should.be.equal(expectedNumberOfBidders);
        });
    }

    const biddingTime = "1";
    const brand = "Tesla";
    const rNumber = "?";

    before(async function () {
        this.auction = await Auction.new(biddingTime, brand, rNumber, {from: owner});
        //this.auction = await Auction.new(biddingTime, owner, brand, rNumber, {from: owner});
    });

    it('Alice should be able to bid 1 ether', async function() {
        await this.auction.bid({from: Alice, value: ether('1')});
    });

    checkVariables(Alice, ether('1').toString(), Alice, ether('1').toString(), "1");

    it('Bob should not be able to bid 1 ether', async function() {
       await expectRevert.unspecified(
           this.auction.bid({from: Bob, value: ether('1')})
        );
    });

    it('Bob should be able to bid 2 ethers', async function() {
        await this.auction.bid({from: Bob, value: ether('2')});
    });

    checkVariables(Bob, ether('2').toString(), Bob, ether('2').toString(), "2");

    it('Alice should not be able to bid 1 ether', async function() {
        await expectRevert.unspecified(
            this.auction.bid({from: Alice, value: ether('1')})
        );
    });

    it('Alice should be able to bid 1.1 ethers', async function() {
        await this.auction.bid({from: Alice, value: ether('1.1')});
    });

    checkVariables(Alice, ether('2.1').toString(), Alice, ether('2.1').toString(), "2");

    it('Bids by Carol and Dan to test if Alice can withdraw more than she should', async function() {
        await this.auction.bid({from: Carol, value: ether('2.2')});
        await this.auction.bid({from: Dan, value: ether('2.3')});
        await this.auction.bid({from: Alice, value: ether('0.3')});
    });

    checkVariables(Alice, ether('2.4').toString(), Alice, ether('2.4').toString(), "4");

    it('Alice should not be able to buyCar() while auction is going', async function() {
       await expectRevert.unspecified(
           this.auction.buyCar({from: Alice})
        );
    });

    it('should cancel auction', async function() {
        await this.auction.cancelAuction({from: owner});
    });
    /*
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    it('should timeout for 2 seconds to let time variables catch up', async function() {
        await timeout(2000);
    });
    */
    it('should not allow Bob to call buyCar()', async function() {
       await expectRevert.unspecified(
           this.auction.buyCar({from: Bob})
       );
    });

    it('should have correct contractBalance', async function() {
        let contractBalance = await this.auction.contractBalance.call();
        contractBalance.toString().should.be.equal(ether('8.9').toString());
        //assert.equal(contractBalance.toString, (ether('8.9').toString()))
    });

    it('should allow Alice to buyCar and ether should go to owner', async function() {
        let beforeOwnerBalance = await balance.current(owner);
        let expectedBalance = parseInt(beforeOwnerBalance) + parseInt(ether('2.4'));
        await this.auction.buyCar({from: Alice});
        let currentOwnerBalance = await balance.current(owner);
        currentOwnerBalance.toString().should.be.equal(expectedBalance.toString());
    });

    it('should not allow Alice to buyCar twice', async function() {
        let beforeOwnerBalance = await balance.current(owner);
        await this.auction.buyCar({from: Alice});
        let currentOwnerBalance = await balance.current(owner);
        currentOwnerBalance.toString().should.be.equal(beforeOwnerBalance.toString());
        //console.warn(currentOwnerBalance.toString(), beforeOwnerBalance.toString());
    });

    it('should not allow Alice to withdraw ether', async function() {
        let beforeAliceBalance = await balance.current(Alice);
        await this.auction.withdraw({from: Alice});
        let currentAliceBalance = await balance.current(Alice);
        currentAliceBalance.toString().should.be.equal(beforeAliceBalance.toString());
    });

    it('should have 0 bids for Bob, Carol and Dan', async function() {
        await this.auction.withdraw({from: Bob})
        await this.auction.withdraw({from: Carol})
        await this.auction.withdraw({from: Dan})
        bal1 = await this.auction.getMyBid({from: Bob})
        bal2 = await this.auction.getMyBid({from: Carol})
        bal3 = await this.auction.getMyBid({from: Dan})
        assert.equal(bal1, 0)
        assert.equal(bal2, 0)
        assert.equal(bal3, 0)
    }) 

    /*
    it('contract balance should be 0 after everyone withdraws', async function() {
        await this.auction.withdraw({from: Bob});
        //await this.auction.contractBalance()
        let balance = await ethGetBalance(this.auction.address)
        console.warn(balance)
        //console.log("Contract's balance: " + (await ethGetBalance(this.auction.address), 'ether'));
        //await this.auction.withdraw({from: Carol});
        //await this.auction.withdraw({from: Dan});
        //contractBalance = await this.auction.contractBalance()
        //assert.equal(contractBalance, 0)
    })
    */
});