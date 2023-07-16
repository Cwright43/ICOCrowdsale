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

	// Define dates for OPEN & CLOSE of crowdsale

	uint256 public startDate;
	uint256 public endDate;

	// Create variables for MINIMUM & MAXIMUM purchase amounts

	uint256 public minBuy;
	uint256 public maxBuy;

	// Create a variable for WHITELISTING pre-approved buyers

	mapping(address => bool) public whitelister;

	event Buy(uint256 amount, address buyer);
	event Finalize(uint256 tokensSold, uint256 ethRaised);
	
	constructor(Token _token, uint256 _price, uint256 _maxTokens) {
		
		owner = msg.sender;
		token = _token;
		price = _price;
		maxTokens = _maxTokens;
		initialCount = 1;

		// Adding MIN & MAX purchase requirement
		minBuy = (5 * 1e18);
		maxBuy = (6000 * 1e18);
		
		// July 15th, 2023 Start
		startDate = 1689404400; 
		
		// July 15th, 2023 End
		endDate = 1689490799; 
	}

	modifier onlyOwner() {
		require(msg.sender == owner, "Caller is not the owner");
		_;
	}

	receive() external payable {
	uint256 amount = msg.value / price;
	buyTokens(amount * 1e18);
	}

	// User is going to receive ETH in this buyTokens function here

	function buyTokens(uint256 _amount) public payable {

		// Ensure that token purchase amount is within range

		require(msg.value >= minBuy, "Not enough tokens being purchased");
		require(msg.value <= maxBuy, "Too many tokens being purchased");

		// Ensure that the time of purchase is during the available date and time
		require(block.timestamp >= startDate && block.timestamp <= endDate);


		// Require that the purchaser MUST be pre-approved on the Whitelist
		require(whitelister[msg.sender] == true, "User is not pre-approved on Whitelist BITCH");

		require(msg.value == (_amount / 1e18) * price);
		require(token.balanceOf(address(this)) >= _amount);
		
		require(token.transfer(msg.sender, _amount));
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

	function whitelist(address _whitelist) public onlyOwner {
	    whitelister[_whitelist] = true;
	   
	    // console.log(whitelister[0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266]);
	    // console.log(whitelister[0x70997970C51812dc3A010C7d01b50e0d17dc79C8]);
	    // console.log(whitelister[0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC]);
	}

	function showTime() public {
	    console.log(block.timestamp);
	}



}

