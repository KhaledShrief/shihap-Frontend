"use client";  // Ensure this component is rendered on the client side

import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';  // Import usePathname instead of useRouter
import { GoHome } from "react-icons/go";
import { GoOrganization } from "react-icons/go";
import { GoTools } from "react-icons/go";
import { GiTyre } from "react-icons/gi";
import { FaAmericanSignLanguageInterpreting } from "react-icons/fa";
import { GiRotaryPhone } from "react-icons/gi";
import Accordion from "./Accordion";
import { FaCarBurst } from "react-icons/fa6";
import { IoSparklesSharp } from "react-icons/io5";
import { useEffect, useState } from "react";

const Sidebar = () => {
    const currentPath = usePathname();
    const [sidebarItems, setSidebarItems] = useState([]);


    useEffect(() => {
        if (currentPath === "/") {
            setSidebarItems([{
                name: "Home",
                icon: <GoHome className="w-5 h-5" />,
                href: "/"
            }]);

        } else if (currentPath === "/mot-testing") {
            setSidebarItems([{
                name: "MOT Testing",
                icon: <GoHome className="w-5 h-5" />,
                href: "/mot-testing"
            }]);
        } else if (currentPath === "/cga-parts") {
            setSidebarItems([{
                name: "CGA Parts",
                icon: <GiRotaryPhone className="w-5 h-5" />,
                href: "/cga-parts"
            }]);
        } else if (currentPath === "/side-services") {
            setSidebarItems([{
                name: "Side Services",
                icon: <GoTools className="w-5 h-5" />,
                href: "/side-services"
            }]);
        }
    }, [currentPath]);

    const items = [
        {
            id: 1,
            name: "Services",
            content: [{ name: "DPF", icon: <FaCarBurst /> }, {
                name: "Spark Erosion", icon: <IoSparklesSharp />
            }]
        },
    ]
    return (
        <div className="w-[17.5%] fixed bg-gray-950 left-0 top-0 h-screen  border-r-1 border-gray-800 shadow-xl z-50">
            <div className="flex justify-center flex-col  items-center w-full h-[100px]">
                <h1 className="text-white font-bold text-[20px]">Lower Early</h1>
                <p className=" font-serif relative top-[-12px] text-orange-500">The Art of Car Checks.</p>
            </div>
            <div className="flex gap-1 flex-col p-3 justify-center h-fit w-full ">
                <Accordion icon={<GoTools className="w-5 h-5" />} items={items} currentPath={currentPath} />
                {sidebarItems.map((item, index) => {

                    return (<Link key={index} href={`${item.href}`} className={`text-[#b9b8b8] font-semibold text-[15px] flex gap-2 hover:text-white hover:bg-gray-800 p-2 transition-all hover:rounded-lg ${currentPath === `${item.href}` && 'bg-gray-700 text-white rounded-lg'}`}>
                        {item.icon}
                        {item.name}
                    </Link>)
                })}

                {/* <Link href="/mots" className={`text-[#b9b8b8] flex gap-2 font-semibold text-[15px] hover:text-white hover:bg-gray-800 p-2 transition-all hover:rounded-lg ${currentPath === '/mots' && 'bg-gray-700 text-white rounded-lg'}`}>
                    <GoOrganization className="w-5 h-5" />
                    MOT's
                </Link>

                <Link href="/tyres" className={`text-[#b9b8b8] flex gap-2 font-semibold text-[15px] hover:text-white hover:bg-gray-800 p-2 transition-all hover:rounded-lg ${currentPath === '/tyres' && 'bg-gray-700 text-white rounded-lg'}`}>
                    <GiTyre className="w-5 h-5" />

                    Tyres
                </Link>
                <Link href="/problem-solving" className={`text-[#b9b8b8] flex gap-2 font-semibold text-[15px] hover:text-white hover:bg-gray-800 p-2 transition-all hover:rounded-lg ${currentPath === '/problem-solving' && 'bg-gray-700 text-white rounded-lg'}`}>
                    <FaAmericanSignLanguageInterpreting className="w-5 h-5" />

                    Problem Solving
                </Link>
                <Link href="/contact-us" className={`text-[#b9b8b8] flex gap-2 font-semibold text-[15px] hover:text-white hover:bg-gray-800 p-2 transition-all hover:rounded-lg ${currentPath === '/contact-us' && 'bg-gray-700 text-white rounded-lg'}`}>
                    <GiRotaryPhone className="w-5 h-5" />

                    Contact Us
                </Link> */}
            </div>
        </div>
    )
}

export default Sidebar;
