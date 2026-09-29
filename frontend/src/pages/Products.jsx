import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch("https://dk-seed-store-backend.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-page">
      <h1>Our Seed Collection</h1>

      <input
        className="search-box"
        type="text"
        placeholder="Search Seeds..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Category Buttons */}
      <div className="filter-buttons">
        <button
          className="filter-btn"
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>

        <button
          className="filter-btn"
          onClick={() => setSelectedCategory("Grains")}
        >
          Grains
        </button>

        <button
          className="filter-btn"
          onClick={() => setSelectedCategory("Vegetables")}
        >
          Vegetables
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              className="product-card"
              key={product._id}
            >
              <img
                src={product.image}
                alt={product.name}
              />

              <div className="product-info">
                <h3>{product.name}</h3>

                <p>⭐ {product.rating}</p>

                {product.stock > 5 ? (
                  <p
                    style={{
                      color: "green",
                      fontWeight: "bold",
                    }}
                  >
                    ✅ In Stock
                  </p>
                ) : product.stock > 0 ? (
                  <p
                    style={{
                      color: "orange",
                      fontWeight: "bold",
                    }}
                  >
                    ⚠️ Only {product.stock} left in stock
                  </p>
                ) : (
                  <p
                    style={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    ❌ Out of Stock
                  </p>
                )}

                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  {product.discount}
                </p>

                <p>₹{product.price}</p>

                <Link to={`/product/${product._id}`}>
                  <button>View Details</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <h2>🌱 No seeds found</h2>
            <p>Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;