"use client";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { GiEmptyWoodBucketHandle } from "react-icons/gi";
import Link from "next/link";
import Counter from "../components/Counter";

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setIsLoggedIn(Boolean(localStorage.getItem("token")));
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const handleRemoveItem = async (cartItemId) => {
        const token = localStorage.getItem("token");
        if (token) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const updatedCart = cart.filter(item => item.mainId !== cartItemId);
                setCart(updatedCart);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            } else {
                console.error("Failed to delete item:", response.status);
            }
        } else {
            const updatedCart = cart.filter(item => item._id !== cartItemId);
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
    };


    useEffect(() => {
        const fetchUserCart = async () => {
            try {
                const token = localStorage.getItem("token");
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
    }, [isLoggedIn]);

    useEffect(() => {
        const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(newTotal);
    }, [cart]);
    return (
        <div className="h-full w-full bg-zinc-900 flex max-lg:flex-col-reverse pt-[80px] bg-[url('/shopping.avif')] bg-cover">
            <div className="w-full h-full flex-[0.8] p-5 flex-col gap-3 text-white flex ">
                {cart?.length > 0 ? cart.map((item) => (
                    <div key={item._id} className="rounded-xl w-full shadow-2xl shadow-white bg-[#E8836B] bg-cover h-fit flex">
                        <img src={item.imageUrl} alt={item.name} className="w-[32vh] max-lg:w-[18vh] rounded-tl-lg rounded-bl-lg h-full" />
                        <div className="p-2 flex justify-between w-full">
                            <div className="flex-col p-2 h-full w-[80%] flex gap-5">
                                <h1 className="text-lg">{item.name}</h1>
                                <div className="w-full h-full max-h-[80%] max-w-[80%] overflow-y-auto scrollbar-hide">
                                    <p>{item.description}</p>
                                </div>
                                {/* <p>Quantity: {item.quantity}</p> */}
                                <Counter mainId={item.mainId} quantity={item.quantity} id={item._id} cart={cart} setCart={setCart} />
                            </div>
                            <div className="w-fit flex flex-col justify-between py-3">
                                <p className="text-lg">{item.price} EGP</p>
                                <Button variant="shadow" color="danger" onClick={() => handleRemoveItem(!isLoggedIn ? item._id : item.mainId)}>
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                )) : <div className="w-full h-[300px] font-bold flex justify-center items-center">
                    <h1 className="text-center text-5xl flex"><GiEmptyWoodBucketHandle />Your cart is empty<GiEmptyWoodBucketHandle />
                    </h1>
                </div>}
            </div>
            <div className="w-full py-10 px-3 flex-[0.2] text-white">
                <div className="w-[95%] p-2 flex flex-col gap-3 h-fit border-1 border-gray-500 sticky top-24 rounded-lg">
                    {cart?.length > 0 ? cart.map((item) => (
                        <div key={item._id} className="flex w-full h-fit justify-between">
                            <p>{item.name}</p>
                            <p>LE {item.price * item.quantity}.00 EGP</p>
                        </div>
                    )) : <h1>cart is empty</h1>}
                    <div className="flex w-full h-fit justify-between">
                        <p>Shipping Fees will be applied according to the governorate</p>
                        <div className="flex items-center flex-nowrap">E£ <p>00.00</p></div>
                    </div>
                    <div className="flex justify-between px-3 w-full h-fit font-bold">
                        <p>Total</p>
                        <div className="flex items-center flex-nowrap">E£ <p>{total}.00</p></div>
                    </div>
                    <Link href={`/buy`} className="h-fit w-full  flex">
                        <Button variant="solid" disabled={cart.length === 0} className={`${cart.length === 0 ? "cursor-not-allowed opacity-[0.5] hover:opacity-[0.2]" : " cursor-pointer opacity-[1]"} bg-[#E8836B] text-[#fff] p-6 font-serif w-full`}>Buy Now</Button>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default Cart;
