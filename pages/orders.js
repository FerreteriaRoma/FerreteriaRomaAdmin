import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/orders')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    }, []);

    return (
        <Layout>
            <h1>Pedidos</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Fecha de creacion</th>
                        <th>Datos del cliente</th>
                        <th>Productos</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <tr key={order._id}>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <text>Nombre: {order.name}</text><br />
                                    <text>Email: {order.email}</text><br /> 
                                    <text>Numero telefonico: {order.phone}</text><br />
                                    <text>Ciudad: {order.city}</text><br />
                                    <text>Direccion: {order.StreetAddress}</text><br />
                                    <text>Precio total: $ {order.total_amount}</text>
                                </td>
                                <td>
                                    {order.line_items.map((l, index) => (
                                        <div key={index}>
                                            {l.price_data.product_data.name} X {l.quantity}
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No hay pedidos</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Layout>
    );
}
