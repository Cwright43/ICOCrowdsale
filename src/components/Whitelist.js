import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers';


// We need to access all of these in our Buy component

const Whitelist = ({ provider, crowdsale, account, whitelistCount, setIsLoading }) => {

	const [newAddress, setNewAddress] = useState(null)
	const [isWaiting, setIsWaiting] = useState(false)

	const whitelistHandler = async (e) => {
		e.preventDefault()
		console.log("whitelist is being activated")
		setIsWaiting(true)

	   try {
	    	const signer = await provider.getSigner()
			const whitelisting = await crowdsale.connect(signer).whitelist(newAddress)
			await whitelisting.wait()

			console.log(`${newAddress} added to whitelist`)
		
	   	} catch { window.alert('User rejected or transaction reverted BRUH') }

			setIsLoading(true)
		}

	return (

		<Form onSubmit={whitelistHandler} style={{ maxWidth: '400px', margin: '50px auto', }}>
		{account == 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 && (
		<Form.Group as={Row}>
		<Row>
			<Form.Control type="" placeholder="User Address" onChange={(e) => setNewAddress(e.target.value)}/>
		</Row>
		<Row className='text-center'>
		{isWaiting ? (
			<Spinner animation="border"/>
		) : (
		    <Button variant="primary" type="submit" style={{ width: '100%', margin: '10px auto', background: 'black'}}>
			   Add to Whitelist
			</Button>
		)}

		 </Row>
		</Form.Group>
		)}
	</Form>

	)
}

export default Whitelist;