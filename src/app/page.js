"use client";
import { Button } from "@nextui-org/react";
import { FaWhatsapp } from "react-icons/fa6";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { useEffect, useRef, useState } from 'react';
import { useToast } from "./contexts/CustomToast";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineShopping } from "react-icons/ai";


export default function Home() {
  const [products, setProducts] = useState([]);
  const { showToast } = useToast(); // Access showToast from context
  const [marginLeft, setMarginLeft] = useState(0);
  const [marginLeft2, setMarginLeft2] = useState(0);
  const cardWidth = 250; // Width of each card (adjust as needed)
  const visibleCards = 4;


  // Function to scroll left
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

  // Function to scroll left

  const getdata = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
      const data = await response.json();

      setProducts(data);

    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  useEffect(() => {
    getdata();
  }, []);

  const maxMarginLeft = -(cardWidth * (products.length - visibleCards)); // Calculate max scrollable width

  const scrollLeft = () => {
    setMarginLeft((prevMargin) => Math.min(prevMargin + cardWidth, 0));
  };

  const scrollRight = () => {
    setMarginLeft((prevMargin) => Math.max(prevMargin - cardWidth, maxMarginLeft));
  };

  const marginleft = () => {
    setMarginLeft2((prevMargin) => Math.min(prevMargin + cardWidth, 0));
  }
  const marginright = () => {
    setMarginLeft2((prevMargin) => Math.max(prevMargin - cardWidth, maxMarginLeft));
  }

  return (
    <main className="pt-20">
      <a href="https://wa.me/201030451520" className="w-fit h-fit p-5 shadow-xl rounded-full fixed right-10 z-[3]  bottom-10 bg-[#E8836B]">

        <FaWhatsapp className="w-5 h-5 cursor-pointer text-white hover:scale-110 transition-all duration-300" />
      </a>
      <section className="w-full h-fit  relative">
        <img src="/two.jpg" className="bg-cover" />
        <div className="w-[50%] absolute animate-slidein z-[3] max-lg:w-full max-lg:top-1 left-0 gap-5 p-10 top-20 flex flex-col h-fit">
          <h1 className="text-white text-[8vh] max-lg:text-[15px] font-extrabold">Welcome To Elora Store</h1>
          <p className="text-[#ddd] text-[20px] max-lg:text-[10px] p-5 font-bold">
            be updated with the newest & high quality products in the market
          </p>
        </div>
      </section>
      <section className="w-full h-full p-10 flex flex-col gap-1">
        <h1 className="text-[40px] font-serif ml-20 p-5 text-pretty">Summer Offer</h1>
        <div className="relative overflow-hidden w-full p-5">
          <div
            className="flex gap-5 transition-all duration-300 ease-in-out"
            style={{ marginLeft: `${marginLeft}px` }}
          >          {products.map((card, index) => (
            <div key={card._id} className="flex-shrink-0 flex shadow-xl flex-col min-h-[500px] w-[270px] bg-[#fce8e4] h-fit rounded-2xl border border-[#fdebdb]">
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
                    className="bg-[#E8836B] w-full text-[#fff] p-6"
                    startContent={<AiOutlineShopping />}
                  >
                    Buy Now
                  </Button>
                </Link>
                <Button
                  variant="solid"
                  className="bg-[#E8836B] w-full text-[#fff] p-6"
                  onClick={() => addToCart(card)}
                  startContent={<FiShoppingCart />}

                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <div className="flex gap-2 items-center">
            <IoMdArrowDropleft className="w-8 h-8 text-gray-400 cursor-pointer" onClick={scrollLeft} />
            <h1 className="text-[20px] font-semibold text-gray-500 p-5 text-pretty">{products.length}</h1>
            <IoMdArrowDropright className="w-8 h-8 text-gray-400 cursor-pointer" onClick={scrollRight} />
          </div>
          <Link href={`/categories`}>
            <Button variant="solid" className="bg-[#E8836B] text-[#fff]">View All</Button>
          </Link>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center gap-4 w-full">
        <video className="rounded-lg  object-cover   w-full" src="/care.mp4" autoPlay loop muted></video>
      </section>

      <section className="w-full h-full p-10 flex flex-col gap-1">
        <h1 className="text-[40px] font-serif ml-20 p-5 text-pretty">Summer Offer</h1>
        <div className="relative overflow-hidden w-full p-5">
          <div
            className="flex gap-5 transition-all duration-300 ease-in-out"
            style={{ marginLeft: `${marginLeft2}px` }}
          >          {products.map((card, index) => (
            <div key={card._id} className="flex-shrink-0 flex shadow-xl flex-col min-h-[500px] w-[270px] bg-[#fce8e4] h-fit rounded-2xl border border-[#fdebdb]">
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
                    className="bg-[#E8836B] w-full text-[#fff] p-6"
                    startContent={<AiOutlineShopping />}
                  >
                    Buy Now
                  </Button>
                </Link>
                <Button
                  variant="solid"
                  className="bg-[#E8836B] w-full text-[#fff] p-6"
                  onClick={() => addToCart(card)}
                  startContent={<FiShoppingCart />}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <div className="flex gap-2 items-center">
            <IoMdArrowDropleft className="w-8 h-8 text-gray-400 cursor-pointer" onClick={marginleft} />
            <h1 className="text-[20px] font-semibold text-gray-500 p-5 text-pretty">{products.length}</h1>
            <IoMdArrowDropright className="w-8 h-8 text-gray-400 cursor-pointer" onClick={marginright} />
          </div>
          <Link href={`/categories`}>
            <Button variant="solid" className="bg-[#E8836B] text-[#fff]">View All</Button>
          </Link>
        </div>
      </section>

      <section className="w-full h-full bg-gray-200">
        <div className="grid grid-cols-5 gap-4 p-4   justify-center items-center">
          {/* First large image */}
          <div className="col-span-2 row-span-2">
            <img
              src="/p1.jpg"
              alt="Image 1"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Second image */}
          <div className="col-span-1 row-span-1">
            <img
              src="/p2.jfif"
              alt="Image 2"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Third image */}
          <div className="col-span-1 row-span-1">
            <img
              src="/p3.jfif"
              alt="Image 3"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-1 row-span-1">
            <img
              src="/p4.jfif"
              alt="Image 3"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-1 row-span-1">
            <img
              src="/p4.jfif"
              alt="Image 3"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="col-span-2 row-span-2">
            <img
              src="/p1.jpg"
              alt="Image 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-1 row-span-1">
            <img
              src="/p3.jfif"
              alt="Image 3"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-1 row-span-1">
            <img
              src="/p2.jfif"
              alt="Image 3"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-1 row-span-1">
            <img
              src="/p3.jfif"
              alt="Image 3"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
