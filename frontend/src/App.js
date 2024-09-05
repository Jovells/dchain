import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import CreateShipment from './components/createshipment';
import { ethers } from 'ethers';
import Payment from './components/payment';
import Home from './components/home';
import Footer from './components/footer';
import Web3 from 'web3';
import { Chain, EnsPlugin } from '@namespace-ens/web3-plugin-ens';

const App = () => {
  const [shipments, setShipments] = useState([]);

  // Function to resolve ENS names to addresses
  const resolveEns = async (name) => {
    let address
    if (name.endsWith('.eth')) {
      const web3 = new Web3();
      const ensPlugin = new EnsPlugin(Chain.Mainnet);
      web3.registerPlugin(ensPlugin);
      address = await web3.ens.getAddress(name);
      console.log(address);

    }
    return address; 
  };

  // Function to resolve ENS names in shipments
  const resolveShipmentsEns = async (shipments) => {
    const resolvedShipments = await Promise.all(shipments.map(async (shipment) => {
      const resolvedShipment = { ...shipment };
      resolvedShipment.origin = await shipment.origin;
      resolvedShipment.destination = await shipment.destination;
      resolvedShipment.supplier = await resolveEns(shipment.supplier);
      resolvedShipment.transporter = await resolveEns(shipment.transporter);
      resolvedShipment.retailer = await resolveEns(shipment.retailer);
      return resolvedShipment;
    }));
    setShipments(resolvedShipments);
  };

  useEffect(() => {
    resolveShipmentsEns(shipments);
  }, [shipments]);

  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-6">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/shipment" element={
            <>
              <CreateShipment setShipments={setShipments} resolveEns={resolveEns} />
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
            </>
          } />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;