import React, { lazy, useEffect, useState } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCart, removeItem } from "./cartHelpers";
import { Link } from "react-router-dom";
import Checkout from "./Checkout";

//const Checkout = lazy(() => import("./Checkout"))

const Cart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
  }, [items]);

  const showItems = (items) => {
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr />
        {items.map((product, i) => (
          <Card
            key={i}
            product={product}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
          />
        ))}
      </div>
    );
  };

  const noItemsMessage = () => (
    <h2>
      Your cart is empty. <br />{" "}
      <Link to="/shop">
        <h4>Continue shopping</h4>
      </Link>
    </h2>
  );

  return (
    <Layout
      title="Shopping Cart"
      description="Manage your cart items. Add remove checkout or continue shopping"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-6">
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>

        <div className="col-6">
          <h3 className="mb-4">Your cart summary</h3>
          <hr/>
          <Checkout products={items} />
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
