import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const DeleteWhitelist = ({ provider, crowdsale, setIsLoading }) => {
  const [newAddress, setNewAddress] = useState(null)
  const [isWaiting, setIsWaiting] = useState(false)

  const deleteHandler = async (e) => {
    e.preventDefault()
    setIsWaiting(true)

    try {
      const signer = await provider.getSigner()
      const transaction = await crowdsale.connect(signer).removeWhitelist(newAddress)
      await transaction.wait()
      console.log(`${newAddress} deteleted from Whitelist`)
    } catch {
      window.alert('User rejected or transaction reverted')
    }

    setIsLoading(true)
  }

  return(
    <Form onSubmit={deleteHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
      {isWaiting ? (
        <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Form.Group as={Row}>
          <Col>
            <Form.Control type="string" placeholder="Enter User Address" onChange={(e) => setNewAddress(e.target.value)}/>
          </Col>
          <Col>
          <Button variant="primary" type="submit" style={{ width: '100%' }}>
            Delete User
          </Button>
           </Col>
        </Form.Group>
      )}
    </Form>
  )
}

export default DeleteWhitelist;
