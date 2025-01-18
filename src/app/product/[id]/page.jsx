"use client";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useToast } from "../../contexts/CustomToast";


const Product = ({ params }) => {
    const { id: productId } = use(params); // Unwrap params using `use`
    const [product, setProduct] = useState({});
    const { showToast } = useToast(); // Access showToast from context


    const productData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Fetched data:", data);
                setProduct(data);
                return data;
            } else {
                console.error("Failed to fetch data:", response.status);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        productData();
    }, []);
    console.log(product);
    const addToCart = async (product) => {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        const token = localStorage.getItem("token");

        const updateCart = (cart) => {
            const productExists = cart.find(item => item._id === product._id);

            if (productExists) {
                productExists.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            return cart;
        };

        if (token) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId: product._id, quantity: 1 })
                });

                if (response.ok) {
                    showToast(`${product.name} added to your cart!`);

                } else {
                    console.error("Failed to update cart in database.");
                }
            } catch (error) {
                console.error("Error updating cart:", error);
            }
        } else {
            const updatedCart = updateCart(localCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            showToast(`${product.name} added to your cart!`);
        }
    };

    return (
        <main className="w-full h-fit max-lg:flex-col  flex py-10">
            <div className="flex-[0.5] flex p-14 justify-end relative  ">
                <img src={product.imageUrl} alt="shop" className="w-[90%] sticky top-24    h-[400px] rounded-2xl bg-cover shadow-2xl " />
            </div>
            <div className="flex-[0.5] p-14 flex  flex-col gap-5 ">
                <h1 className=" text-5xl font-serif">{product.name}</h1>
                <p className="text-xl font-serif">
                    LE {product.price} EGP


                </p>
                <p className="text-sm text-gray-400"> Tax included. Shipping calculated at checkout.
                </p>
                <div className="flex gap-2 justify-center flex-col p-10 w-full h-fit">

                    <Button variant="solid" className="bg-gray-700 text-[#fff] p-6 font-serif" onClick={() => addToCart(product)}>Add to Cart</Button>
                    <Link href={`/buy/${product._id}`} className="h-fit w-full  flex">
                        <Button variant="solid" className="bg-gray-700 text-[#fff] p-6 font-serif w-full">Buy Now</Button>
                    </Link>
                </div>
                <p>{product.description}</p>
            </div>

        </main>
    )
}
export default Product