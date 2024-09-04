import { expect } from "chai";
import { ethers } from "hardhat";
import { Dchain, MockUSDT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Dchain", function () {
    let dchain: Dchain;
    let mockUSDT: MockUSDT;
    let owner: HardhatEthersSigner, supplier: HardhatEthersSigner, retailer: HardhatEthersSigner, transporter: HardhatEthersSigner, otherAccount: HardhatEthersSigner;

    before(async function () {
        [owner, supplier, retailer, transporter, otherAccount] = await ethers.getSigners();

        // Deploy MockUSDT contract
        const MockUSDTFactory = await ethers.getContractFactory("MockUSDT");
        mockUSDT = await MockUSDTFactory.deploy() as MockUSDT;

        // Deploy Dchain contract with MockUSDT address
        const DchainFactory = await ethers.getContractFactory("Dchain");
        dchain = await DchainFactory.deploy(mockUSDT.target) as Dchain;

        // Allocate some MockUSDT to the supplier and retailer for testing
        await mockUSDT.connect(supplier).mint();
        await mockUSDT.connect(retailer).mint();

    });

    describe("Dchain", function () {
        it("should create a new public shipment", async function () {
            const shipmentDetails = {
                shipmentType: 0, // Public
                origin: "New York",
                destination: "Los Angeles",
                supplier: supplier.address,
                transporter: transporter.address,
                retailer: retailer.address,
                paymentType: 1, // Preship
                amount: 10 * 10 ** 6,
                data: ethers.ZeroHash
            };

            await dchain.connect(supplier).createShipment(shipmentDetails);

            const shipment = await dchain.shipments(1);

            expect(shipment.origin).to.equal("New York");
            expect(shipment.destination).to.equal("Los Angeles");
            expect(shipment.status).to.equal(0); // Created
            expect(shipment.supplier).to.equal(supplier.address);
            expect(shipment.transporter).to.equal(transporter.address);
            expect(shipment.retailer).to.equal(retailer.address);
        });

        it("should create a new private shipment", async function () {
            const shipmentDetails = {
                shipmentType: 1, // Private
                origin: "",
                destination: "",
                supplier: supplier.address,
                transporter: transporter.address,
                retailer: retailer.address,
                paymentType: 1, // Preship
                amount: 10 * 10 ** 6,
                data: ethers.encodeBytes32String("Sensitive Data")
            };

            await dchain.connect(supplier).createShipment(shipmentDetails);

            const shipment = await dchain.shipments(2);

            expect(shipment.data).to.equal(ethers.encodeBytes32String("Sensitive Data"));
            expect(shipment.status).to.equal(0); // Created
            expect(shipment.supplier).to.equal(supplier.address);
            expect(shipment.transporter).to.equal(transporter.address);
            expect(shipment.retailer).to.equal(retailer.address);
        });

        it("should emit ShipmentCreated event for public shipment", async function () {
            const shipmentDetails = {
                shipmentType: 0, // Public
                origin: "Chicago",
                destination: "Houston",
                supplier: supplier.address,
                transporter: transporter.address,
                retailer: retailer.address,
                paymentType: 1, // Preship
                amount: 10 * 10 ** 6,
                data: ethers.ZeroHash
            };

            await expect(dchain.connect(supplier).createShipment(shipmentDetails))
                .to.emit(dchain, "ShipmentCreated");
        });

        it("should update the status of a shipment", async function () {
            // Supplier approves Dchain contract to spend their MockUSDT
            await mockUSDT.connect(retailer).approve(dchain.target, 1000 * 10 ** 6);

            await dchain.connect(retailer).handlePayment(1);

            await dchain.connect(supplier).updateStatus(1, 1); // InTransit

            const shipment = await dchain.shipments(1);
            expect(shipment.status).to.equal(1n); // InTransit
        });

        it("should allow transporter to update shipment status", async function () {
            await dchain.connect(transporter).updateStatus(1, 1); // InTransit
            const shipment = await dchain.shipments(1);
            expect(shipment.status).to.equal(1); // InTransit
        });

        it("should emit StatusUpdated event", async function () {
            await expect(dchain.connect(supplier).updateStatus(1, 2)) // Completed
                .to.emit(dchain, "StatusUpdated");
        });

        it("should not allow unauthorized users to update shipment status", async function () {
            await expect(dchain.connect(otherAccount).updateStatus(1, 1)) // InTransit
                .to.be.revertedWith("Not authorized");
        });

        it("should handle payment correctly for preship", async function () {
            const shipmentDetails = {
                shipmentType: 0, // Public
                origin: "San Francisco",
                destination: "Las Vegas",
                supplier: supplier.address,
                transporter: transporter.address,
                retailer: retailer.address,
                paymentType: 1, // Preship
                amount: 10 * 10 ** 6,
                data: ethers.ZeroHash
            };

            await dchain.connect(supplier).createShipment(shipmentDetails);

            // Supplier approves Dchain contract to spend their MockUSDT
            await mockUSDT.connect(retailer).approve(dchain.target, 1000 * 10 ** 6);
            
            await dchain.connect(retailer).handlePayment(3);

            const payment = await dchain.payments(2);
            expect(payment.amount).to.equal(shipmentDetails.amount);
            expect(payment.status).to.equal(2); // Completed
        });

        it("should release payment correctly for escrowed payment", async function () {
            const shipmentDetails = {
                shipmentType: 0, // Public
                origin: "Boston",
                destination: "Seattle",
                supplier: supplier.address,
                transporter: transporter.address,
                retailer: retailer.address,
                paymentType: 0, // Escrowed
                amount: 10 * 10 ** 6,
                data: ethers.ZeroHash
            };
            console.log("shipment before", (await dchain.shipments(5)).origin);
            await dchain.connect(supplier).createShipment(shipmentDetails);
            console.log("shipment after", (await dchain.shipments(5)).paymentType);


            // Retailer approves Dchain contract to spend their MockUSDT
            await mockUSDT.connect(retailer).approve(dchain.target, 1000 * 10 ** 6);

            await dchain.connect(retailer).handlePayment(5);
            await dchain.connect(supplier).releasePayment(5);

            const payment = await dchain.payments(3);
            expect(payment.status).to.equal(2); // Completed
        });

        it("should fail to create a shipment without valid addresses", async function () {
            const shipmentDetails1 = {
                shipmentType: 0, // Public
                origin: "New York",
                destination: "Los Angeles",
                supplier: supplier.address,
                transporter: ethers.ZeroAddress,
                retailer: retailer.address,
                paymentType: 1, // Preship
                amount: 10 * 10 ** 6,
                data: ethers.ZeroHash
            };

            const shipmentDetails2 = {
                shipmentType: 0, // Public
                origin: "New York",
                destination: "Los Angeles",
                supplier: supplier.address,
                transporter: transporter.address,
                retailer: ethers.ZeroAddress,
                paymentType: 1, // Preship
                amount: 10 * 10 ** 6,
                data: ethers.ZeroHash
            };

            await expect(dchain.connect(supplier).createShipment(shipmentDetails1))
                .to.be.revertedWith("Transporter is required");

            await expect(dchain.connect(supplier).createShipment(shipmentDetails2))
                .to.be.revertedWith("Retailer is required");
        });
    });
});
