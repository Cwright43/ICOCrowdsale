const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens


describe('Crowdsale', () => {
	let crowdsale, token
	let accounts, deployer, user1
	let whitelister0, whitelister1, whitelister2

	beforeEach(async () => {
		// Load contracts
		const Crowdsale = await ethers.getContractFactory('Crowdsale')
		const Token = await ethers.getContractFactory('Token')


		// Deploy token
		token = await Token.deploy('Dapp University', 'DAPP', '1000000')

		// Configure Accounts
		accounts = await ethers.getSigners()
		deployer = accounts[0]
		user1 = accounts[1]

		// Deploy Crowdsale
		crowdsale = await Crowdsale.deploy(token.address, ether(1), '1000000')

		// Send tokens to crowdsale
		let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(1000000))
		await transaction.wait()
		
		whitelister0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		whitelister1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
		whitelister2 = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'

		transaction = await crowdsale.connect(deployer).whitelist(whitelister0)
		result = await transaction.wait()

		transaction = await crowdsale.connect(deployer).whitelist(whitelister1)
		result = await transaction.wait()

		transaction = await crowdsale.connect(deployer).whitelist(whitelister2)
		result = await transaction.wait()
	})

	describe('Deployment', () => {

		it('sends tokens to the Crowdsale contract', async () => {
		  expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(1000000))
		})

		it('returns the price', async () => {
		  expect(await crowdsale.price()).to.equal(ether(1))
		})

		it('returns token address', async () => {
		  expect(await crowdsale.token()).to.equal(token.address)
		})
	})

	describe('Buying Tokens', () => {
		let transaction, result
		let amount = tokens(10)



		describe('Success', () => {

			beforeEach(async () => {
				transaction = await crowdsale.connect(user1).buyTokens(amount, { value: ether(10) })
				result = await transaction.wait()
			})

			it('transfers tokens', async () => {
				expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(999990))
				expect(await token.balanceOf(user1.address)).to.equal(amount)
		  })

			it('updates ether balance of contract', async () => {
				expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
		  })

			it('updates tokensSold', async () => {
				expect(await crowdsale.tokensSold()).to.equal(amount)
		  })


			it('emits a buy event', async () => {
				await expect(transaction).to.emit(crowdsale, 'Buy').withArgs(amount, user1.address)
		  })

	})


		describe('Failure', () => {

			it('rejects insufficient ETH', async () => {
				await expect(crowdsale.connect(user1).buyTokens(tokens(10), { value: 0 })).to.be.reverted
			})

			it('rejects below MIN token purchase amount', async () => {
				await expect(crowdsale.connect(user1).buyTokens(tokens(4), { value: ether(4) })).to.be.reverted
			})

			it('rejects above MAX token purchase amount', async () => {
				await expect(crowdsale.connect(user1).buyTokens(tokens(6001), { value: ether(6001) })).to.be.reverted
				console.log(tokens(10))
			})

		})
})

	describe('Sending ETH', () => {
		let transaction, result
		let amount = ether(10)

		describe('Success', () => {

			beforeEach(async () => {
				transaction = await user1.sendTransaction({ to: crowdsale.address, value: amount })
				result = await transaction.wait()
			})

			it('updates ether balance of contract', async () => {
				expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount)
		  })

			it('updates user token balance', async () => {
				expect(await token.balanceOf(user1.address)).to.equal(amount)
		  })


	})
})

	describe('Updating Price', () => {
		let transaction, result
		let price = ether(2)

		describe('Success', () => {

		beforeEach(async () => {
			transaction = await crowdsale.connect(deployer).setPrice(ether(2))
			result = await transaction.wait()
		})

		it('updates the price', async () => {
			expect(await crowdsale.price()).to.equal(ether(2))
		})

		})

		describe('Failure', () => {

			it('prevents non-owner from updating price', async () => {
				await expect(crowdsale.connect(user1).setPrice(price)).to.be.reverted
			})
			
	})
})


	describe('Finalizing Sale', () =>{
		let transaction, result
		let amount = tokens(10)
		let value = ether(10)

		describe('Success', () => {
			beforeEach(async () => {
				transaction = await crowdsale.connect(user1).buyTokens(amount, { value: value })
				result = await transaction.wait()

				transaction = await crowdsale.connect(deployer).finalize()
				result = await transaction.wait()
			})

		it('transfers remaining tokens to owner', async () => {
		  expect(await token.balanceOf(crowdsale.address)).to.equal(0)
		  expect(await token.balanceOf(deployer.address)).to.equal(tokens(999990))
		})


		it('transfers ETH balance to owner', async () => {
		  expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(0)
		})

		it('emits Finalize event', async () => {
			await expect(transaction).to.emit(crowdsale, "Finalize").withArgs(amount, value)
		})

	})

		describe('Failure', () => {

		it('prevents non-owner from finalizing', async () => {
			await expect(crowdsale.connect(user1).finalize()).to.be.reverted
		})

	})

})
		

	describe('Approving Whitelist', () => {
		
		let transaction, result

	describe('Success', () => {

		it('approves an address to the whitelist', async () => {
			
			expect(await crowdsale.whitelister(whitelister0)).to.equal(true)
			expect(await crowdsale.whitelister(whitelister1)).to.equal(true)
			expect(await crowdsale.whitelister(whitelister2)).to.equal(true)

			console.log(await crowdsale.connect(deployer).showTime())
		 })
	   })
	})

	describe('Refunding to investors', () => {

		let transaction, result
		let amount = tokens(5000)
		let value = ether(5000)
		let refundAmount = tokens(1000)
		let remainingAmount = tokens(4000)

		describe('Success', () => {
		
			beforeEach(async () => {

			// console.log(await token.balanceOf(crowdsale.address))

			console.log(`${await token.balanceOf(user1.address) / 1000000000000000000} Tokens for User1`)
			console.log(`${await token.balanceOf(crowdsale.address) / 1000000000000000000} Tokens for Crowdsale`)

			console.log(`${await ethers.provider.getBalance(user1.address) / 1000000000000000000} ETH for User1`)
			console.log(`${await ethers.provider.getBalance(crowdsale.address) / 1000000000000000000} ETH for Crowdsale`)

			// Send tokens to user1
				transaction = await crowdsale.connect(user1).buyTokens(amount, { value: value })
				result = await transaction.wait()

			console.log(`${await token.balanceOf(user1.address) / 1000000000000000000} Tokens for User1`)
			console.log(`${await token.balanceOf(crowdsale.address) / 1000000000000000000} Tokens for Crowdsale`)

			console.log(`${await ethers.provider.getBalance(user1.address) / 1000000000000000000} ETH for User1`)
			console.log(`${await ethers.provider.getBalance(crowdsale.address) / 1000000000000000000} ETH for Crowdsale`)

			// Refund money back to investors
				transaction = await crowdsale.connect(user1).refundInvestors(refundAmount, { value: ether(1000) })
				result = await transaction.wait()

			})

		it('checks the balance after refunding to exchange', async () => {

			// Ensure user1 has 1000 tokens
			expect(await token.balanceOf(user1.address)).to.equal(remainingAmount)

			console.log(`${await token.balanceOf(user1.address) / 1000000000000000000} Tokens for User1`)
			console.log(`${await token.balanceOf(crowdsale.address) / 1000000000000000000} Tokens for Crowdsale`)
			
			console.log(`${await ethers.provider.getBalance(user1.address) / 1000000000000000000} ETH for User1`)
			console.log(`${await ethers.provider.getBalance(crowdsale.address) / 1000000000000000000} ETH for Crowdsale`)
			

		})
      })

})



})
