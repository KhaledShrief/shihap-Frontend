"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const Accordion = ({ items, icon, currentPath }) => {
    const [expand, setExpand] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);


    const handleExpand = (id) => {
        setExpand(expand === id ? null : id);

    };

    const renderItems = () => {
        return items.map((item) => {
            const isOpen = mounted && item.id === expand; // Only apply open state if component is mounted
            return (
                <div key={item.id}>
                    <div>
                        <div
                            className={`flex   items-center rounded-lg ${currentPath === `/${item.name.toLowerCase()}` ? "bg-gray-700 text-white" : ""} hover:bg-gray-800`}

                        >
                            <Link href={`/${item.name.toLowerCase()}`} className={`flex flex-[0.9] gap-2 p-2 ${currentPath === `/${item.name.toLowerCase()}` ? " text-white" : ""} text-[#b9b8b8]`}>
                                {icon} {item.name}
                            </Link>
                            <div onClick={() => handleExpand(item.id)} className="h-full flex-[0.1] hover:bg-gray-600 cursor-pointer transition-all rounded-e-lg p-2 flex items-center justify-center">{isOpen ? <div className="rotate-90">&#8250;</div> : <div>&#8250;</div>}</div>
                        </div>
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? "max-h-fit p-1 opacity-100 flex flex-col" : "max-h-[0px] opacity-0"}`}
                        style={{ maxHeight: isOpen ? "fit-content" : "0px" }}
                    >
                        {item.content.map((contentItem, contentIndex) => (
                            <Link href={`/${contentItem.name.toLowerCase().replace(/\s+/g, '-')}`} key={`${item.id}-${contentIndex}`} className={`flex gap-2 px-3${currentPath === `/${contentItem.name.toLowerCase().replace(/\s+/g, '-')}` ? "bg-gray-700" : ""} ${isOpen ? "p-2 rounded-lg hover:bg-gray-800 transition-all" : ""} text-[#b9b8b8]`}>
                                {contentItem.icon} {contentItem.name}
                            </Link>
                        ))}
                    </div>
                </div>
            );
        });
    };

    return <div>{renderItems()}</div>;
};

export default Accordion;
