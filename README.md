

# **DChain: Supply Chain Management System built on Blockchain Technology**

## **Overview**

DChain is a blockchain-based supply chain management system designed to tackle common industry challenges such as transparency, fraud prevention, efficiency, and secure data management. It leverages blockchain technology, smart contracts, and decentralized ledgers to automate and secure various supply chain processes, ensuring all transactions are transparent, immutable, and efficient.

### **Key Features:**

- **Blockchain Integration**: Immutable records and decentralized ledger for transparent tracking.
- **Smart Contracts**: Automate processes such as payments, shipment updates, and dispute resolution.
- **ENS Resolution**: Uses Ethereum Name Service (ENS) for seamless communication between users and smart contracts.
- **Real-Time Tracking**: Continuous updates on product location and condition via IoT sensors.
- **Privacy Mode**: Sensitive information is hashed and securely transmitted to the blockchain.
- **Data Security**: Secure storage and transmission of sensitive data, along with role-based access and audit trails.
- **Deployed on Lisk Sepolia Testnet**: Smart contracts are deployed on the Lisk Sepolia network, ensuring seamless interaction with Ethereum-based tools and offering a scalable environment.

---

## **Problem Statement**

Traditional supply chains face various issues such as lack of transparency, inefficiencies, fraud, and data security concerns. DChain solves these challenges by leveraging blockchain technology to create a more efficient and transparent supply chain system.

---

## **Solution**

DChain provides a decentralized solution by automating and securing the entire supply chain process using blockchain technology. The integration of ENS for wallet resolution and privacy mode ensures secure and transparent transactions.

### **Core Benefits:**

- **Transparency**: All participants have access to a single source of truth, with immutable transaction records.
- **Automation**: Smart contracts handle payments, shipment status updates, and escrow management.
- **Fraud Prevention**: All data is stored immutably on the blockchain, making it difficult to falsify records.
- **Privacy Mode**: Sensitive data is hashed before being recorded on the blockchain.
- **Improved Coordination**: Automated coordination between suppliers, manufacturers, transporters, and retailers.

---

## **Getting Started with DChain**

This project is built using the Create React App and includes integration with Ethereum smart contracts. Follow these steps to get started with DChain.

---

## **Installation**

### **Prerequisites**

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14.x or higher)
- [npm](https://www.npmjs.com/get-npm) (v6.x or higher)

### **Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/DChain.git
   cd DChain
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

This will launch the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## **Available Scripts**

### **`npm start`**

Runs the app in development mode and opens [http://localhost:3000](http://localhost:3000) in your browser.

### **`npm test`**

Launches the test runner in interactive watch mode. See more details on [running tests](https://facebook.github.io/create-react-app/docs/running-tests).

### **`npm run build`**

Builds the app for production in the `build` folder. It bundles React in production mode and optimizes the build for the best performance.

### **`npm run eject`**

If you need full control over your configuration, you can run `npm run eject` to move the configuration files into your project.

---

## **DChain Smart Contracts**

DChain operates on the Ethereum blockchain using smart contracts written in Solidity. Key components include:

- **Shipment Management**: Handles the creation, updating, and tracking of shipments.
- **Payment Management**: Manages payments using the MockUSDT ERC20 token, with support for escrowed payments.
- **Status Updates**: Updates shipment statuses (Created, InTransit, Completed) and triggers payment releases based on shipment completion.

The DChain smart contract has been deployed on the Lisk Sepolia testnet for testing purposes.

### **Key Functionalities of the Smart Contracts:**

- **Create Shipment**: Users (suppliers) can create a shipment with details such as origin, destination, transporter, retailer, and payment type.
- **Update Shipment Status**: Allows authorized users to update the status of shipments at various stages (Created, InTransit, Completed).
- **Handle Payments**: Process payments via the MockUSDT token and trigger escrowed payments upon shipment completion.

### **Interaction with ENS**

ENS resolution is integrated into the DChain system. When a user provides their ENS domain, the system automatically resolves it to the corresponding wallet address, allowing for seamless interactions with smart contracts.

---

## **Deployment**

To deploy the DChain system:

1. Compile and deploy the DChain smart contract using the MockUSDT token contract on the Lisk Sepolia testnet.
2. Verify the contract addresses and integration with ENS resolution.
3. Ensure all smart contract functionalities work as expected by testing with various user roles (supplier, transporter, retailer).

---

## **Post-Deployment**

After deployment, the following steps are recommended:

- **Monitor Contract Performance**: Use blockchain explorers and analytics tools to monitor contract performance and transaction throughput.
- **Security Audits**: Regularly audit smart contracts for security vulnerabilities.
- **System Updates**: Provide regular updates and improvements based on user feedback and security reviews.

---

## **Risk Mitigations**

- Conduct thorough code audits to ensure security.
- Test all smart contract functionalities on the testnet before the mainnet deployment.
- Regularly monitor the contract to ensure compliance with security best practices and relevant regulations.

---

## **Learn More**

For more information about DChain and how to use it, visit:

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)

-
