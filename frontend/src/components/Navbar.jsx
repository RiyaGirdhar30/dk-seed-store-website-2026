import { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { cartItems } = useContext(CartContext);

  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

const handleLogout = () => {
  setMenuOpen(false);
  logout();
};

  return (
    <nav className="navbar">

     <Link
  to="/"
  onClick={() => setMenuOpen(false)}
  style={{ textDecoration: "none" }}
>
  <h2>🌱 DK Seed Store</h2>
</Link>

      <div
  className="menu-icon"
  onClick={() => setMenuOpen(!menuOpen)}
>
  {menuOpen ? "✕" : "☰"}
</div>

      <ul className={menuOpen ? "nav-links active" : "nav-links"}>

        <li>
        <Link
  to="/"
  onClick={() => setMenuOpen(false)}
>
  Home
</Link>
        </li>

        <li>
          <Link to="/products" onClick={()=>setMenuOpen(false)}>Products</Link>
        </li>

        <li>
          <Link to="/about" onClick={()=>setMenuOpen(false)}>About</Link>
        </li>

        <li>
          <Link to="/contact" onClick={()=>setMenuOpen(false)}>Contact</Link>
        </li>

        <li>
        <Link to="/cart" onClick={()=>setMenuOpen(false)}>Cart ({cartItems.length})</Link>
        </li>

       {user?.isAdmin && (
  <>
    <li>
      <Link to="/dashboard" onClick={()=>setMenuOpen(false)}>
        Dashboard
      </Link>
    </li>

    <li>
      <Link to="/orders" onClick={()=>setMenuOpen(false)}>
        Orders
      </Link>
    </li>
  </>
)}

        <li>
  <Link to="/order-history" onClick={()=>setMenuOpen(false)}>
    My Orders
  </Link>
</li>

<li>
  <Link
    to="/profile"
    onClick={() => setMenuOpen(false)}
  >
    My Profile
  </Link>
</li>

      </ul>

  {user ? (
  <div
    className={
      menuOpen
        ? "user-info active"
        : "user-info"
    }
  >

  <h3>
    Hello, {user.name || user.email} 👋
  </h3>

  <button onClick={handleLogout}
   style={{
        background: "red",
        color: "white",
        border: "none",
        padding: "8px 15px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
  >
    Logout
  </button>
</div>
) : (
  <Link to="/login" onClick={()=>setMenuOpen(false)}>
    <button>Login</button>
  </Link>
)}

    </nav>
  );
}

export default Navbar;