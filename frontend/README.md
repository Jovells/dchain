
## **DChain: Supply Chain Management System built on blockchain technology**

### **1\. Problem Statement**

Traditional supply chain management faces several challenges:

- **Lack of Transparency:** Difficulty in tracking the movement and status of goods throughout the supply chain.
- **Inefficiency:** Manual processes and paperwork lead to delays and increased costs.
- **Fraud and Counterfeiting:** Difficulty in verifying the authenticity of products and detecting fraud.
- **Complex Coordination:** Difficulty in coordinating between multiple parties, including suppliers, manufacturers, and retailers.
- **Data Security:** Concerns over the security and integrity of data shared between supply chain participants.

### **2\. Solution**

DChain leverages blockchain technology to address these challenges by providing:

- **Enhanced Transparency:** Real-time tracking of goods and transactions across the entire supply chain.
- **Increased Efficiency:** Automation of processes and documentation through smart contracts.
- **Fraud Prevention:** Immutable records of transactions and product origins to prevent counterfeiting.
- **Improved Coordination:** Streamlined communication and data sharing between all supply chain participants.
- **Secure Data Management:** Encrypted and decentralized data storage to ensure data integrity and security.

### **3\. Features**

#### **Core Features:**

1. **Blockchain Integration:**
    - **Immutable Records:** All transactions and product movements are recorded on the blockchain, ensuring transparency and traceability.
    - **Decentralized Ledger:** Provides a single source of truth accessible to all authorised parties.
2. **Smart Contracts:**
    - **Automated Processes:** Smart contracts automate various supply chain processes, such as payments and order fulfilment.
    - **Condition-Based Triggers:** Payments and actions are triggered based on predefined conditions and milestones.
3. **Real-Time Tracking:**
    - **Product Tracking:** Real-time updates on the location and status of goods.
    - **Sensor Integration:** Integration with IoT sensors to monitor conditions such as temperature and humidity.
4. **Fraud Prevention:**
    - **Product Provenance:** Verifiable history of each product from origin to final destination.
5. **Data Security:**
    - **Encrypted Data:** Secure storage and transmission of sensitive data.
    - **Access Control:** Permission-based access to data and transaction records.
6. **User Management:**
    - **Role-Based Access:** Different levels of access and permissions for suppliers, manufacturers, retailers, and other stakeholders.
    - **Audit Trails:** Detailed logs of user actions and changes to the supply chain records.

#### **Additional Features:**

1. **Integration with Existing Systems:**
    - **ERP and SCM Integration:** Compatibility with existing enterprise resource planning (ERP) and supply chain management (SCM) systems.
2. **Advanced Analytics:**
    - **Data Insights:** Analytical tools for monitoring performance, identifying inefficiencies, and making data-driven decisions.
3. **Dispute Resolution:**
    - **Arbitration Mechanism:** Built-in dispute resolution mechanisms to handle conflicts and ensure fair outcomes.

### **4\. Purpose**

The purpose of this document is to outline the functional and non-functional requirements for the Dchain Supply Chain Management System. This blockchain-based system aims to improve transparency, efficiency, and security in managing shipments and payments within the supply chain.

**4.1 Scope**

The Dchain system is designed to handle shipment tracking and payment management using a blockchain smart contract. It supports both public and private shipments and utilises the MockUSDT ERC20 token for payments. The system is intended for use by suppliers, transporters, and retailers.

**4.2 Definitions & Acronyms**

- Dchain: The name of the blockchain-based supply chain management system.
- MockUSDT: A mock ERC20 token used for transactions within the system.
- Shipment: Represents a delivery of goods from supplier to retailer.
- Payment: Financial transaction related to a shipment.

### **5\. System Overview**

The Dchain system operates on the Ethereum blockchain, utilizing smart contracts to manage and verify supply chain transactions. The system provides a decentralized approach to handle shipments and payments, ensuring that all transactions are transparent and immutable.

**5.1 System Architecture**

- Smart Contract: The core component of the system, written in Solidity, which includes the logic for managing shipments, payments, and status updates.
- MockUSDT Token: An ERC20 token contract used for payment transactions.
- Blockchain Network: Rootstock network, where the Dchain smart contract and MockUSDT token are deployed.

### **6\. Functional Requirements**

**6.1 Shipment Management**

**6.1.0 Create Shipment**

- Description: Allows the creation of a new shipment with details such as origin, destination, and payment type.
- Inputs: ShipmentDetails struct (shipmentType, origin, destination, supplier, transporter, retailer, paymentType, amount, data).
- Outputs: Shipment created event with shipment ID and details.

**6.1.2 Update Shipment Status**

- Description: Updates the status of an existing shipment (Created, InTransit, Completed).
- Inputs: shipmentId, status.
- Outputs: Status updated event with shipment ID, status, and timestamp.

**6.2 Payment Management**

**6.2.1 Handle Payment**

- Description: Processes payment based on the shipment ID and payment type.
- Inputs: shipmentId.
- Outputs: Payment made event with payment ID, shipment ID, amount, and timestamp.

**6.2.2 Release Payment**

- Description: Releases escrowed payment to the supplier upon completion of the shipment.
- Inputs: shipmentId
- Outputs: Payment released event with shipment ID, amount, and timestamp.

### **7\. Non-Functional Requirements**

**7.1 Security**

- Authorization: Ensure only authorized parties (supplier, transporter) can update shipment statuses.
- Payment Validation: Validate payments to prevent fraudulent transactions.
- Contract Audits: Perform regular security audits of the smart contract code.

**7.2 Usability**

- Interface: Provide a user-friendly interface for interacting with the smart contract.
- Documentation: Comprehensive documentation for developers and users.

**7.3 Reliability**

- Fault Tolerance: Ensure the system operates correctly in the event of minor failures or network issues.
- Data Integrity: Guarantee that all data related to shipments and payments is accurately recorded on the blockchain.
- Transaction Speed: The contract should process transactions within the typical block time of the Ethereum network (approx. 15 seconds).

### **8\. Uses Cases**

**8.1 Creating a Shipment**

- User: Supplier
- Description: The supplier creates a shipment.
- Postconditions: Payment is processed, and an event is emitted.

**8.1 Creating a Shipment**

- User: Retailer
- Description: The retailer makes a payment for a shipment.
- Preconditions: The retailer must have sufficient MockUSDT balance.
- Postconditions: Payment is processed, and an event is emitted.

**8.2 Releasing an Escrowed Payment**

- User: Contract (triggered by supplier or transporter)
- Description: Releases escrowed payment to the supplier after shipment completion.
- Preconditions: The shipment status must be marked as Completed
- Postconditions: Payment is released, and an event is emitted.

### **9\. Deployment**

- Deploy the Dchain smart contract using the MockUSDT contract address.
- Ensure successful deployment and interaction with the MockUSDT contract.

**9.1 Post-Deployment**

- Monitor contract performance and security.
- Provide support and updates as needed.

### **10\. Risk Mitigations**

- Conduct thorough code audits and testing.
- Perform integration testing with the MockUSDT contract and user interfaces.
- Ensure compliance with relevant regulations and legal requirements.

### **11\. Conclusion**

The Dchain Supply Chain Management System is a robust blockchain-based solution designed to streamline and secure supply chain processes. By leveraging smart contracts and the ERC20 token standard, our system aims to provide a transparent, efficient, and secure platform for managing shipments and payments.



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


