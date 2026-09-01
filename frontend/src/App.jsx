import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import OrderHistory from "./pages/OrderHistory";
import ProtectedAdmin from "./components/ProtectedAdmin";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<Login/>} 
        />

        <Route path="/signup" element={<Signup />} />

       <Route path="/admin" element={
       <ProtectedAdmin>
         <Admin />
       </ProtectedAdmin>
       }/>

        <Route path="/orders" element={
        <ProtectedAdmin>
        <Orders />
        </ProtectedAdmin>
        }/>

        <Route
  path="/dashboard"
  element={
    <ProtectedAdmin>
      <Dashboard />
    </ProtectedAdmin>
  }
/>

        <Route path="/order-history" element={<OrderHistory />}/>
        
        <Route
  path="/profile"
  element={<Profile />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;