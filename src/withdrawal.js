const API = require('kucoin-node-sdk');

async function withdrawSol(address, amount) {
  try {
    const result = await API.rest.User.Withdrawals.applyWithdraw('SOL', address, amount, {
      chain: 'sol', // Ensure you're specifying the chain for SOL
    });

    console.log(`Withdrawal to ${address} of ${amount} SOL successful:`, result);
  } catch (error) {
    console.error(`Failed to withdraw to ${address}:`, error);
  }
}

module.exports = { withdrawSol };
