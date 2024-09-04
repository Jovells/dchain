import React, { useState } from 'react';
import Navbar from './components/navbar';
import CreateShipment from './components/createshipment'; // Updated import statement
import { ethers } from 'ethers'; // Add this import statement
import { Chain, EnsPlugin } from '@namespace-ens/web3-plugin-ens'; // Add ENS plugin import

const App = () => {
  const [shipments, setShipments] = useState([]);

  // Function to resolve ENS names to addresses
  const resolveEns = async (name) => {
    if (name.endsWith('.eth')) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const ensPlugin = new EnsPlugin(provider);
      return await ensPlugin.resolveName(name);
    }
    return name;
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <CreateShipment setShipments={setShipments} resolveEns={resolveEns} /> {/* Pass resolveEns function */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Created Shipments</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Origin</th>
                <th className="py-2 px-4 border-b">Destination</th>
                <th className="py-2 px-4 border-b">Supplier</th>
                <th className="py-2 px-4 border-b">Transporter</th>
                <th className="py-2 px-4 border-b">Retailer</th>
                <th className="py-2 px-4 border-b">Amount (mUSDT)</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{shipment.origin}</td>
                  <td className="py-2 px-4 border-b">{shipment.destination}</td>
                  <td className="py-2 px-4 border-b">{shipment.supplier}</td>
                  <td className="py-2 px-4 border-b">{shipment.transporter}</td>
                  <td className="py-2 px-4 border-b">{shipment.retailer}</td>
                  <td className="py-2 px-4 border-b">{ethers.utils.formatUnits(shipment.amount, 6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;