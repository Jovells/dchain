import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { Dchain, MockUSDT } from "../typechain-types";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("deployer:", deployer);
  const deployerBalance = await ethers.provider.getBalance(deployer);
  console.log('deployer Balance: ', deployerBalance)

  // Check if we're using a zkSync network
  const isZkSync = hre.network.config.zksync === true;

  // Get signers for different roles
  const [deployerSigner, supplier, retailer, transporter] = await hre.ethers.getSigners();

  // Function to check balance, send ETH if needed, and print balance if sufficient
  async function checkAndSendEth(address: string, role: string) {
    const currentChain = hre.network.name
    const amountToCheck = currentChain === 'rskTestnet' ? ethers.parseEther("0.001") : ethers.parseEther("0.003")
    const amountToSend = currentChain === 'rskTestnet' ? ethers.parseEther("0.001") : ethers.parseEther("0.003")
    const balance = await hre.ethers.provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);
    if (balance < amountToCheck) {
      console.log(`Sending ETH to ${role} (${address})`);
      await deployerSigner.sendTransaction({
        to: address,
        value: amountToSend,
      });
    } else {
      console.log(`${role} (${address}) has sufficient balance: ${balanceInEth} ETH`);
    }
  }

  // Function to deploy contracts
  async function deployContracts() {
    let mockUSDT, dchain;

    if (isZkSync) {
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
        args: [mockUSDT.target],
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

  // Function to mint mUSDT (MockUSDT) tokens to all parties
  async function mintTokens(mockUSDT: any) {
    const amount = ethers.parseUnits("1000", 6); // Minting 1000 mUSDT (assuming 6 decimals)
    const recipients = [supplier, retailer, transporter];

    for (const recipient of recipients) {
      console.log(`Minting ${ethers.formatUnits(amount, 6)} mUSDT to ${recipient.address}`);
      const mintTx = await mockUSDT.connect(recipient).mint();
      await mintTx.wait();
    }
  }

  // Function to create shipments
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
      data: ethers.ZeroHash,
    };
    const tx1 = await dchain.connect(supplier).createShipment(shipmentDetails);
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
      data: ethers.ZeroHash,
    };
    const txpre = await dchain.connect(supplier).createShipment(shipmentDetailsPre);
    await txpre.wait();

    console.log("Creating postpaid shipment");
    const shipmentDetailsPost = {
      shipmentType: 0, // Public
      origin: "Boston",
      destination: "Seattle",
      supplier: supplier.address,
      transporter: transporter.address,
      retailer: retailer.address,
      paymentType: 2, // Postpaid
      amount: 100,
      data: ethers.ZeroHash,
    };
    const txpost = await dchain.connect(supplier).createShipment(shipmentDetailsPost);
    await txpost.wait();

    console.log("Creating private shipment");
    const data = ethers.keccak256(
      ethers.toUtf8Bytes(
        `{
        origin: "Boston",
        destination: "Seattle",
      }`
      )
    );
    const privateShipmentDetails = {
      shipmentType: 1, // Private
      origin: "",
      destination: "",
      supplier: supplier.address,
      transporter: transporter.address,
      retailer: retailer.address,
      paymentType: 0, // Escrowed
      amount: 256,
      data,
    };
    const tx2 = await dchain.connect(supplier).createShipment(privateShipmentDetails);
    await tx2.wait();
  }

  // Function to handle payments for shipments
  async function payForSomeShipments(dchain: Dchain, musdc: MockUSDT) {
    console.log("Payment for shipment 1...");
    const txapprove = await musdc.connect(retailer).approve(dchain.target, 10000);
    await txapprove.wait();

    const txRelease = await dchain.connect(retailer).handlePayment(1);
    await txRelease.wait();
  }

  // Function to deliver shipments
  async function deliverSomeShipments(dchain: Dchain) {
    console.log("Delivering shipment 1...");
    const txDeliver = await dchain.connect(transporter).updateStatus(1, 1);
    await txDeliver.wait();

    console.log("Releasing payment for shipment 1...");
    const txRelease = await dchain.connect(retailer).releasePayment(1);
    await txRelease.wait();
  }

  //<------------------------------------ MAIN DEPLOYMENT LOGIC --------------------------------------->
  try {
    // Check and send ETH to supplier, retailer, and transporter
    await checkAndSendEth(supplier.address, "Supplier");
    await checkAndSendEth(retailer.address, "Retailer");
    await checkAndSendEth(transporter.address, "Transporter");


    //deploy contracts
    const { mockUSDT, dchain } = await deployContracts();
    if (!mockUSDT || !dchain) return;

    // Mint tokens to all parties
    await mintTokens(mockUSDT);

    // Create shipments, pay for some, and deliver some
    await createShipments(dchain);
    await payForSomeShipments(dchain, mockUSDT);
    await deliverSomeShipments(dchain);

    console.log(`3 public shipments and 1 private shipment created and processed.`);
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
};

export default deployYourContract;

deployYourContract.tags = ["Dchain"];
