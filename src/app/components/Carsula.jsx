import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { AiOutlineShopping } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

const Carsula = ({ products, addToCart }) => {
    const [marginLeft, setMarginLeft] = useState(0);
    const [visibleCards, setVisibleCards] = useState(4); // Number of visible cards based on screen width
    const containerRef = useRef(null);
    const touchStartX = useRef(0);
    const cardWidth = 290; // Width of each card

    // Adjust visible cards based on window width
    useEffect(() => {
        const updateVisibleCards = () => {
            const windowWidth = window.innerWidth;
            if (windowWidth >= 1024) setVisibleCards(4); // Desktop
            else if (windowWidth >= 768) setVisibleCards(2); // Tablet
            else setVisibleCards(1); // Mobile
        };

        updateVisibleCards();
        window.addEventListener("resize", updateVisibleCards);
        return () => window.removeEventListener("resize", updateVisibleCards);
    }, []);

    const maxMarginLeft = -(cardWidth * (products.length - visibleCards)); // Max scrollable width

    const scrollLeft = () => {
        setMarginLeft((prevMargin) => Math.min(prevMargin + cardWidth * visibleCards, 0));
    };

    const scrollRight = () => {
        setMarginLeft((prevMargin) => Math.max(prevMargin - cardWidth * visibleCards, maxMarginLeft));
    };

    // Touch handling for swipe support on mobile
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = touchEndX - touchStartX.current;

        // If swipe distance is enough for one card, move the cards accordingly
        if (swipeDistance > cardWidth / 2) {
            scrollLeft();
        } else if (swipeDistance < -cardWidth / 2) {
            scrollRight();
        }
    };

    return (
        <>
            <h1 className="text-[40px] font-serif ml-20 p-5 text-pretty">Summer Offer</h1>
            <div
                className="relative overflow-hidden w-full p-5"
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="flex gap-5 transition-all duration-300 ease-in-out"
                    style={{ marginLeft: `${marginLeft}px` }}
                >
                    {products.map((card) => (
                        <div
                            key={card._id}
                            className="flex-shrink-0 flex shadow-xl flex-col min-h-[500px] w-[270px] bg-[#fce8e4] h-fit rounded-2xl border border-[#fdebdb]"
                        >
                            <Link href={`/product/${card._id}`} passHref>
                                <div className="cursor-pointer">
                                    <img src={card.imageUrl} className="h-[300px] w-full rounded-tr-2xl rounded-tl-2xl" />
                                    <div className="p-5">
                                        <p className="font-thin text-gray-500">{card.name}</p>
                                        <p className="font-semibold text-gray-600">LE {card.price} EGP</p>
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
        </>
    );
};

export default Carsula;
