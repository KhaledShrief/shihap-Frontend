"use client";
import { useState, useEffect, useContext } from "react";
import { Button } from "@nextui-org/react";
import { GiEmptyWoodBucketHandle } from "react-icons/gi";
import Link from "next/link";
import Counter from "../components/Counter";
import { FaRegTrashCan } from "react-icons/fa6";
import { CartContext } from "../contexts/CartProvider";

const Cart = () => {
    const { cart, setCart } = useContext(CartContext);

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
        <div className="h-full w-full  flex flex-col pt-[80px] items-center ">
            <div className="w-[70%] h-full max-lg:w-full bg-white p-5 flex-col gap-3  justify-center text-black flex ">
                <div className="w-full h-fit  max-lg:px-10 p-5 flex justify-between items-center">
                    <h1 className="text-5xl font-serif text-gray-700"> Your Cart</h1>
                    <Link href="/" className="text-[#E8836B] underline text-2xl font-serif">Continue Shopping</Link>
                </div>
                <div className="w-full h-fit  flex justify-between items-center">
                    <div className="flex-[0.75] px-2  font-extralight  flex justify-between">
                        <h1 className="  text-gray-500">Product</h1>
                        <h1 className="  text-gray-500">Quantity</h1>
                    </div>
                    <div className="flex-[0.25]  flex justify-end">

                        <h1 className=" font-extralight text-gray-500">Total</h1>
                    </div>
                </div>
                <hr />
                {cart?.length > 0 ? cart.map((item) => (
                    <div key={item._id} className="flex flex-col gap-5">
                        <div className="rounded-xl w-full shadow-2xl shadow-white bg-[white] bg-cover h-fit flex">
                            <img src={item.imageUrl} alt={item.name} className=" aspect-square w-[20vh] max-lg:w-[10vh]  rounded-lg h-[20vh]" />
                            <div className="p-2 flex justify-between  w-full">
                                <div className=" p-2 h-full max-lg:flex-col  flex  flex-[0.8]">
                                    <div className="w-full h-full max-h-[80%] max-w-[80%] overflow-y-auto scrollbar-hide">
                                        <h1 className="text-medium text-gray-500 font-semibold">{item.name}</h1>
                                        <p className="text-medium text-gray-500 font-sans">LE {item.price}.00</p>
                                    </div>
                                    <div className="flex h-full w-fit items-center gap-2">

                                        <Counter mainId={item.mainId} quantity={item.quantity} id={item._id} cart={cart} setCart={setCart} />
                                        <button className=" bg-[#E8836B] h-fit w-fit p-3 px-3 rounded-md  text-white" onClick={() => handleRemoveItem(!isLoggedIn ? item._id : item.mainId)}>
                                            <FaRegTrashCan />
                                        </button>
                                    </div>
                                </div>
                                <div className="w-fit flex h-full flex-[0.2] justify-end items-center py-3">
                                    <p className="text-lg text-gray-500 font-sans">LE {item.price * item.quantity}.00</p>

                                </div>
                            </div>
                        </div>
                        <div className="w-full h-fit flex justify-center">

                            <hr className="w-[80%]" />
                        </div>
                    </div>
                )) : <div className="w-full h-[300px] font-bold flex justify-center items-center">
                    <h1 className="text-center text-5xl text-gray-500 flex"><GiEmptyWoodBucketHandle />Your cart is empty<GiEmptyWoodBucketHandle />
                    </h1>
                </div>}
                <div className="w-full flex py-10 px-3 flex-[0.2] text-black justify-end">
                    <div className="w-fit p-2 flex flex-col items-end gap-3 h-fit sticky top-24 rounded-lg">
                        <div className="text-xl  text-gray-500 w-full h-fit justify-end font-sans font-medium flex gap-5"><p>Estimated total</p> LE {total}.00 EGP</div>
                        <div className="flex w-full h-fit justify-between">
                            <p className="text-medium font-semibold text-gray-500 font-sans">Tax included. Shipping and discounts calculated at checkout.</p>
                        </div>
                        <Link href={`/buy`} className="h-fit w-full  flex">
                            <Button variant="solid" disabled={cart.length === 0} className={`${cart.length === 0 ? "cursor-not-allowed opacity-[0.5] hover:opacity-[0.2]" : " cursor-pointer opacity-[1]"} bg-[#E8836B] text-[#fff] p-6 font-serif w-full`}>Buy Now</Button>
                        </Link>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default Cart;
