import React from 'react';
export default function Orders({ orders }) {
  return (
    <div>
      {orders.map((order, index) => (
        <div key={index} className="grid grid-cols-4">
          <p>{order._id}</p>
          <p>{order.orderItems.length}</p>
          <p>{order.isPaid}</p>
          <p>{order.isconfirmed}</p>
          <p>{order.isDelivered}</p>
          <p>{order.createdAt.substr(0, 10)}</p>
          <p>{order.totalPrice}</p>
        </div>
      ))}
    </div>
  );
}
