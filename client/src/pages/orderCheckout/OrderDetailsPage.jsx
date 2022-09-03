import React from "react";

const OrderDetailsPage = ({ order }) => {
  return (
    <div>
      <h1>{order.orderStatus}</h1>
    </div>
  );
};

export default OrderDetailsPage;
