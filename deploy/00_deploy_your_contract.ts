import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { Dchain } from "../typechain-types";
// import deployToSkSync from "./deploy_zksync";
// import { Wallet } from "zksync-web3";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("deployer:", deployer);

  // Check if we're using a zkSync network
  const isZkSync = hre.network.config.zksync === true;

  // Get signers for different roles
  const [deployerSigner, supplier , retailer, transporter] = await hre.ethers.getSigners();

  // Function to check balance, send ETH if needed, and print balance if sufficient
  async function checkAndSendEth(address: string, role: string) {
    const balance = await hre.ethers.provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);
    if (balance < ethers.parseEther("0.004")) {
      console.log(`Sending ETH to ${role} (${address})`);
      await deployerSigner.sendTransaction({
        to: address,
        value: ethers.parseEther("0.003"),
      });
    } else {
      console.log(`${role} (${address}) has sufficient balance: ${balanceInEth} ETH`);
    }
  }

  // Function to deploy contracts
  async function deployContracts() {
    let mockUSDT, dchain;
 
    if (isZkSync) {
      // let dchainAddress = await deployToSkSync();
      // if (!dchainAddress) {
      //   throw new Error("failed");
      // }
      // dchain = await ethers.getContractAt("Dchain", dchainAddress);
      console.log("zkSync deployment not supported yet.");
    } else {
      // Regular deployment
      console.log("Deploying MockUSDT...");
      const mockUSDTDeployment = await deploy("MockUSDT", {
        from: deployer,
        args: [],
        log: true,
        autoMine: true,
      });

      if (!mockUSDTDeployment.address) {
        throw new Error("MockUSDT contract deployment failed, address is undefined.");
      }

      console.log(`MockUSDT deployed to ${mockUSDTDeployment.address}`);
      mockUSDT = await ethers.getContractAt("MockUSDT", mockUSDTDeployment.address);

      console.log("Deploying Dchain...");
      const dchainDeployment = await deploy("Dchain", {
        from: deployer,
        args: [],
        log: true,
        autoMine: true,
      });

      if (!dchainDeployment.address) {
        throw new Error("Dchain contract deployment failed, address is undefined.");
      }

      console.log(`Dchain deployed to ${dchainDeployment.address}`);
      dchain = await ethers.getContractAt("Dchain", dchainDeployment.address);
    }

    return { mockUSDT, dchain };
  }

  // Function to create planets
  async function createShipments(dchain: Dchain) {
    console.log("Creating shipment 1 Pearson Consultants...");
    const shipmentDetails = {
      shipmentType: 0, // Public
      origin: "Boston",
      destination: "Seattle",
      supplier: supplier.address,
      transporter: transporter.address,
      retailer: retailer.address,
      paymentType: 0, // Escrowed
      amount: 100,
      data: ethers.ZeroHash
  };
    const tx1 = await dchain.connect(supplier).createShipment(
      shipmentDetails
    );
    await tx1.wait();

    console.log("Creating prepaid shipment");
    const shipmentDetailsPre = {
      shipmentType: 0, // Public
      origin: "Boston",
      destination: "Seattle",
      supplier: supplier.address,
      transporter: transporter.address,
      retailer: retailer.address,
      paymentType: 1, // Prepaid
      amount: 100,
      data: ethers.ZeroHash
  };
    const txpre = await dchain.connect(supplier).createShipment(
      shipmentDetailsPre
    );
    await txpre.wait();

    console.log("Creating postpaid shipment");
    const shipmentDetailsPost = {
      shipmentType: 0, // Public
      origin: "Boston",
      destination: "Seattle",
      supplier: supplier.address,
      transporter: transporter.address,
      retailer: retailer.address,
      paymentType: 2, // Prepaid
      amount: 100,
      data: ethers.ZeroHash
  };
    const txpost = await dchain.connect(supplier).createShipment(
      shipmentDetailsPost
    );
    await txpre.wait();

    console.log("Creating private shipment");
    const data = ethers.keccak256(ethers.toUtf8Bytes(
      `{
        origin: "Boston",
        destination: "Seattle",
      }`
    ));
    const privateShipmentDetails = {
      shipmentType: 1, // Private
      origin: "",
      destination: "",
      supplier: supplier.address,
      transporter: transporter.address,
      retailer: retailer.address,
      paymentType: 0, // Escrowed
      amount: 256,
      data
  };
    const tx2 = await dchain.connect(supplier).createShipment(privateShipmentDetails);
    await tx2.wait();
  }

  // Function to request and approve sellers
  async function payforSomeShipments(dchain: Dchain) {
    console.log(" payment for shipment 1...");
    const txRelease = await dchain.connect(retailer).handlePayment(1, { value: 300 });
    await txRelease.wait();
  }

  // Function to add products to planets
  async function deliverSomeShipments(dchain: Dchain) {
    console.log("delivering payment1")
      const txdeliever = await dchain.connect(transporter).updateStatus(1, 1);
      await txdeliever.wait();

      console.log('releasing payment for shipment 1');
      const txRelease = await dchain.connect(retailer).releasePayment(1);
      await txRelease.wait();
  }

  // Main deployment logic
  try {
    // Check and send ETH to ruler1, ruler2, seller1, and seller2
    await checkAndSendEth(supplier.address, "Ruler 1");
    await checkAndSendEth(retailer.address, "Ruler 2");
    await checkAndSendEth(transporter.address, "Seller 1");

    const { dchain } = await deployContracts();
    if (!dchain) return;

    await createShipments(dchain);
    await payforSomeShipments(dchain);
    await deliverSomeShipments(dchain);

    console.log(`3 public products and 1 private product created`);
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
};

export default deployYourContract;

deployYourContract.tags = ["Dchain"];