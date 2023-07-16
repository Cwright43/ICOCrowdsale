import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers';


// We need to access all of these in our Buy component

const Whitelist = ({ provider, crowdsale, setIsLoading }) => {

	const [amount, setAmount] = useState('0')
	const [isWaiting, setIsWaiting] = useState(false)

	const addWhitelist = async (e) => {
		e.preventDefault()
		setIsWaiting(true)

		try {

		const signer = await provider.getSigner()

		const whiteAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
		const transaction = await crowdsale.connect(signer).whitelist()
		// await transaction.wait()

		} catch {
		window.alert('User rejected or transaction reverted U GAY')
		}

		setIsLoading(true)

		}

	return (

		<Form onSubmit={addWhitelist} style={{ maxWidth: '800px', margin: '50px auto' }}>
		<Form.Group as={Row}>
		<Col>
			<Form.Control type="" placeholder="User Address" onChange={(e) => setAmount(e.target.value)}/>
		</Col>
		<Col className='text-center'>
		{isWaiting ? (
			<Spinner animation="border"/>
		) : (
		    <Button variant="primary" type="submit" style={{ width: '100%'}}>
			   Add User to Whitelist
			</Button>
		)}

		 </Col>
		</Form.Group>
	</Form>

	)
}

export default Whitelist;