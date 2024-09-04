import Web3 from "web3";
import dchain from "./dchain.json";
import mockUSDT from "./mockUSDT.json";

// contract addresses
const DCHAIN_CONTRACT_ADDRESS = "0xDe83458eF3dCfeD8C5e02abc75d7927d9aA5213a";
const MOCKUSDT_CONTRACT_ADDRESS = "0xE7c86A836560f49f07F00674fF3c834aac3584D2";

// contract ABIs
const DCHAIN_ABI = dchain;
const MOCKUSDT_ABI = mockUSDT;

let web3;
let dchainContract;
let mockUSDTContract;

const init = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        dchainContract = new web3.eth.Contract(DCHAIN_ABI, DCHAIN_CONTRACT_ADDRESS, { from: account });
        mockUSDTContract = new web3.eth.Contract(MOCKUSDT_ABI, MOCKUSDT_CONTRACT_ADDRESS, { from: account });

    } else {
        console.error("Please install MetaMask!");
    }
};
const createShipment = async (details) => {
    try {
        const tx = await dchainContract.methods.createShipment(details).send();
        console.log("Shipment created!", tx);
    } catch (error) {
        console.error("Error creating shipment:", error);
    }
};
const handlePayment = async (shipmentId, amount) => {
    try {
        const txApprove = await mockUSDTContract.methods.approve(DCHAIN_CONTRACT_ADDRESS, amount).send();
        console.log("Approval transaction:", txApprove);
        const tx = await dchainContract.methods.handlePayment(shipmentId).send();
        console.log("Payment handled!", tx);
    } catch (error) {
        console.error("Error handling payment:", error);
    }
};
const releasePayment = async (shipmentId) => {
    try {
        const tx = await dchainContract.methods.releasePayment(shipmentId).send();
        console.log("Payment released!", tx);
    } catch (error) {
        console.error("Error releasing payment:", error);
    }
};
const updateStatus = async (shipmentId, status) => {
    try {
        const tx = await dchainContract.methods.updateStatus(shipmentId, status).send();
        console.log("Status updated!", tx);
    } catch (error) {
        console.error("Error updating status:", error);
    }
};
export { init, createShipment, handlePayment, releasePayment, updateStatus, dchainContract, mockUSDTContract };