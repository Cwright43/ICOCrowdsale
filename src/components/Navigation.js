import Navbar from 'react-bootstrap/Navbar';

import logo from '../logo.png';

const Navigation = () => {

	// This will return the HTML from inside the React component
	return(
		<Navbar>
			<img alt="logo" 
			src={logo} 
			width="40" 
			height="40"
			className="d-inline-block align-top mx-3"
			/>
		   <Navbar.Brand href="#">DApp ICO Crowdsale YEYEAH</Navbar.Brand>
		</Navbar>
	)
}

export default Navigation;