"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toastMessage, setToastMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check local storage for a message on component mount
        const message = localStorage.getItem("toastMessage");
        if (message) {
            setToastMessage(message);
            setIsVisible(true); // Show toast
            localStorage.removeItem("toastMessage"); // Clear it from local storage
            setTimeout(() => {
                setIsVisible(false); // Hide after 5 seconds
            }, 10000);
        }
    }, []);

    const showToast = (message) => {
        setToastMessage(message);
        setIsVisible(true); // Show toast
        localStorage.setItem("toastMessage", message); // Save to local storage
        setTimeout(() => setIsVisible(false), 10000); // Clear toast after 3 seconds
    };

    const closeToast = () => {
        setIsVisible(false); // Hide toast
        setToastMessage(""); // Clear message
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {isVisible && (
                <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg transition-transform transform scale-100 hover:scale-150 flex items-center animate-slide">
                    <span>{toastMessage}</span>
                    <button onClick={closeToast} className="ml-4 text-white font-bold">
                        X
                    </button>
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    return useContext(ToastContext);
};
