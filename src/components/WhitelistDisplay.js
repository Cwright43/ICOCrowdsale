import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

const WhitelistDisplay = ({ crowdsale, whitelistShow, setIsLoading }) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)

  const loadWhitelistData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const signer = await provider.getSigner()
    setSigner(signer)
    


    setIsLoading(false)
  }


  const removeHandler = async (id, buyer) => {

    try {

    console.log(buyer)
    console.log(id/1)
    
    console.log(signer)
    
    
    console.log(signer)

    // const transaction = await crowdsale.connect(signer).removeWhitelist(id/1)
    // await transaction.wait()
    


    } catch {
      window.alert('User rejected or transaction reverted - Finalize Handler')
    }

    setIsLoading(true)

  }

    return (

    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Whitelist #</th>
          <th>Whitelist Address</th>
          <th>Remove User</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </Table>
  );
}

export default WhitelistDisplay;
