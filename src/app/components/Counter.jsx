"use client";
import { useState } from "react";

const Counter = ({ quantity, id, cart, setCart, mainId }) => {

    const updateLocalStorage = (updatedCart) => {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const increment = async () => {
        const token = localStorage.getItem("token");

        const updatedCart = cart.map(item => {
            if (item._id === id) item.quantity += 1;
            return item;
        });
        setCart(updatedCart);
        if (!token) {

            updateLocalStorage(updatedCart)
        } else {
            console.log(mainId, id)

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    cartItemId: mainId,
                    quantity: updatedCart.find(item => item._id === id).quantity
                })

            })
            if (response.ok) {

                const data = await response.json()
                console.log(data)
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
            } else {
                console.log("error")
            }
        }
    };

    const decrement = async () => {
        const token = localStorage.getItem("token");

        const updatedCart = cart.map(item => {
            if (item._id === id) item.quantity = Math.max(1, item.quantity - 1);
            return item;
        });
        setCart(updatedCart);
        if (!token) {

            updateLocalStorage(updatedCart)
        } else {
            console.log(mainId, id)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    cartItemId: mainId,
                    quantity: updatedCart.find(item => item._id === id).quantity
                })

            })
            if (response.ok) {

                const data = await response.json()
                console.log(data)
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
            } else {
                console.log("error")
            }
        }

    };


    return (
        <div className="flex min-w-[100px] gap-10 w-fit h-fit p-1 border-1 rounded-md text-gray-500 border-gray-500">
            <button className="flex-[0.2] h-full cursor-pointer p-1" onClick={decrement}>
                <p className="text-center">-</p>
            </button>
            <div className="flex-[0.6] h-full justify-center p-1">
                <p className="text-center">{quantity}</p>
            </div>
            <button className="flex-[0.2] h-full cursor-pointer p-1" onClick={increment}>
                <p className="text-center">+</p>
            </button>
        </div>
    );
};

export default Counter;
