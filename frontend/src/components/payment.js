import React, { useState } from 'react';
import { ethers } from 'ethers';
import dchain from '../dchain.json';

// Update this address with the deployed Dchain contract address
const DCHAIN_ADDRESS = '0xDe83458eF3dCfeD8C5e02abc75d7927d9aA5213a';

function Payment() {
  const [shipmentId, setShipmentId] = useState('');
  const [amount, setAmount] = useState('');

  const [paymentType, setPaymentType] = useState('');
  const [status, setStatus] = useState('');

  const [transactions, setTransactions] = useState([]);

  const handlePayment = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');

      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const dchainContract = new ethers.Contract(DCHAIN_ADDRESS, dchain.abi, signer);


    try {
      const tx = await dchainContract.handlePayment(shipmentId, {
        value: ethers.utils.parseUnits(amount, 'ether')
      });
      await tx.wait();

      setStatus('Payment successful!');

      setTransactions([...transactions, {
        type: 'Payment',
        shipmentId,
        amount,
        recipient: await signer.getAddress(),
        time: new Date().toLocaleString(),
        status: 'successful'
      }]);

    } catch (error) {
      console.error(error);
      setStatus('Payment failed!');

      setTransactions([...transactions, {
        type: 'Payment',
        shipmentId,
        amount,

        recipient: await signer.getAddress(),
        time: new Date().toLocaleString(),
        status: 'failed'

      }]);

    }
  };

  const releasePayment = async () => {

    if (!window.ethereum) {
      alert('Please install MetaMask!');

      return;
    }


    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const dchainContract = new ethers.Contract(DCHAIN_ADDRESS, dchain.abi, signer);


    try {
      const tx = await dchainContract.releasePayment(shipmentId);

      await tx.wait();
      setStatus('Payment released successfully!');
      setTransactions([...transactions, {
        type: 'Release',

        shipmentId,
        recipient: await signer.getAddress(),
        time: new Date().toLocaleString(),
        status: 'successful'
      }]);
    } catch (error) {
      console.error(error);

      setStatus('Payment release failed!');
      setTransactions([...transactions, {
        type: 'Release',

        shipmentId,
        recipient: await signer.getAddress(),

        time: new Date().toLocaleString(),
        status: 'failed'

      }]);
    }

  };


  return (

    <div className="w-full p-6 rounded-lg bg-white">

      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Payment</h1>

      <div className="w-full mx-auto">

        <input
          type="text"

          placeholder="Shipment ID"

          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}

          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Amount"

          value={amount}

          onChange={(e) => setAmount(e.target.value)}

          className="w-full p-2 mb-4 border border-gray-300 rounded"

        />
        <select

          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        >
          <option value="">Select Payment Type</option>
          <option value="Preship">Prepaid</option>
          <option value="Postship">Postpaid</option>
          <option value="Escrowed">Escrowed</option>
        </select>
        <button

          onClick={releasePayment}
          className="w-full p-2 mb-4 bg-green-500 text-white rounded hover:bg-green-700"

        >

          Release Payment
        </button>
      </div>

      <p className={`text-center ${status.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>

        {status}
      </p>
      <h2 className="text-xl font-bold text-center text-gray-800 mt-6">Transaction History</h2>
      <div className="overflow-x-auto">

        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Shipment ID</th>
              <th className="py-2 px-4 border-b">Amount</th>

              <th className="py-2 px-4 border-b">Recipient</th>
              <th className="py-2 px-4 border-b">Time</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx, index) => (

              <tr key={index}>

                <td className="py-2 px-4 border-b">{tx.type}</td>

                <td className="py-2 px-4 border-b">{tx.shipmentId}</td>
                <td className="py-2 px-4 border-b">{tx.amount ? `${tx.amount} ETH` : 'N/A'}</td>

                <td className="py-2 px-4 border-b">{tx.recipient}</td>
                <td className="py-2 px-4 border-b">{tx.time}</td>
                <td className="py-2 px-4 border-b">{tx.status}</td>
              </tr>
            ))}

          </tbody>
        </table>

      </div>

    </div>

  );
}

export default Payment;