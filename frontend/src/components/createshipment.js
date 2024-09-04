import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import dchain from '../dchain.json';

const CreateShipment = ({ setShipments, resolveEns }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [supplier, setSupplier] = useState('');
  const [transporter, setTransporter] = useState('');
  const [retailer, setRetailer] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = async (e, setInputValue) => {
    const value = e.target.value;
    setInputValue(value);
    await resolveEns(value, setInputValue); // Resolve ENS name and update input field
  };

  const createShipment = async () => {
    try {
      // Initialize ethers
      const provider = new Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const dchainAddress = '0xDe83458eF3dCfeD8C5e02abc75d7927d9aA5213a';
      const dchainContract = new ethers.Contract(dchainAddress, dchain.abi, signer);

      // Convert the amount to the appropriate format
      const amountInWei = ethers.utils.parseUnits(amount, 6); // 6 decimals for mUSDT

      // Resolve ENS names to addresses
      const resolvedSupplier = await resolveEns(supplier);
      const resolvedTransporter = await resolveEns(transporter);
      const resolvedRetailer = await resolveEns(retailer);

      // Define shipment details
      const shipmentDetails = {
        shipmentType: 0, // Public
        origin,
        destination,
        supplier: resolvedSupplier,
        transporter: resolvedTransporter,
        retailer: resolvedRetailer,
        paymentType: 0, // Escrowed
        amount: amountInWei,
        data: ethers.utils.hexZeroPad('0x0', 32), // Zero hash
      };

      console.log('Shipment Details:', shipmentDetails);

      // Call the createShipment function
      const tx = await dchainContract.createShipment(shipmentDetails);
      await tx.wait();

      setMessage('Shipment created successfully!');
      console.log('Transaction:', tx);

      // Add the new shipment to the list
      setShipments((prevShipments) => [...prevShipments, shipmentDetails]);
    } catch (error) {
      console.error('Error creating shipment:', error);
      setMessage('Error creating shipment');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Create Shipment</h2>
      <form onSubmit={(e) => { e.preventDefault(); createShipment(); }} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Origin:</label>
          <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Destination:</label>
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Supplier Address:</label>
          <input type="text" value={supplier} onChange={(e) => handleInputChange(e, setSupplier)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Transporter Address:</label>
          <input type="text" value={transporter} onChange={(e) => handleInputChange(e, setTransporter)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Retailer Address:</label>
          <input type="text" value={retailer} onChange={(e) => handleInputChange(e, setRetailer)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (mUSDT):</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <button type="submit" className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create Shipment</button>
      </form>
      {message && <p className="mt-6 text-sm text-gray-600 text-center">{message}</p>}
    </div>
  );
};

export default CreateShipment;