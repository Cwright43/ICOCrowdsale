import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

import TOKEN_ABI from '../abis/Token.json'
import CROWDSALE_ABI from '../abis/Crowdsale.json'

import config from '../config.json'

import ProgressBar from 'react-bootstrap/ProgressBar';

const Progress = ({ maxTokens, tokensSold, saleGoal, startDate, endDate, goalDate }) => {

	const unixTimestamp = Math.floor(Date.now() / 1000)
	const date = new Date(unixTimestamp * 1000)

	const closeDate = new Date(goalDate * 1000)

	const [isLoading, setIsLoading] = useState(true)

	let crowdsaleStatus

	if (unixTimestamp > startDate && unixTimestamp < endDate) {
		crowdsaleStatus = "OPEN"
	} else {
		crowdsaleStatus = "CLOSED"
	}

	return(
		<div className='my-3'>
		  <ProgressBar now={((tokensSold / maxTokens) * 100)} label={`${(tokensSold / maxTokens) * 100}%`} />
		  <p className='text-center my-3'>{tokensSold} / {maxTokens} Tokens Sold</p>
		  <p className='text-center my-3'><strong>{(saleGoal) - (tokensSold)}</strong> Remaining until Goal is Reached</p>
		  <p className='text-center my-3'>Goal must be reached by <strong>{closeDate.toLocaleDateString("en-US")},  {closeDate.toLocaleTimeString("en-US")}</strong></p>
		  <p className='text-center my-2'>Current Date & Time: <strong>{date.toLocaleDateString("en-US")},  {date.toLocaleTimeString("en-US")}</strong></p>
		  <p className='text-center my-2'>Crowdsale is currently: <strong>{crowdsaleStatus}</strong></p>
		  
		</div>
	)
}

export default Progress;