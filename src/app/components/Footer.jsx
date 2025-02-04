"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { IoLogoTiktok } from "react-icons/io5";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Image } from "@nextui-org/react";

const Footer = () => {
    const [user, setUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(Boolean(localStorage.getItem("token")));

    }, []);
    const fetchUser = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        });
        if (response.ok) {
            const data = await response.json();
            setUser(data.user);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);
    return (<>
        <div className="p-10 w-full bg-pink-50 text-red-300 bg-cover h-[500px]  flex flex-col">
            <section className="w-full h-full flex text-gray-500  gap-1">
                <div className="px-10 max-lg:px-5 h-full w-full flex font-bold text-pretty flex-col gap-5">
                    <Image src="/logo.png" width={100} height={100} alt="logo" />
                    <p>Inspired by natural beauty, Elora represents a minimalist, clean approach to local beauty scene.</p>
                    <p>Contact Us on:</p>
                    <p>01030451520</p>
                    <div className="flex gap-3 text-gray-500">
                        <FaFacebook className="w-5 h-5 cursor-pointer hover:scale-110 transition-all duration-300" />
                        <FaInstagram className="w-5 h-5 cursor-pointer hover:scale-110 transition-all duration-300" />
                        <FaYoutube className="w-5 h-5 cursor-pointer hover:scale-110 transition-all duration-300" />
                        <IoLogoTiktok className="w-5 h-5 cursor-pointer hover:scale-110 transition-all duration-300" />

                    </div>
                </div>
                <div className="px-10 max-lg:px-5 h-full w-full flex font-bold text-pretty flex-col gap-2">
                    <h1 >Shop</h1>
                    <Link href="/">
                        <h1 className="hover:underline">Home</h1>
                    </Link>
                    <Link href="/categories?category=body-splash">  <h1 className="hover:underline">Body Splash</h1></Link>
                    <Link href="/categories?category=perfumes"> <h1 className="hover:underline">Perfumes</h1></Link>
                    <Link href="/categories?category=skin-care"> <h1 className="hover:underline">Skin Care</h1></Link>
                    <Link href="/categories?category=body-care"> <h1 className="hover:underline">Body Care</h1></Link>
                    <Link href="/categories?category=hair-care"> <h1 className="hover:underline">Hair Care</h1></Link>
                    <Link href="/categories?category=candles">  <h1 className="hover:underline">Candles</h1></Link>
                    <Link href="/categories?category=lip-care">  <h1 className="hover:underline">Lip Care</h1></Link>

                    <Link href="/categories?category=makeup">  <h1 className="hover:underline">Makeup</h1></Link>
                </div>
            </section>

        </div>
        <section className="border-t-1 border-gray-500 w-full h-full flex text-black p-7 px-20 items-center justify-between bg-pink-50">
            <p className="text-[10px]">© 2024, Elora Powered by DevTech.co</p>

            {isLoggedIn && user._id === process.env.NEXT_PUBLIC_MAIN_USER ?
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            variant="bordered"
                            className="max-lg:ml-2 max-lg:text-[10px] max-lg:w-[10px] max-lg:h-[30px] relative z-0"
                        >
                            Edit
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="new" className="text-black" href="/order">Orders</DropdownItem>
                        <DropdownItem key="add-product" className="text-black" href="/add-product">Add Product</DropdownItem>
                        <DropdownItem key="add-coupon" className="text-black" href="/add-coupon">Add Coupon</DropdownItem>

                    </DropdownMenu>
                </Dropdown>
                : null}


        </section>
    </>)
}
export default Footer