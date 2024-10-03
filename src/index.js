const API = require("kucoin-node-sdk");
const dotenv = require("dotenv");
const { withdrawSol } = require("./withdrawal");

dotenv.config();

// Initialize the KuCoin API
API.init(require("../config"));

// Define wallet addresses and amounts
const withdrawalList = [
  { address: "6DSudNrFeasRtUjAfDeCF8DFUFm1UiLFnbgvGQNRMPGj", amount:	0.15 },
];

const minDelay = 1000; // Minimum delay in milliseconds (5 seconds)
const maxDelay = 5000; // Maximum delay in milliseconds (10 seconds)

// Check SOL balance
const checkBalance = async () => {
  try {
    const result = await API.rest.User.Account.getAccountsList();
    const solBalance = result.data.find(
      (account) => account.currency === "SOL"
    );
    console.log(`Available SOL: ${solBalance.available}`);
    return parseFloat(solBalance.available); // Return as a float for arithmetic checks
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
};

const checkWithdrawalFee = async () => {
  try {
    const feeResult = await API.rest.User.Withdrawals.getWithdrawalQuotas(
      "SOL"
    );
    const fee = feeResult.data.withdrawMinFee; // This is the correct field
    console.log(`Withdrawal fee for SOL: ${fee}`);
    return parseFloat(fee); // Return as a float for arithmetic checks
  } catch (error) {
    console.error("Error fetching withdrawal fee:", error);
    return 0; // Default to 0 in case of an error
  }
};

// Execute the withdrawals
const executeWithdrawals = async () => {
  const availableBalance = await checkBalance();
  const withdrawalFee = await checkWithdrawalFee();

  let remainingBalance = availableBalance; // Track remaining balance after each withdrawal

  for (const { address, amount } of withdrawalList) {
    const totalCost = amount + withdrawalFee; // The total cost (withdrawal + fee)

    // Allow withdrawal even if the fee is undefined
    if (withdrawalFee === 0 || totalCost <= remainingBalance) {
      await withdrawSol(address, amount);
      remainingBalance -= totalCost; // Subtract the cost (withdrawal + fee) from remaining balance
      console.log(
        `Withdrawal of ${amount} SOL to ${address} was successful. Remaining balance: ${remainingBalance}`
      );

      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      console.log(
        `Waiting for ${delay / 1000} seconds before next withdrawal...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    } else {
      console.log(
        `Not enough balance to withdraw ${amount} SOL to ${address}. Skipping.`
      );
    }
  }

  console.log("All withdrawals processed.");
};

executeWithdrawals().catch(console.error);
