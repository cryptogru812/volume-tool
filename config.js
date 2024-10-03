module.exports = {
    baseUrl: 'https://openapi-v2.kucoin.com', // Use the sandbox URL if testing
    apiAuth: {
      key: process.env.KUCOIN_API_KEY || '',
      secret: process.env.KUCOIN_API_SECRET || '',
      passphrase: process.env.KUCOIN_API_PASSPHRASE || '',
    },
    authVersion: 2,
  };
  