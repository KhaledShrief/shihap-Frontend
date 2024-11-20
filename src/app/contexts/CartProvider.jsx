"use client"
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(Boolean(localStorage.getItem("token")));

    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {

            const fetchUserCart = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    const cartsData = data != [] ? data.user?.cart.map((item) => {
                        return {
                            _id: item.product._id,
                            name: item.product.name,
                            price: item.product.price,
                            imageUrl: item.product.imageUrl,
                            description: item.product.description,
                            quantity: item.quantity,
                            mainId: item._id
                        }
                    })
                        : [];
                    setCart(cartsData);
                } catch (error) {
                    console.error("Error fetching cart:", error);
                }
            };

            if (isLoggedIn) fetchUserCart();
        } else {
            const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(storedCart);
        }
    }, [isLoggedIn]);

    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    );
};
