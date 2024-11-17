"use client";
import { Button, Input } from "@nextui-org/react";
import { use, useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { z } from "zod";
import { useToast } from "../../contexts/CustomToast";

const Buy = ({ params }) => {
    const { id: productId } = use(params); // Unwrap params using `use`
    const [product, setProduct] = useState({});
    const [errors, setErrors] = useState({});
    const { showToast } = useToast(); // Access showToast from context

    const [selectedGovernorate, setSelectedGovernorate] = useState({
        place: "",
        fee: 0
    });
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        country: "",
        governorate: "",
        phone: "",
    });

    const governorates = [
        { place: "Alexandria", fee: 50 },
        { place: "Asyut", fee: 200 },
        { place: "Aswan", fee: 300 },
        { place: "Beheira", fee: 100 },
        { place: "Beni Suef", fee: 10 },
        { place: "Cairo", fee: 10 },
        { place: "Dakahlia", fee: 10 },
        { place: "Damietta", fee: 10 },
        { place: "Faiyum", fee: 10 },
        { place: "Gharbia", fee: 10 },
        { place: "Giza", fee: 10 },
        { place: "Ismailia", fee: 10 },
        { place: "Kafr El Sheikh", fee: 10 },
        { place: "Kafr El Zayat", fee: 10 },
        { place: "Khan Yunis", fee: 10 },
        { place: "Mansoura", fee: 10 },
        { place: "Minya", fee: 10 },
        { place: "Monufia", fee: 10 },
        { place: "New Valley", fee: 10 },
        { place: "North Sinai", fee: 10 },
        { place: "Port Said", fee: 10 },
        { place: "Qalyubia", fee: 10 },
        { place: "Qena", fee: 10 },
        { place: "Red Sea", fee: 10 },
        { place: "Sohag", fee: 10 },
        { place: "Suez", fee: 10 },
        { place: "South Sinai", fee: 10 },
        { place: "Tanta", fee: 10 },
        { place: "Tubas", fee: 10 },
        { place: "Zagazig", fee: 10 },
        { place: "Western Ghouta", fee: 10 },
        { place: "Zamalia", fee: 10 },

    ]

    const orderSchema = z.object({
        email: z.string().email("Invalid email address"),
        firstName: z.string().min(2, "First name should have at least 2 characters"),
        lastName: z.string().min(2, "Last name should have at least 2 characters"),
        address: z.string().min(5, "Address should have at least 5 characters"),
        country: z.string().nonempty("Please select a country"),
        governorate: z.string().nonempty("Please select a governorate"),
        phone: z
            .string()
            .regex(/^\d+$/, "Phone number should contain only numbers")
            .min(11, "Phone number should have at least 11 digits")
            .max(11, "Phone number should have at most 11 digits"),
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];

        try {
            // Validate form data
            orderSchema.parse(formData);
            console.log("Form is valid:", formData);
            setErrors({});

            // Send order data to backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    info: formData,
                    cart: product,
                    total: total() + selectedGovernorate.fee
                }),
            });

            if (response.ok) {
                // Order submitted successfully
                showToast(`Order submitted successfully!`);

                // Clear the local cart data
                localStorage.removeItem("cart");

                // If the user is logged in, also clear the user's cart on the backend
                if (token) {
                    const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/empty-cart`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });

                    if (!deleteResponse.ok) {
                        console.error("Failed to clear user cart:", deleteResponse.status);
                    }
                }

                // Redirect to home page
                window.location.href = `/`;
            } else {
                console.error("Failed to submit order:", response.status);
            }
        } catch (error) {
            const formattedErrors = error.formErrors?.fieldErrors || {};
            setErrors(formattedErrors);
        }
    };


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
            console.log(errors)
        }
    };
    useEffect(() => {
        productData();
    }, []);
    const total = () => {
        let total = 0;
        if (product.length === 0) return 0;

        total += product.price

        return total;
    }
    const handelSelectedGovernorate = (index) => {
        const selected = index !== undefined && governorates[index] ? governorates[index] : { place: "", fee: 0 };
        setSelectedGovernorate(selected);
        setFormData({ ...formData, governorate: selected.place });
    };



    return (
        <main className="flex pt-[80px] max-lg:flex-col h-fit">
            <div className="flex-[0.5] p-10 flex justify-end" >
                <form onSubmit={handleSubmit} className="w-[70%] max-lg:w-full h-fit flex flex-col gap-5">
                    <Input
                        type="email"
                        label="Email"
                        name="email"
                        className={`text-black relative z-0 ${errors.email ? "border-red-500 border-1 rounded-xl" : ""}`}
                        value={formData.email}
                        onChange={handleChange}
                        helperText={errors.email}
                        helperColor="error"
                    />
                    {errors.email && <p className="text-red-500">{errors.email}</p>}

                    <h1 className="text-2xl ml-2">Delivery</h1>
                    <Select
                        label="Select a Country"
                        name="country"
                        className={`text-black relative z-0 ${errors.country ? "border-red-500 border-1 rounded-xl" : ""}`}

                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: "Egypt" })}
                    >
                        <SelectItem value="Egypt">Egypt</SelectItem>
                    </Select>
                    {errors.country && <p className="text-red-500">{errors.country}</p>}

                    <div className="flex gap-5 justify-center w-full h-fit">
                        <div className="flex  flex-col w-fit flex-[0.5] h-fit">

                            <Input
                                type="text"
                                label="First Name"
                                name="firstName"
                                className={`text-black relative z-0 ${errors.lastName ? "border-red-500 border-1 rounded-xl" : ""}`}
                                value={formData.firstName}
                                onChange={handleChange}
                                helperText={errors.firstName}
                                helperColor="error"

                            />
                            {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
                        </div>
                        <div className="flex  flex-col flex-[0.5] w-fit h-fit">
                            <Input
                                type="text"
                                label="Last Name"
                                name="lastName"
                                className={`text-black relative z-0 ${errors.lastName ? "border-red-500 border-1 rounded-xl" : ""}`}
                                value={formData.lastName}
                                onChange={handleChange}
                                helperText={errors.lastName}
                                helperColor="error"
                            />
                            {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
                        </div>

                    </div>

                    <Input
                        type="text"
                        label="Address"
                        name="address"
                        className={`text-black relative z-0 ${errors.address ? "border-red-500 border-1 rounded-xl" : ""}`}
                        value={formData.address}
                        onChange={handleChange}
                        helperText={errors.address}
                        helperColor="error"
                    />
                    {errors.address && <p className="text-red-500">{errors.address}</p>}

                    <Select
                        label="Select a Governorate"
                        name="governorate"
                        className={`text-black relative z-0 ${errors.governorate ? "border-red-500 border-1 rounded-xl" : ""}`}

                        value={formData.governorate}
                        onChange={(e) => { setFormData({ ...formData, governorate: e.target.value }); handelSelectedGovernorate(e.target.value) }}
                    >
                        {governorates.map((governorate, index) => (
                            <SelectItem key={index} value={governorate.place}>{governorate.place}</SelectItem>
                        ))}
                    </Select>
                    {errors.governorate && <p className="text-red-500">{errors.governorate}</p>}

                    <Input
                        type="text"
                        label="Phone Number"
                        name="phone"
                        className={`text-black relative z-0 ${errors.phone ? "border-red-500 border-1 rounded-xl" : ""}`}
                        value={formData.phone}
                        onChange={handleChange}
                        helperText={errors.phone}
                        helperColor="error"
                    />
                    {errors.phone && <p className="text-red-500">{errors.phone}</p>}

                    <Button type="submit" variant="shadow" color="primary">
                        Submit Order
                    </Button>
                </form>
            </div>
            <div className="flex-[0.5] p-10 bg-gray-200">
                <div className="w-[70%] max-lg:w-full h-fit flex bg-white p-5 sticky top-24 rounded-lg shadow-xl flex-col gap-5 ">
                    <div className="flex justify-between w-full px-3 h-fit">
                        <div className="flex gap-2 items-center  w-full h-fit">
                            <img src={product.imageUrl} className="h-[70px] w-[70px] border-gray-500 border-1 shadow-lg rounded-lg" />
                            <h1 className="font-serif">{product.name}</h1>
                        </div>
                        <div className="flex items-center flex-nowrap">E£ <p>{product.price}</p></div>
                    </div>
                    <div className="flex justify-between px-3 w-full h-fit">
                        <p>Subtotal</p>
                        <div className="flex items-center flex-nowrap">E£ <p>{product.price}</p></div>
                    </div>
                    <div className="flex justify-between px-3 w-full h-fit">
                        <p>Shipping Fees</p>
                        <div className="flex items-center flex-nowrap">E£ <p>{selectedGovernorate ? selectedGovernorate.fee : 0}.00</p></div>
                    </div>
                    <div className="flex justify-between px-3 w-full h-fit font-bold">
                        <p>Total</p>
                        <div className="flex items-center flex-nowrap">
                            E£ <p>{selectedGovernorate?.fee ? total() + selectedGovernorate.fee : total()}.00</p>
                        </div>
                    </div>


                </div>

            </div>
        </main>
    );
};

export default Buy;