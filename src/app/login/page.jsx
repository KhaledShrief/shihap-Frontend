"use client";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useToast } from "../contexts/CustomToast";

const LoginPage = () => {
    const [active, setActive] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState(""); // Track validation errors
    const { showToast } = useToast(); // Access showToast from context

    const toggle = () => {
        setActive(true);
        setMounted(!mounted);
        setError("")
        setTimeout(() => {
            setActive(false);
        }, 2700);
    }

    // Frontend validation
    const validateForm = (email, password, confirmPassword) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
        if (!emailRegex.test(email)) {
            return "Invalid email format.";
        }
        if (password === "") {
            return "Password is required.";
        }
        if (password.length < 8) {
            return "Password must be at least 8 characters.";
        }
        if (!mounted && password !== confirmPassword) {
            return "Passwords do not match.";
        }
        return ""; // No validation error
    }

    const createUser = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirm?.value;

        // Validate form
        const validationError = validateForm(email, password, confirmPassword);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(""); // Clear previous errors

        // Proceed to make API request if valid
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                confirm: confirmPassword
            }),
        });

        if (response.ok) {
            const data = await response.json(); // Get JSON response
            if (data.token) {
                localStorage.setItem("token", data.token); // Store token in localStorage
                showToast("Registration successful! Welcome to Elora Store.");
                window.location.href = data.redirectUrl; // Redirect using the URL provided by the backend
            }
        } else {
            const data = await response.json();
            setError(data.message); // Display error message
        }
    }


    const login = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        // Validate form
        const validationError = validateForm(email, password, password);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(""); // Clear previous errors
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });
        if (response.ok) {
            const data = await response.json(); // Get JSON response
            if (data.token) {
                localStorage.setItem("token", data.token); // Store token in localStorage
                showToast("login successful! Welcome to Elora Store.");
                window.location.href = data.redirectUrl; // Redirect using the URL provided by the backend
                console.log(data.token)
            }

        } else {
            const data = await response.json();
            setError(data.message); // Display error message
        }

    }

    return (
        <div className="p-28 max-lg:p-0 max-lg:py-28 flex justify-center items-center  bg-[url('/two.jpg')] bg-cover h-full w-full">
            <div className="h-[500px] max-lg:h-[300px] w-[70%] max-lg:w-[90%] rounded-lg flex relative shadow-2xl shadow-blue-700  bg-gray-300 items-center ">
                <div className={`rounded-lg  p-10 flex left-0 w-[80%] max-lg:p-[15px] max-lg:max-w-[100%] h-full bg-[url('/shopping.avif')] ${active ? "animate-fill1 max-lg:min-w-full" : "animate-fillout"} bg-cover`} style={{ clipPath: "polygon(0 0, 100% 0, 0 200%)" }}>
                    <div className={`flex flex-col justify-center w-[50%] absolute ${active ? "animate-slideout" : "animate-slidein"} h-fit text-white `}>
                        <h1 className="text-3xl font-extrabold  max-lg:text-[15px]" >WELCOME {mounted ? "BACK" : ""}</h1>
                        <p className="text-white text-xl max-lg:text-[15px]">{!mounted ? "We would be delighted if you became part of our community. MK store is a place where you can find unique and innovative products." : "I knew you would find your way back "}</p>
                    </div>
                </div>

                {/* Right side with form */}
                <div className={`h-full w-[31%] max-lg:w-[50%] right-0 gap-3 flex max-lg:p-0 max-lg:px-5 max-lg:justify-start flex-col justify-between absolute rounded-lg ${active ? "animate-slideout2" : "animate-slidein2"} p-10`}>
                    <h2 className="text-4xl font-bold text-center max-lg:text-[15px]">{mounted ? "Login" : "Register"}</h2>
                    {error && <p className="text-red-500 text-center">{error}</p>} {/* Display validation errors */}
                    <form onSubmit={(e) => { !mounted ? createUser(e) : login(e) }} className="w-full flex flex-col gap-4 max-xl:gap-5">
                        <Input type="email" label="Email" name="email" className="max-lg:h-[25px] relative z-0" />
                        <Input type="password" label="Password" name="password" className="max-lg:h-[25px] relative z-0" />
                        {!mounted && <Input type="password" label="Confirm Password" className="text-black max-lg:h-[25px] relative z-0" name="confirm" />}
                        <Button type="submit" color="primary" variant="shadow" className="btn mt-4 w-full rounded-2xl max-lg:h-[25px]">{!mounted ? "Sign Up" : "Login"}</Button>
                        <p className="mt-4 max-lg:mt-0 max-lg:text-[15px]"> {mounted ? "I don't have an account" : "Already have an account?"} <a href="#" className="text-purple-600" onClick={toggle}  >{mounted ? "Sign Up" : "Login"}</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
