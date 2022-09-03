import React from "react";
import { Link } from "react-router-dom";

const MyOrdersPage = () => {
  return (
    <div>
      <h1>MyOrdersPage</h1>
      <Link to={"/order/abc"}>Go To ABC</Link>
    </div>
  );
};

export default MyOrdersPage;
