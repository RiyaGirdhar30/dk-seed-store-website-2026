// import { createContext, useState, useEffect} from "react";

// export const CartContext = createContext();

// function CartProvider({ children }) {
// const [cartItems, setCartItems] = useState(() => {
//   const savedCart =
//     localStorage.getItem("dkCart");

//   return savedCart
//     ? JSON.parse(savedCart)
//     : [];
// });

// const addToCart = (product) => {
//   setCartItems((prev) => {
    

//     console.log("Prev Cart:", prev);
//     console.log("Product Added:", product);

//     const existingProduct = prev.find(
//       (item) => item._id === product._id
//     );

//     if (existingProduct) {

//   if (existingProduct.quantity >= product.stock) {
//     alert(
//       `Only ${product.stock} items are available in stock.`
//     );

//     return prev;
//   }

//   const updatedCart = prev.map((item) =>
//     item._id === product._id
//       ? {
//           ...item,
//           quantity: item.quantity + 1,
//         }
//       : item
//   );

//   return updatedCart;
// }

//     return [
//       ...prev,
//       {
//         ...product,
//         quantity: 1,
//       },
//     ];
//   });
// };

//  const removeFromCart = (indexToRemove) => {
//     setCartItems((prev) =>
//       prev.filter((_, index) => index !== indexToRemove)
//     );
//   };

//   const clearCart = () => {
//   setCartItems([]);
// };

// useEffect(() => {
//  console.log(
//   JSON.stringify(cartItems, null, 2)
// );

//   localStorage.setItem(
//     "dkCart",
//     JSON.stringify(cartItems)
//   );
// }, [cartItems]);

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export default CartProvider;


import {
  createContext,
  useState,
  useEffect,
} from "react";

import { useAuth } from "./AuthContext";

export const CartContext = createContext();

function CartProvider({ children }) {
  const { user } = useAuth();

  // Get a unique storage key for each account
  const getCartKey = () => {
  const userId = user?.id || user?._id;

  if (userId) {
    return `dkCart_${userId}`;
  }

  return "dkCart_guest";
};

  const [cartItems, setCartItems] = useState([]);

  // Load the correct cart whenever the user changes
  useEffect(() => {
    const cartKey = getCartKey();

    console.log("Loading cart for:", cartKey);

    const savedCart =
      localStorage.getItem(cartKey);

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error(
          "Error loading cart:",
          error
        );

        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [user]);

  // ==============================
  // ADD TO CART
  // ==============================

  const addToCart = (product) => {
    setCartItems((prev) => {
      console.log("Prev Cart:", prev);
      console.log("Product Added:", product);

      const existingProduct =
        prev.find(
          (item) =>
            item._id === product._id
        );

      let updatedCart;

      if (existingProduct) {
        if (
          existingProduct.quantity >=
          product.stock
        ) {
          alert(
            `Only ${product.stock} items are available in stock.`
          );

          return prev;
        }

        updatedCart = prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      } else {
        updatedCart = [
          ...prev,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      // Save immediately to THIS user's cart
      const cartKey = getCartKey();

      localStorage.setItem(
        cartKey,
        JSON.stringify(updatedCart)
      );

      console.log(
        "Cart saved:",
        cartKey,
        updatedCart
      );

      return updatedCart;
    });
  };

  // ==============================
  // REMOVE FROM CART
  // ==============================

  const removeFromCart = (indexToRemove) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter(
        (_, index) =>
          index !== indexToRemove
      );

      const cartKey = getCartKey();

      localStorage.setItem(
        cartKey,
        JSON.stringify(updatedCart)
      );

      console.log(
        "Cart updated after remove:",
        cartKey,
        updatedCart
      );

      return updatedCart;
    });
  };

  // ==============================
  // CLEAR CART
  // ==============================

  const clearCart = () => {
    setCartItems([]);

    const cartKey = getCartKey();

    localStorage.setItem(
      cartKey,
      JSON.stringify([])
    );

    console.log(
      "Cart cleared:",
      cartKey
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;