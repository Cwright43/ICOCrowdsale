// SPDX License-Identifier; Unlicense

pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {
	address public owner;
	Token public token;
	uint256 public price;
	uint256 public maxTokens;
	uint256 public tokensSold;
	uint256 public initialCount;
	uint256 public whitelistCount;

	// Define dates for OPEN & CLOSE of crowdsale

	uint256 public startDate;
	uint256 public endDate;
	uint256 public goalDate;

	// Create variables for MINIMUM & MAXIMUM purchase amounts

	uint256 public minBuy;
	uint256 public maxBuy;

	// Create variables for minimum funding GOAL

	uint256 public fundingGoal;

	struct Whitelist {
        uint256 id;
        address buyer;
    }

    mapping(address => bool) public whitelister;
    mapping(uint256 => Whitelist) public whitelistShow;

	event Buy(uint256 amount, address buyer);
	event Finalize(uint256 tokensSold, uint256 ethRaised);
	
	constructor(Token _token, uint256 _price, uint256 _maxTokens) {
		
		owner = msg.sender;
		token = _token;
		price = _price;
		maxTokens = _maxTokens;
		initialCount = 1;
		whitelister[msg.sender] = true;
		whitelistCount = 1;
		fundingGoal = (300000 * 1e18);

		// Adding MIN & MAX purchase requirement
		minBuy = (50 * 1e18);
		maxBuy = (10000 * 1e18);
		
		// Start
		startDate = 1693008000; 
		
		// End
		endDate = 1693439999; 

		// Goal Cutoff date
		goalDate = 1693076400;

	}

	modifier onlyOwner() {
		require(msg.sender == owner, "Caller is not the owner");
		_;
	}

	receive() external payable {
	uint256 amount = msg.value / price;
	buyTokens(amount * 1e18);
	}

	function refundInvestors() public payable {

		require(fundingGoal >= tokensSold, "Funding goal has been reached");
		
		// Use refundTokens function which does NOT require pre-approval!
		token.refundTokens(msg.sender, address(this), token.balanceOf(msg.sender));

		(bool sent, ) = msg.sender.call{value: token.balanceOf(msg.sender) * 2}("");
		require(sent, "Failure! ETH not sent");

		tokensSold -= token.balanceOf(msg.sender);
	}
	

	// User is going to receive ETH in this buyTokens function here

	function buyTokens(uint256 _amount) public payable {

		// Ensure that token purchase amount is within range
		require(msg.value >= minBuy, "Not enough tokens being purchased");
		require(msg.value <= maxBuy, "Too many tokens being purchased");

		// Ensure that the time of purchase is during the available date and time
		require(block.timestamp >= startDate && block.timestamp <= endDate, "Token crowdsale is no longer open");

		// Require that the purchaser MUST be pre-approved on the Whitelist
		require(whitelister[msg.sender] == true, "User is not pre-approved on Whitelist");

		require(msg.value == (_amount / 1e18) * price);

		//Make sure there are enough tokens available on the exchange to fulfill the order
		require(token.balanceOf(address(this)) >= _amount);
		
		// Trigger function to TRANSFER Tokens to the buyer account
		token.transfer(msg.sender, _amount);

		// Update the number of tokens sold which then gets displayed on the webpage
		tokensSold += _amount;

		emit Buy(_amount, msg.sender);
	}

	function setPrice(uint256 _price) public onlyOwner {
		price = _price;
	}

	function finalize() public onlyOwner {
		require(token.transfer(owner, token.balanceOf(address(this))));

		uint256 value = address(this).balance;
		(bool sent, ) = owner.call{value: value }("");
		require(sent);

		emit Finalize(tokensSold, value);
	}

	// Function to ADD people to the whitelist

	function whitelist(address _whitelist) public payable onlyOwner {
	    
		token.approve(_whitelist, (6000 * 1e18));

		// Address added to primary whitelist mapping (Boolean)
	    whitelister[_whitelist] = true;
        whitelistCount++;

        // Populate the mapping
        whitelistShow[whitelistCount] = Whitelist(
        whitelistCount - 1,
        _whitelist
        );
	}

    function deleteWhitelist(uint256 _id, address _whitelist) public onlyOwner {
    
        whitelister[_whitelist] = false;
        delete whitelistShow[_id];
    }

	function showTime() view public {
	    console.log(block.timestamp);
	}



}

