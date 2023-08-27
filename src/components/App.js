import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Buy from './Buy';
import Info from './Info';
import Loading from './Loading';
import Progress from './Progress';
import Whitelist from './Whitelist';
import WhitelistDisplay from './WhitelistDisplay';
import Refund from './Refund';

// ABIs

import TOKEN_ABI from '../abis/Token.json'
import CROWDSALE_ABI from '../abis/Crowdsale.json'

import config from '../config.json'

function App () {
	
	const [ provider, setProvider ] = useState(null)
	const [ crowdsale, setCrowdsale ] = useState(null)

	const [ account, setAccount ] = useState(null)
	const [ accountBalance, setAccountBalance ] = useState(0)

	const [ price, setPrice ] = useState(0)
	const [ maxTokens, setMaxTokens ] = useState(0)
	const [ tokensSold, setTokensSold ] = useState(0)
	const [ saleGoal, setSaleGoal ] = useState(0)

	const [ minBuy, setMinBuy ] = useState(0)
	const [ maxBuy, setMaxBuy ] = useState(0)
	const [whitelistShow, setWhitelistShow] = useState(1000)

	const [ startDate, setStartDate ] = useState(0);
	const [ endDate, setEndDate ] = useState(0);
	const [ goalDate, setGoalDate ] = useState(0);

	const [ crowdsaleStatus, setCrowdsaleStatus ] = useState(null)


	const [isLoading, setIsLoading] = useState(true)
	

	const loadBlockchainData = async () => {
		// Initiate Provider
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		setProvider(provider)

		// Initiate contracts
		const token = new ethers.Contract(config[31337].token.address, TOKEN_ABI, provider)
		const crowdsale = new ethers.Contract(config[31337].crowdsale.address, CROWDSALE_ABI, provider)
		setCrowdsale(crowdsale)

		// Fetch account
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
		const account = ethers.utils.getAddress(accounts[0])
		setAccount(account)

		// Fetch account balance
		const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account), 18)
		setAccountBalance(accountBalance)

		// Fetch price
		const price = ethers.utils.formatUnits(await crowdsale.price(), 18)
		setPrice(price)

		// Fetch max tokens
		const maxTokens = ethers.utils.formatUnits(await crowdsale.maxTokens(), 18)
		setMaxTokens(maxTokens)

		// Fetch tokens sold
		const tokensSold = ethers.utils.formatUnits(await crowdsale.tokensSold(), 18)
		setTokensSold(tokensSold)

		// Fetch MIN & MAX purchase amounts from Crowdsale contract
		const minBuy = ethers.utils.formatUnits(await crowdsale.minBuy(), 18)
		setMinBuy(minBuy)

		const maxBuy = ethers.utils.formatUnits(await crowdsale.maxBuy(), 18)
		setMaxBuy(maxBuy)

		const fundingGoal = ethers.utils.formatUnits(await crowdsale.fundingGoal(), 18)
		setSaleGoal(fundingGoal)

		// Fetch start date
		const start = ethers.utils.formatUnits(await crowdsale.startDate(), 0)
		setStartDate(start)

		// Fetch end date
		const end = ethers.utils.formatUnits(await crowdsale.endDate(), 0)
		setEndDate(end)

		// Fetch goal cutoff date
		const goal = ethers.utils.formatUnits(await crowdsale.goalDate(), 0)
		setGoalDate(goal)

		// Fetch whitelist count
    const count = await crowdsale.whitelistCount()
    const items = []

    for(var i = 1; i < count; i++) {
      const whitelist = await crowdsale.whitelistShow(i + 1)
      items.push(whitelist)
    }

    setWhitelistShow(items)

		const unixTimestamp = Math.floor(Date.now() / 1000)

		if (unixTimestamp > start && unixTimestamp < end) {
			setCrowdsaleStatus("OPEN")
		} else {
			setCrowdsaleStatus("CLOSED")
		}

    

		setIsLoading(false)

	}

	useEffect(() => {
		if (isLoading) {
		loadBlockchainData()
		}
	}, [isLoading]);

	return(
    	<Container>
    	  <Navigation crowdsaleStatus={crowdsaleStatus}/>

    	  <h1 className='my-4 text-center p-3 mb-2 bg-success bg-gradient text-white rounded-2'>Introducing DApp Token</h1>
    	  <h4 className='my-3 text-center'>Sale is open 8-26-23 through 8-27-23</h4>
    	  <h6 className='my-3 text-center'>12:00 AM to 12:00 AM</h6>
    	  <h6 className='text-center my-2'>Crowdsale is currently: <strong>{crowdsaleStatus}</strong></h6>

    	  {isLoading ? (
    	  	<Loading />
    	  	) : (
    	  	<>
	    	  	<p className='my-4 text-center'><strong>Current Price: </strong>{price} ETH per Token</p>
	    	  	<p className='my-4 text-center'>Must purchase between <strong>{minBuy}</strong> and <strong>{maxBuy}</strong> tokens</p>
	    	  	<Buy provider={provider} price={price} crowdsale={crowdsale} setIsLoading={setIsLoading} />
	    	  	<p className='my-1 text-left'><strong>Account Balance BITCH: </strong>{accountBalance}</p>
	    	  	<Refund 
	    	  			provider={provider} 
	    	  			crowdsale={crowdsale} 
	    	  			account={account} 
	    	  			accountBalance={accountBalance}
	    	  			tokensSold={tokensSold}
	    	  			saleGoal={saleGoal}
	    	  			goalDate={goalDate}
	    	  			setIsLoading={setIsLoading} />
	    	  	<Whitelist provider={provider} crowdsale={crowdsale} account={account} setIsLoading={setIsLoading} />
	    	  	<Progress maxTokens={maxTokens} tokensSold={tokensSold} saleGoal={saleGoal} startDate={startDate} endDate={endDate} goalDate={goalDate} />
    	  	</>
    	  	)}

    	  
    	  <hr />
    	  {account && (
    	  	<Info account={account} accountBalance={accountBalance} />
    	  	)}
    	  <h3 className='my-4 text-center text-warning p-3 mb-2 bg-primary bg-gradient rounded-2'>Pre-approved Buyers on Whitelist</h3>

              <WhitelistDisplay
              		provider={provider}
              		crowdsale={crowdsale}
                  whitelistShow={whitelistShow}
                  account={account}
                  setIsLoading={setIsLoading} 
              />
	    </Container>
	)
}

export default App;
