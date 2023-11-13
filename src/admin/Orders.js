import React, { useEffect, useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { listOrders, getStatusValues, updateOrderStatus } from "./ApiAdmin";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10); // Set the number of orders to display per page

  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  };

  const loadStatusValues = () => {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return (
        <h3 className="text-danger display-3">Total orders {orders.length}</h3>
      );
    } else {
      return <h3 className="text-danger">No orders</h3>;
    }
  };

  const showInput = (key, value) => (
    <div className="input-group mb-2 mr-sm-2">
      <div className="input-group-prepend">
        <div className="input-group-text">{key}</div>
      </div>
      <input type="text" value={value} className="form-control" readOnly />
    </div>
  );

  const handleStatusChange = (e, orderId) => {
    updateOrderStatus(user._id, token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadOrders();
      }
    });
  };

  const showStatus = (o) => (
    <div className="form-group">
      <h3 className="mark mb-4">Status: {o.status}</h3>
      <select
        className="form-control"
        onChange={(e) => handleStatusChange(e, o._id)}
      >
        <option>Update status</option>
        {statusValues &&
          statusValues.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
      </select>
    </div>
  );

  return (
    <Layout
      title="Orders"
      description={`Hey ${user.name}!, you can manage all the orders here`}
    >
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {showOrdersLength()}

          {currentOrders.map((o, oIndex) => {
            return (
              <div
                className="mt-5"
                key={oIndex}
                style={{ borderBottom: "4px solid black" }}
              >
                <h4 className="mb-5">
                  <span className="bg-primary" style={{ color: "white" }}>
                    Order ID: {o._id}
                  </span>
                </h4>

                <ul className="list-group mb-2">
                  <li className="list-group-item">{showStatus(o)}</li>
                  <li className="list-group-item">
                    <b>Transaction ID:</b> {o.transaction_id}
                  </li>
                  <li className="list-group-item">
                    <b>Amount:</b> ${o.amount}
                  </li>
                  <li className="list-group-item">
                    <b>Ordered By:</b> {o.user.name}
                  </li>
                  <li className="list-group-item">
                    <b>Ordered on:</b> {moment(o.createdAt).fromNow()}
                  </li>
                  <li className="list-group-item">
                    <b>Delivery address:</b> {o.address}
                  </li>
                </ul>

                <h4 className="mt-4 mb-4 font-italic">
                  Total products in the order: {o.products.length}
                </h4>

                {o.products.map((p, pIndex) => (
                  <div
                    className="mb-4"
                    key={pIndex}
                    style={{ padding: "20px", border: "1px solid black" }}
                  >
                    {showInput("Product name", p.name)}
                    {showInput("Product price", p.price)}
                    {showInput("Product total", p.count)}
                    {showInput("Product id", p._id)}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Pagination */}
          <nav>
            <ul className="pagination">
              <li class="page-item">
                <a
                  onClick={() => paginate(currentPage - 1)}
                  class="page-link"
                  href="#"
                >
                  Previous
                </a>
              </li>
              {Array.from({
                length: Math.ceil(orders.length / ordersPerPage),
              }).map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <a
                    onClick={() => paginate(index + 1)}
                    className="page-link"
                    href="#"
                  >
                    {index + 1}
                  </a>
                </li>
              ))}
              <li class="page-item">
                <a
                  onClick={() => paginate(currentPage + 1)}
                  class="page-link"
                  href="#"
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
