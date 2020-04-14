pragma solidity 0.6.0;

contract Auction {
    address internal owner;
    uint256 public start;
    uint256 public end;
    uint256 public highestBid;
    address public highestBidder;
    
    enum auctionState {
        CANCELLED,
        STARTED
    }
    
    struct Car {
        string brand;
        string number;
    }
    
    Car public myCar;
    address[] bidders;

    mapping(address => uint) public bids;

    auctionState public STATE;

    modifier isOngoing() {
        require(now <= end);
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }
    
    event BidEvent(address indexed highestBidder, uint256 highestBid);
    event WithdrawalEvent(address withdrawer, uint256 amount);
    event CanceledEvent(string message, uint256 time);
}


contract MyAuction is Auction{
  
    constructor (uint _biddingTime, address _owner, string memory _brand, string memory _number) public {
        owner = _owner;
        start = now;
        end = start + _biddingTime * 1 minutes;
        STATE = auctionState.STARTED;
        myCar.brand =_brand;
        myCar.number = _number;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function bid() public payable isOngoing returns (bool) {
        uint newBid = bids[msg.sender] + msg.value;
        require(newBid > highestBid, "Your bid is too low, make a higher bid");
        highestBidder = msg.sender;
        highestBid = newBid;
        if(bids[msg.sender] == 0) {
            bidders.push(msg.sender);
        }
        bids[msg.sender] = newBid;
        emit BidEvent(highestBidder, highestBid);
        return true;
    }
    
    function cancel_auction() external onlyOwner isOngoing returns (bool) {
        STATE = auctionState.CANCELLED;
        end = now;
        emit CanceledEvent("Auction Cancelled", now);
        return true;
     }
    
    function destructAuction() external onlyOwner returns (bool) {
        require(now > end, "You can't destruct the contract, The auction is still open");
        for(uint i=0; i < bidders.length; i++) {
            assert(bids[bidders[i]]==0);
        }
        selfdestruct(address(uint160(owner)));
        return true;
    }

    function withdraw() public returns (bool) {
        require(now >= end , "You can't withdraw, the auction is still open");
        uint amount;
        amount = bids[msg.sender];
        bids[msg.sender] = 0;
        msg.sender.transfer(amount);
        emit WithdrawalEvent(msg.sender, amount);
        return true;
    }
    
    function getMyBid() public view returns(uint) {
        return bids[msg.sender];
    }
    
    function contractBalance() public view returns(uint) {
        return (address(this)).balance;
    }
    
    function buyCar() external {
        require(now >= end, "Auction is still ongoing");
        require(msg.sender == highestBidder, "Called is not the winner");
        uint winningBid = bids[highestBidder];
        bids[highestBidder] = 0;
        address payable _owner = address(uint160(address(owner)));
        _owner.transfer(winningBid);
    } 
    
    function numberOfBidders() public view returns(uint) {
        return bidders.length;
    }
}
