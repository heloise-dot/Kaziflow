
export const simulateMoMoPayment = async (amount: number, phoneNumber: string) => {
  console.log(`Simulating MoMo payment of ${amount} to ${phoneNumber}...`);

  // 1. Initiate Request
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 2. Mock USSD Push
  const success = Math.random() > 0.1; // 90% success rate for simulation

  if (!success) {
    throw new Error("Payment cancelled by user or insufficient funds.");
  }

  // 3. Confirm Transaction
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: 'SUCCESS',
    timestamp: new Date().toISOString()
  };
};
