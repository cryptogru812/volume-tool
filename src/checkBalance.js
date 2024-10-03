const checkBalance = async () => {
    try {
      const result = await API.rest.User.getAccountList();
      const solBalance = result.data.find(account => account.currency === 'SOL');
      console.log(`Available SOL: ${solBalance.available}`);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };
  
  checkBalance();