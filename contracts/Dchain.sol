// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./mockUSDT.sol";


contract Dchain {
    address public MOCKUSDT_ADDRESS;

    struct ShipmentDetails {
    ShipmentType shipmentType;
    string origin;
    string destination;
    address supplier;
    address transporter;
    address retailer;
    PaymentType paymentType;
    uint256 amount;
    bytes32 data;
}
    struct Shipment {
        uint256 id;
        uint256 paymentId;
        string origin;
        string destination;
        ShipmentStatus status;
        address supplier;
        address transporter;
        PaymentType paymentType;
        address retailer;
        uint256 amount;
        ShipmentType shipmentType;
        bytes32 data;
    }

    enum ShipmentStatus { Created, InTransit, Completed }
    enum PaymentType { Escrowed, Preship, Postship }
    enum PaymentStatus { Escrowed, Pending, Completed }
    enum ShipmentType { Public, Private }

    struct Payment {
        uint256 id;
        uint256 shipmentId;
        uint256 amount;
        PaymentStatus status;
    }



    // Mappings to store shipments and payments
    mapping(uint256 => Shipment) public shipments;
    mapping(uint256 => Payment) public payments;

    // Counters for Shipment and Payment IDs
    uint256 public shipmentCount = 0;
    uint256 public privateShipmentCount = 0;
    uint256 public paymentCount = 0;

    // Events
    event ShipmentCreated(uint256 id, ShipmentType shipmentType, string origin, string destination, address supplier, uint256 amount, uint256 timestamp);
    event StatusUpdated(uint256 shipmentId, uint256 paymentId, ShipmentType shipmentType, ShipmentStatus status, address updatedBy, uint256 timestamp);
    event PaymentMade(uint256 shipmentId, PaymentType paymentType, uint256 amount, address to, uint256 timestamp);
    event PaymentReleased(uint256 shipmentId, uint256 amount, address to, uint256 timpestamp);
    event Received(address sender, uint256 amount);
    event Fallback(address sender, uint256 amount);
    // Modifiers
    modifier isValidShipment(ShipmentType shipmentType, string memory _origin, string memory _destination, address _supplier,  address _transporter, address _retailer, bytes32 _data) {
        require(_transporter != address(0), "Transporter is required");
        require(_retailer != address(0), "Retailer is required");
        require(_supplier != address(0), "Supplier is required");
        if(shipmentType == ShipmentType.Public) {
            require(bytes(_origin).length > 0, "Origin is required");
            require(bytes(_destination).length > 0, "Destination is required");
        }else {
            require(_data != bytes32(0), "Data is required");
            require(bytes(_destination).length == 0, "Destination must be empty");
            require(bytes(_origin).length == 0 , "Origin must be empty");
        }
        _;
    }


    // Payment Functions

    function handlePayment(uint256 _shipmentId) external payable {
        Shipment storage shipment = shipments[_shipmentId];
        require(msg.value >= shipment.amount, "Incorrect payment amount"); // Ensure correct payment

        paymentCount++;

        if (shipment.paymentType == PaymentType.Preship) {
            payable(shipment.supplier).transfer(shipment.amount);
            payments[paymentCount]= Payment(paymentCount, shipment.id, shipment.amount, PaymentStatus.Completed);
        }
        if (shipment.paymentType == PaymentType.Postship) {
            payable(shipment.supplier).transfer(shipment.amount);
            payments[paymentCount]= Payment(paymentCount, shipment.id, shipment.amount, PaymentStatus.Completed);
        }
        if (shipment.paymentType == PaymentType.Escrowed) {
            payments[paymentCount]= Payment(paymentCount, shipment.id, shipment.amount, PaymentStatus.Escrowed);
        }
        shipment.paymentId = paymentCount;
        emit PaymentMade(_shipmentId, shipment.paymentType, shipment.amount, shipment.supplier, block.timestamp);
    }

    function releasePayment(uint256 _shipmentId) external {
        Shipment storage shipment = shipments[_shipmentId];
        Payment storage payment = payments[shipment.paymentId];
        require (shipment.paymentType == PaymentType.Escrowed, "Payment type is not escrowed");
        require(payment.status != PaymentStatus.Completed, "Payment already released");

        // Transfer funds to the supplier
        payable(shipment.supplier).transfer(shipment.amount);

        payment.status = PaymentStatus.Completed;
        
        emit PaymentReleased(_shipmentId, shipment.amount, shipment.retailer, block.timestamp);
    }

    // Public Shipment Functions
function createShipment(ShipmentDetails memory details) 
    isValidShipment(details.shipmentType, details.origin, details.destination, details.supplier, details.transporter, details.retailer, details.data) 
    public  
{
    shipmentCount++;
    
    shipments[shipmentCount] = Shipment(
        shipmentCount,
        0,
        details.origin,
        details.destination,
        ShipmentStatus.Created,
        msg.sender,
        details.transporter,
        details.paymentType,
        details.retailer,
        details.amount,
        details.shipmentType,
        details.data
    );

    emit ShipmentCreated(shipmentCount, details.shipmentType, details.origin, details.destination, msg.sender, details.amount, block.timestamp);
}

    function updateStatus(uint256 _shipmentId, ShipmentStatus _status) public {
        require(_shipmentId > 0 && _shipmentId <= shipmentCount, "Shipment does not exist");
        Shipment storage shipment = shipments[_shipmentId];
        Payment storage payment = payments[shipment.paymentId];

        require(msg.sender == shipment.supplier || msg.sender == shipment.transporter, "Not authorized");

        if (_status == ShipmentStatus.Completed){
            require(payment.status == PaymentStatus.Completed);
        }
        if (_status== ShipmentStatus.InTransit && shipment.paymentType == PaymentType.Escrowed){
            require(payment.status == PaymentStatus.Escrowed);
        }
        if (_status == ShipmentStatus.InTransit && shipment.paymentType == PaymentType.Preship){
            require(payment.status == PaymentStatus.Completed);
        }
        shipment.status = _status;
        emit StatusUpdated(_shipmentId, payment.id, shipment.shipmentType, _status, msg.sender, block.timestamp);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Fallback(msg.sender, msg.value);
    }

}
