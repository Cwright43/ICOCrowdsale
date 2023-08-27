import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

const WhitelistDisplay = ({ provider, crowdsale, whitelistShow, account, setIsLoading}) => {
  const [isWaiting, setIsWaiting] = useState(false)

 const removeHandler = async (id, buyer) => {

    try {

    id++;
    const signer = await provider.getSigner()
    const transaction = await crowdsale.connect(signer).deleteWhitelist(id, buyer)
    await transaction.wait()
    console.log(`${buyer} was removed from the whitelist BITCH`)

    } catch {
      window.alert('User rejected or transaction reverted - Finalize Handler')
    }

    setIsLoading(true)

  }

    return (

    <Table striped bordered hover responsive>
      {account == 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 && (
      <thead>
        <tr>
          <th>Whitelist Address</th>
          <th>Remove User</th>
        </tr>
      </thead>
      )}
      {account == 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 && (
      <tbody>
        {Array.isArray(whitelistShow)
        ?  whitelistShow.map((whitelist, index) => (
       
        <tr key={index}>

        {whitelist.id != 0 &&  (
          <td>{whitelist.buyer}</td>
          )}
        {whitelist.id != 0 &&  (
          <td>  
                <Button 
                  variant="primary" 
                  style={{ width: '100%' }}
                  onClick={() => removeHandler(whitelist.id, whitelist.buyer)}
                  >
                  Remove User
                </Button>
          </td>
          )}
         </tr>
          ))
        : null}
      </tbody>
        )}
    </Table>
  );


}

export default WhitelistDisplay;
