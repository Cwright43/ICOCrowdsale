import { useState } from 'react';
import { Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers';


// We need to access all of these in our Buy component

const Refund = ({ provider, crowdsale, account, accountBalance, tokensSold, saleGoal, goalDate, setIsLoading }) => {

	const [isWaiting, setIsWaiting] = useState(false)


	const currentTime = Math.floor(Date.now() / 1000)

	const refundHandler = async (e) => {
		e.preventDefault()
		console.log("Refund is being prepared")
		setIsWaiting(true)

	   try {
	    	const signer = await provider.getSigner()
			const refunding = await crowdsale.connect(signer).refundInvestors()
			await refunding.wait()
			console.log(accountBalance)
			console.log(tokensSold)
			console.log(saleGoal)
			console.log(goalDate)
			console.log(currentTime)

	   	} catch { window.alert('User rejected or transaction reverted BRUH') }

			setIsLoading(true)
		}

	return (

		<Form onSubmit={refundHandler} style={{ maxWidth: '400px', margin: '50px auto', }}>
		{ accountBalance > 0 && 300000 > tokensSold && currentTime > goalDate && (	
		<h5 className='my-4 text-center bg-gradient rounded-2'>Refund Goal Was Not Reached</h5>
		)}
		{ accountBalance > 0 && 300000 > tokensSold && currentTime > goalDate && (			
		<Row className='text-center'>
		{isWaiting ? (
			<Spinner animation="border"/>
		) : (
		    <Button variant="primary" type="submit" style={{ width: '100%', margin: '10px auto', color:'blue', background: 'gold'}}>
			   Get My Refund BITCH
			</Button>
		)}

		 </Row>
		)}
	</Form>

	)
}

export default Refund;
