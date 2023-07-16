import ProgressBar from 'react-bootstrap/ProgressBar';

const Progress = ({ maxTokens, tokensSold, minBuy, maxBuy }) => {

	const unixTimestamp = Math.floor(Date.now() / 1000)
	const date = new Date(unixTimestamp * 1000)

	return(
		<div className='my-3'>
		  <ProgressBar now={((tokensSold / maxTokens) * 100)} label={`${(tokensSold / maxTokens) * 100}%`} />
		  <p className='text-center my-3'>{tokensSold} / {maxTokens} Tokens Sold and {maxBuy / 1e18}</p>
		  <p className='text-center my-3'>Minimum Purchase of 5 Tokens  ---   Maximum Purchase of 6000 Tokens</p>
		  <p className='text-center my-3'>Current Date & Time: {date.toLocaleDateString("en-US")} {date.toLocaleTimeString("en-US")}</p>
		</div>
	)
}

export default Progress;