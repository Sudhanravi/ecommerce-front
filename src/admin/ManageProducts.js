import React, { useEffect, useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "./ApiAdmin";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  const { user, token } = isAuthenticated();

  const loadProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  const destroy = (productId) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadProducts();
      }
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Layout
      title="Manage products"
      description="Perform CRUD on products"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-12">
          <h3 className="text-center">Total {products.length} products</h3>
          <hr />
          <ul className="list-group">
            {products.map((p, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <strong>{p.name}</strong>
                <div>
                    <Link to={`/admin/product/update/${p._id}`}>
                      <span className="badge badge-warning badge-pill ml-3">
                        Update
                      </span>
                    </Link>
                  <span
                    onClick={() => {
                      destroy(p._id);
                    }}
                    className="badge badge-danger badge-pill"
                    style={{cursor: "pointer"}}
                  >
                    Delete
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ManageProducts;
