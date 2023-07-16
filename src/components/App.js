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

	const [ minBuy, setMinBuy ] = useState(0)
	const [ maxBuy, setMaxBuy ] = useState(0)

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

		// Fetch minimum token purchase requirement
		// const minBuy = ethers.utils.formatUnits(await crowdsale.minBuy(), 18)
		// setMinBuy(minBuy)

		// Fetch maximum token purchase requirement
		// const maxBuy = ethers.utils.formatUnits(await crowdsale.maxBuy(), 18)
		// setMaxBuy(maxBuy)

		setIsLoading(false)

	}

	useEffect(() => {
		if (isLoading) {
		loadBlockchainData()
		}
	}, [isLoading]);

	return(
    	<Container>
    	  <Navigation />

    	  <h1 className='my-4 text-center'>Introducing DApp Token</h1>

    	  <h4 className='my-1 text-center'>Sale is open 7-15-23 through 7-16-23</h4>
    	  <h4 className='my-1 text-center'>12:00 AM to 12:00 AM</h4>

    	  {isLoading ? (
    	  	<Loading />
    	  	) : (
    	  	<>
	    	  	<p className='text-center'><strong>Current Price: </strong>{price} ETH</p>
	    	  	<Buy provider={provider} price={price} crowdsale={crowdsale} setIsLoading={setIsLoading} />
	    	  	<Whitelist provider={provider} price={price} crowdsale={crowdsale} setIsLoading={setIsLoading} />
	    	  	<Progress maxTokens={maxTokens} tokensSold={tokensSold} />
    	  	</>
    	  	)}

    	  
    	  <hr />
    	  {account && (
    	  	<Info account={account} accountBalance={accountBalance} />
    	  	)}
    	  <h3 className='my-4 text-center'>Pre-approved Buyers on Whitelist</h3>
	    </Container>
	)
}

export default App;