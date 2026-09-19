import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Admin() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [rating, setRating] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");

  const [editingId, setEditingId] = useState(null);

  // =====================================================
  // FETCH ALL PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/products`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          data.message || "Unable to fetch products"
        );
        return;
      }

      setProducts(data);
    } catch (error) {
      console.error(
        "Fetch products error:",
        error
      );
    }
  };

  // =====================================================
  // UPLOAD IMAGE TO CLOUDINARY
  // =====================================================

  const uploadImage = async () => {
    if (!imageFile) {
      return image;
    }

    const formData = new FormData();

    formData.append("file", imageFile);

    formData.append(
      "upload_preset",
      "dk_seed_store"
    );

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dsbgtqmst/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          data.error?.message ||
            "Image upload failed"
        );

        return "";
      }

      return data.secure_url;
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      return "";
    }
  };

  // =====================================================
  // ADD PRODUCT
  // =====================================================

  const handleSubmit = async () => {
    if (!name || !price || !category || !stock) {
      alert(
        "Please fill all required product fields"
      );
      return;
    }

    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    const imageUrl = await uploadImage();

    if (!imageUrl) {
      alert("Image upload failed");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/products`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            price: Number(price),
            category,
            image: imageUrl,
            rating: Number(rating),
            discount,
            stock: Number(stock),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to add product"
        );
        return;
      }

      alert(
        "Product Added Successfully ✅"
      );

      await fetchProducts();

      // Clear form
      setName("");
      setPrice("");
      setCategory("");
      setImage("");
      setRating("");
      setDiscount("");
      setStock("");
      setImageFile(null);
    } catch (error) {
      console.error(
        "Add product error:",
        error
      );

      alert(
        "Something went wrong while adding the product"
      );
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to delete product"
        );
        return;
      }

      alert("Product Deleted ✅");

      await fetchProducts();
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        "Something went wrong while deleting the product"
      );
    }
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const updateProduct = async () => {
    if (!editingId) {
      return;
    }

    const imageUrl = imageFile
      ? await uploadImage()
      : image;

    if (!imageUrl) {
      alert("Please provide a product image");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/products/${editingId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            price: Number(price),
            category,
            image: imageUrl,
            rating: Number(rating),
            discount,
            stock: Number(stock),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to update product"
        );
        return;
      }

      alert(
        "Product Updated Successfully ✅"
      );

      setEditingId(null);

      // Clear form
      setName("");
      setPrice("");
      setCategory("");
      setImage("");
      setRating("");
      setDiscount("");
      setStock("");
      setImageFile(null);

      await fetchProducts();
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      alert(
        "Something went wrong while updating the product"
      );
    }
  };

  // =====================================================
  // FETCH PRODUCTS WHEN PAGE LOADS
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "30px",
        background: "white",
        borderRadius: "10px",
        boxShadow:
          "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>
        {editingId
          ? "Update Product"
          : "Add Product"}
      </h2>

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImageFile(
            e.target.files[0]
          )
        }
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Rating"
        value={rating}
        onChange={(e) =>
          setRating(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Discount"
        value={discount}
        onChange={(e) =>
          setDiscount(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) =>
          setStock(e.target.value)
        }
      />

      <br />
      <br />

      {editingId ? (
        <>
          <button onClick={updateProduct}>
            Update Product
          </button>

          <button
            onClick={() => {
              setEditingId(null);
              setName("");
              setPrice("");
              setCategory("");
              setImage("");
              setRating("");
              setDiscount("");
              setStock("");
              setImageFile(null);
            }}
            style={{
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <button onClick={handleSubmit}>
          Add Product
        </button>
      )}

      <hr />

      <h2>All Products</h2>

      {products.length === 0 ? (
        <p>No Products Found</p>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "10px",
              padding: "10px",
              border:
                "1px solid #ddd",
            }}
          >
            <span>
              {product.name} - ₹
              {product.price}
            </span>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={() => {
                  setEditingId(
                    product._id
                  );

                  setName(
                    product.name
                  );

                  setPrice(
                    product.price
                  );

                  setCategory(
                    product.category
                  );

                  setImage(
                    product.image
                  );

                  setRating(
                    product.rating
                  );

                  setDiscount(
                    product.discount
                  );

                  setStock(
                    product.stock
                  );

                  setImageFile(null);
                }}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteProduct(
                    product._id
                  )
                }
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding:
                    "8px 15px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;