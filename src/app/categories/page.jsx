"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter
import { Suspense, useCallback, useEffect, useState } from "react";
import { GiEmptyWoodBucketHandle } from "react-icons/gi";
import { useToast } from "../contexts/CustomToast";
import { SearchIcon } from "../order/SearchIcon";

import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineShopping } from "react-icons/ai";

const CategoriesComponent = () => {
    const searchParams = useSearchParams();
    const router = useRouter(); // Initialize router
    const category = searchParams.get("category"); // Extract 'category' from query parameters
    const [categories, setCategories] = useState([]);
    const { showToast } = useToast(); // Access showToast from context
    const [search, setSearch] = useState("")
    const filters = [
        { id: 1, name: "All" },
        { id: 2, name: "Perfumes" },
        { id: 3, name: "Skin care" },
        { id: 4, name: "Body care" },
        { id: 5, name: "Hair care" },
        { id: 6, name: "Candles" },
        { id: 7, name: "Lip care" },
        { id: 8, name: "Makeup" },
        { id: 9, name: "Body splash" },
    ];

    const fetchCategories = async () => {
        try {
            const query = new URLSearchParams();
            if (category) query.append("category", category);
            if (search) query.append("name", search); // Include 'name' search term

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories?${query.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            } else {
                console.error("Failed to fetch categories:", response.status);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Update the URL with the selected category and fetch new products
    const handleClick = (selectedCategory) => {
        let formattedCategory = selectedCategory.toLowerCase().replace(/\s+/g, '-');
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("category", formattedCategory === "all" ? "" : formattedCategory); // Set to empty string if "All" is selected
        router.push(`/categories?${newSearchParams.toString()}`);
    };

    useEffect(() => {
        fetchCategories();
    }, [category, search]); // Trigger useEffect when category or search changes

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

    const onClear = useCallback(() => {
        setSearch("")
    }, [])
    const handleSearch = useCallback((value) => {
        setSearch(value);
    }, []);
    useEffect(() => {
        console.log(search)
    }, [search])
    return (
        <div className="h-full w-full  flex pt-[80px] bg-white bg-cover">
            <div className="w-full h-full   p-5 flex-col gap-3 text-white flex">
                <div className="w-full h-fit border-2 shadow-2xl   rounded-lg p-5 flex flex-col gap-2 items-center justify-center">
                    <div className="flex gap-2 items-center p-5 w-full h-fit">
                        <Input variant="bordered" className="w-full h-fit transition-all duration-500 shadow-2xl rounded-2xl border-1  text-black text-xl font-extrabold"
                            startContent={<SearchIcon />}
                            isClearable
                            value={search}
                            onValueChange={handleSearch}
                            onClear={() => onClear()}
                            placeholder="Search By Name..." />
                    </div>
                    <div className="flex gap-2 items-center p-5 w-full max-w-full overflow-x-auto justify-center max-lg:justify-start h-fit">
                        {filters.map((filter) => (
                            <Button
                                key={filter.id}
                                variant="flat"
                                onClick={() => handleClick(filter.name)}
                                className={`${filter.name.toLowerCase().replace(/\s+/g, '-') === (category || '').toLowerCase().replace(/\s+/g, '-') ? "border-5 border-gray-800" : "border-0"} w-fit p-5 bg-gray-700 text-[#fff] h-fit`}
                            >
                                {filter.name}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="w-full h-full p-5 flex-wrap justify-center gap-3 text-white flex">
                    {categories.length > 0 ? (
                        categories.map((card) => (
                            <div key={card._id} className="flex-shrink-0 flex shadow-xl flex-col min-h-[500px] w-[270px] bg-pink-50 h-fit rounded-2xl border border-[#fdebdb]">
                                <Link href={`/product/${card._id}`} passHref>
                                    <div className="cursor-pointer">
                                        <img src={card.imageUrl} className="h-[300px] w-full rounded-tr-2xl rounded-tl-2xl" />
                                        <div className="p-5">
                                            <p className="font-thin text-gray-500">{card.name}</p>
                                            <p className=" font-semibold text-gray-600">LE {card.price} EGP</p>
                                        </div>
                                    </div>
                                </Link>
                                <div className="w-full h-fit flex p-5 flex-col gap-2 justify-center items-end">
                                    <Link href={`/buy/${card._id}`} className="w-full h-fit">
                                        <Button
                                            variant="solid"
                                            className="bg-gray-700 w-full text-[#fff] p-6"
                                            startContent={<AiOutlineShopping />}
                                        >
                                            Buy Now
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="solid"
                                        className="bg-gray-700 w-full text-[#fff] p-6"
                                        onClick={() => addToCart(card)}
                                        startContent={<FiShoppingCart />}

                                    >
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-[50px] text-black flex gap-3">
                            <GiEmptyWoodBucketHandle />
                            Oops, no products found for the selected category
                            <GiEmptyWoodBucketHandle />
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
};

const Categories = () => {
    return (
        <Suspense fallback={`loading`}>
            <CategoriesComponent />
        </Suspense>

    )
}
export default Categories;
