"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { HiMiniShoppingCart } from "react-icons/hi2";
import { IoArrowUpSharp } from "react-icons/io5";
import { GiShop } from "react-icons/gi";
import { Button } from "@nextui-org/react";
import { useToast } from "../contexts/CustomToast";

const NavigationBar = () => {
    const [isHover, setIsHover] = useState(-1);
    const [mounted, setMounted] = useState(-2);
    const [user, setUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const isLoggedIn = typeof window !== "undefined" && Boolean(localStorage.getItem("token")); // Check if token exists
    const { showToast } = useToast(); // Access showToast from context

    useEffect(() => {
        setIsLoggedIn(Boolean(localStorage.getItem("token")));

    }, []);
    const hover = (num) => {
        setIsHover(num);
    };
    const leave = () => {
        setIsHover(-1);
    };
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

    const home = [
        {
            title: "contact us",
            href: "/contact-us",
            des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto perferendis non ratione corporis ab labore consectetur fugit repudiandae perspiciatis cupiditate recusandae, laboriosam atque esse assumenda. Architecto aliquam quidem molestiae quo."
        },
        {
            title: "Privacy&Policy",
            href: "/privacy-policy",
            des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto perferendis non ratione corporis ab labore consectetur fugit repudiandae perspiciatis cupiditate recusandae, laboriosam atque esse assumenda. Architecto aliquam quidem molestiae quo."
        },
        {
            title: "Know About Us",
            href: "/know-about-us",
            des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto perferendis non ratione corporis ab labore consectetur fugit repudiandae perspiciatis cupiditate recusandae, laboriosam atque esse assumenda. Architecto aliquam quidem molestiae quo."
        },
    ]
    const categories = [
        {
            title: "Perfumes",
            href: "/categories?category=perfumes",
            des: " fugit o aliquam quidem molestiae quo."
        },
        {
            title: "Skin Care",
            href: "/categories?category=skin-care",
            des: " ab labore consectetur fugitassumenda.quo."
        },
        {
            title: "Body care",
            href: "/categories?category=body-care",
            des: " ab labore consectetur fugit  quo."
        },
        {
            title: "Hair care",
            href: "/categories?category=hair-care",
            des: "erspiciatis  atque esse assumenda.  molestiae quo."
        },
        {
            title: "Candles",
            href: "/categories?category=candles",
            des: "  recusandae, aliquam quidem molestiae quo."
        },
        {
            title: "Lip care",
            href: "/categories?category=lip-care",
            des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. ."
        },
        {
            title: "Makeup",
            href: "/categories?category=makeup",
            des: "Lorem ipsum dolor, sit amet Architecto perferendis "
        },

    ]
    const content = () => {
        return (
            <div
                className={`w-full h-fit absolute top-[80px] bg-white text-[#E8836B] z-[4] transition-all duration-500 ease-in-out transform ${isHover === mounted ? "max-h-[500px] opacity-100 translate-y-0" : "max-h-0 opacity-0 translate-y-[-20px]"
                    } overflow-hidden`}
                onMouseEnter={() => hover(isHover)}
                onMouseLeave={leave}
            >
                {isHover === 0 ? (
                    <div className="p-7 h-[10%] gap-5 w-full flex animate-slideinnav">
                        <Link href="/" className="w-fit h-full relative group" onClick={() => setIsHover(-1)}>
                            <FaHome className="w-[35vh] h-[35vh] flex-[0.2]" />
                            <IoArrowUpSharp className="w-8 h-8  rotate-45 absolute bottom-0 right-0 transform transition-transform group-hover:-translate-y-3" />
                        </Link>
                        <div className=" flex justify-between ">
                            {home.map((item, index) => {
                                return (
                                    <Link href={item.href} key={index} onClick={() => setIsHover(-1)} className="flex flex-col w-full p-5 h-full justify-between cursor-pointer group hover:underline">
                                        <h1 className="text-xl font-bold">
                                            {item.title}
                                        </h1>
                                        <p>
                                            {item.des}
                                        </p>
                                        <IoArrowUpSharp className="w-8 h-8 self-end rotate-45 transform transition-transform group-hover:-translate-y-3" />
                                    </Link>
                                )
                            })}

                        </div>
                    </div>
                ) : isHover === 1 ? (
                    <div className="p-7 h-[10%] gap-5 w-full flex animate-slideinnav">
                        <Link href="/categories" className="w-fit h-full relative group" onClick={() => setIsHover(-1)}>
                            <GiShop className="w-[35vh] h-[35vh] flex-[0.2]" />
                            <IoArrowUpSharp className="w-8 h-8 absolute rotate-45 bottom-0 right-0 transform transition-transform group-hover:-translate-y-3" />
                        </Link>
                        <div className=" flex justify-between ">
                            {categories.map((item, index) => {
                                return (
                                    <Link href={item.href} onClick={() => setIsHover(-1)} key={index} className="flex flex-col w-full p-5 h-full justify-between cursor-pointer group hover:underline">
                                        <h1 className="text-xl font-bold">
                                            {item.title}
                                        </h1>
                                        <p>
                                            {item.des}
                                        </p>
                                        <IoArrowUpSharp className="w-8 h-8 self-end rotate-45 transform transition-transform group-hover:-translate-y-3" />
                                    </Link>
                                )
                            })}

                        </div>

                    </div>
                ) : isHover === 2 ? (
                    <div className="p-7 h-[10%] gap-5 w-full flex animate-slideinnav">
                        <Link href="/cart" className="w-fit h-full relative group" onClick={() => setIsHover(-1)}>
                            <HiMiniShoppingCart className="w-[35vh] h-[35vh] flex-[0.2]" />
                            <IoArrowUpSharp className="w-8 h-8 absolute rotate-45 bottom-0 right-0 transform transition-transform group-hover:-translate-y-3" />
                        </Link>
                        <div className=" flex justify-between ">
                            <div className="flex flex-col w-full p-5 h-full justify-between cursor-pointer group">
                                <h1 className="text-xl font-bold">
                                    Welcome to MK Store
                                </h1>
                                <p>
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto perferendis non ratione corporis ab labore consectetur fugit repudiandae perspiciatis cupiditate recusandae, laboriosam atque esse assumenda. Architecto aliquam quidem molestiae quo.
                                </p>
                                <IoArrowUpSharp className="w-8 h-8 self-end rotate-45 transform transition-transform group-hover:-translate-y-3" />
                            </div>
                            <div className="flex flex-col w-full p-5 h-full justify-between cursor-pointer group">
                                <h1 className="text-xl font-bold">
                                    Welcome to MK Store
                                </h1>
                                <p>
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto perferendis non ratione corporis ab labore consectetur fugit repudiandae perspiciatis cupiditate recusandae, laboriosam atque esse assumenda. Architecto aliquam quidem molestiae quo.
                                </p>
                                <IoArrowUpSharp className="w-8 h-8 self-end rotate-45 transform transition-transform group-hover:-translate-y-3" />
                            </div>
                            <div className="flex flex-col w-full p-5 h-full justify-between cursor-pointer group">
                                <h1 className="text-xl font-bold">
                                    Welcome to MK Store
                                </h1>
                                <p>
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto perferendis non ratione corporis ab labore consectetur fugit repudiandae perspiciatis cupiditate recusandae, laboriosam atque esse assumenda. Architecto aliquam quidem molestiae quo.
                                </p>
                                <IoArrowUpSharp className="w-8 h-8 self-end rotate-45 transform transition-transform group-hover:-translate-y-3" />
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    };

    const items = [
        {
            id: 0,
            name: "Home",
            icon: <FaHome className="w-5 h-5 max-lg:w-[10px] max-lg:h-[10px]" />,
            href: "/",
            content: "klaus1"
        },
        {
            id: 2,
            name: "Categories",
            icon: <GiShop className="w-5 h-5 max-lg:w-[10px] max-lg:h-[10px]" />,
            href: "/categories",
            content: "klaus3"
        },
        {
            id: 1,
            name: "Basket",
            icon: <HiMiniShoppingCart className="w-5 h-5max-lg:w-[10px] max-lg:h-[10px]" />,
            href: "/cart",
            content: "klaus2"
        }
    ];

    const handleLogout = async (e) => {
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
            method: 'POST',
            credentials: 'include', // Ensure cookies are sent
        });

        // Clear the JWT token from localStorage
        localStorage.removeItem('token');

        // Redirect to the homepage or login
        showToast("Logout successful! Welcome to MK Store.");
        window.location.href = '/';
    };

    return (
        <div className="relative">
            {/* Background overlay that applies blur and darkening effect */}
            <div
                className={`fixed inset-0 z-[5] bg-gray-300  bg-opacity-70 backdrop-blur-md transition-all duration-300 ease-in-out ${isHover === mounted ? 'visible opacity-100' : 'invisible opacity-0'
                    }`}
            ></div>

            <div className="w-full fixed top-0 z-[10]">
                <nav className="w-full h-[80px] bg-white text-[#E8836B] flex flex-col px-20  ">
                    <div className="flex items-center justify-between px-10 h-full w-full border-b-2 border-[#E8836B]">
                        <div className="w-fit h-fit">
                            {/* <img src="/logo.png" className="h-[60px] w-[100px] max-lg:w-[50px] max-lg:h-[50px] max-lg:absolute max-lg:left-5 max-lg:top-5" alt="logo" /> */}
                        </div>
                        <div className="flex items-center max-lg:gap-2 gap-10 w-fit h-full">
                            {items.map((item, index) => (
                                <Link href={item.href} onClick={() => setIsHover(-1)} key={item.id} className="w-fit h-full">
                                    <div
                                        className={`text-lg max-lg:text-[10px] ${isHover === index ? "border-b-3 border-[#E8836B]" : ""} transition-all ease-in-out duration-300 flex items-center  h-full cursor-pointer gap-1`}
                                        onMouseEnter={() => { hover(index); setMounted(index); }}
                                        onMouseLeave={leave}
                                    >
                                        {item.icon}
                                        {item.name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {!isLoggedIn ? (
                                <Link href="/login">
                                    <Button variant="bordered" className="max-lg:ml-2 max-lg:text-[10px] max-lg:w-[10px] max-lg:h-[30px]">Sign In</Button>
                                </Link>
                            ) : (
                                <Button variant="bordered" color="danger" className="max-lg:ml-2 max-lg:text-[10px] max-lg:w-[10px] max-lg:h-[30px]" onClick={handleLogout}>Logout</Button>
                            )}

                        </div>
                    </div>
                </nav>
                {content()}
            </div>
        </div>
    );
};

export default NavigationBar;