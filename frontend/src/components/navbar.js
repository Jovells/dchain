import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Link } from "react-router-dom"; 

const Navbar = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.error("No Ethereum browser extension detected");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
      });
    }
  }, []);

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      <div className="text-white text-2xl ml-36 font-bold">DCHAIN</div>
      <div className="flex space-x-10 cursor-pointer text-white hover:text-gray-200 text-lg ml-[-100px]">
        <Link to="/payment" className="text-white hover:text-gray-200">Payment</Link>
        <Link to="/shipment" className="text-white hover:text-gray-200">Shipment</Link>
      </div>
      <div className="flex space-x-4 mr-36">
        <button
          onClick={connectWallet}
          className="bg-white text-blue-500 p-2 rounded hover:bg-gray-200"
        >
          {account ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;