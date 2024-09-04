import React, { useEffect, useState } from "react";
import { init, getShipments } from "../contractInteraction"; // assuming you name the file dchainInteractions.js

const ShipmentList = () => {
    const [shipments, setShipments] = useState([]);

    useEffect(() => {
        const fetchShipments = async () => {
            await init();
            const fetchedShipments = await getShipments();
            setShipments(fetchedShipments);
        };

        fetchShipments();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Shipments</h2>
            {shipments.length === 0 ? (
                <p className="text-gray-500">No shipments available</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b">Shipment ID</th>
                                <th className="py-2 px-4 border-b">Origin</th>
                                <th className="py-2 px-4 border-b">Destination</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Supplier</th>
                                <th className="py-2 px-4 border-b">Transporter</th>
                                <th className="py-2 px-4 border-b">Retailer</th>
                                <th className="py-2 px-4 border-b">Amount (USDT)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.map((shipment, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{shipment.id}</td>
                                    <td className="py-2 px-4 border-b">{shipment.origin}</td>
                                    <td className="py-2 px-4 border-b">{shipment.destination}</td>
                                    <td className="py-2 px-4 border-b">{shipment.status}</td>
                                    <td className="py-2 px-4 border-b">{shipment.supplier}</td>
                                    <td className="py-2 px-4 border-b">{shipment.transporter}</td>
                                    <td className="py-2 px-4 border-b">{shipment.retailer}</td>
                                    <td className="py-2 px-4 border-b">{web3.utils.fromWei(shipment.amount, 'ether')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ShipmentList;