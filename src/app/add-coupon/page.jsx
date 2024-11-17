"use client"
import { useState, useEffect } from "react";
import { z } from "zod"
import { useToast } from "../contexts/CustomToast";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { FaRegTrashAlt } from "react-icons/fa";

const AddCoupon = () => {
    const [errors, setErrors] = useState({});
    const [coupons, setCoupons] = useState([]);
    const [formData, setFormData] = useState({
        code: "",
        ability: "",
        discount: "", // updated to hold a File object

    });
    const { showToast } = useToast(); // Access showToast from context

    const couponSchema = z.object({
        code: z.string().min(5, "Product name should have at least 5 characters"),
        ability: z.string().nonempty("Please select a ability"),
    });

    const abilities = [
        { name: "Fee Remover", value: "fee" },
        { name: "Discount", value: "discount" }
    ]

    const discounts = [
        { name: "10%", value: 10 },
        { name: "20%", value: 20 },
        { name: "30%", value: 30 },
        { name: "40%", value: 40 },
        { name: "50%", value: 50 },
        { name: "60%", value: 60 },
        { name: "70%", value: 70 },
        { name: "80%", value: 80 },
        { name: "90%", value: 90 },
        { name: "100%", value: 100 }
    ]


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate form data
            couponSchema.parse(formData);
            console.log("Form is valid:", formData);
            setErrors({});
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/add-coupon`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                showToast("Coupon created successfully", "success");
                setFormData({
                    code: "",
                    ability: "",
                    discount: "",
                });
            } else {
                const error = await response.json();
                showToast(error.message, "error");
            }
        } catch (error) {
            console.log(error)
            const formattedErrors = error.formErrors?.fieldErrors || {};
            setErrors(formattedErrors);
        }
    }
    const fetchCoupons = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coupons`);
            if (response.ok) {
                const data = await response.json();
                setCoupons(data);
                console.log(data);
            } else {
                console.log(response.status);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (token) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                // Refetch data after deletion to ensure the orders state is updated correctly
                const updatedData = await fetchCoupons();
                setProducts(updatedData);
                showToast("Product deleted successfully!");

            } else {
                console.error("Failed to delete item:", response.status);
            }
        }
    };


    return (
        <main className="p-24">
            <div className="w-full h-fit flex justify-center items-center">

                <form onSubmit={handleSubmit} className="w-[70%] max-lg:w-full h-fit flex flex-col gap-5">
                    <h1 className="text-2xl ml-2">Create A Coupon</h1>

                    <Input
                        type="text"
                        label="Coupon Code"
                        name="code"
                        className={`text-black relative z-0 ${errors.code ? "border-red-500 border-1 rounded-xl" : ""}`}
                        value={formData.code}
                        onChange={handleChange}
                        helperText={errors.code}
                        helperColor="error"
                    />
                    {errors.code && <p className="text-red-500">{errors.code}</p>}
                    <Select
                        label="Select a Ability"
                        name="ability"
                        className={`text-black relative z-0 ${errors.ability ? "border-red-500 border-1 rounded-xl" : ""}`}
                        value={formData.ability}
                        onChange={(e) => setFormData({ ...formData, ability: abilities[e.target.value].value })}
                    >
                        {abilities.map((ability, index) => (
                            <SelectItem key={index} value={ability.value}>{ability.name}</SelectItem>
                        ))}
                    </Select>
                    {errors.ability && <p className="text-red-500">{errors.ability}</p>}
                    {formData.ability === "discount" && (
                        <Select
                            label="Select a Discount"
                            name="discount"
                            className={`text-black`}
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: discounts[e.target.value].value })}
                        >
                            {discounts.map((discount, index) => (
                                <SelectItem key={index} value={discount.value}>{discount.name}</SelectItem>
                            ))}
                        </Select>
                    )}
                    <Button type="submit" variant="shadow" color="primary">
                        Submit
                    </Button>
                </form>
            </div>
            <div className="w-full h-full flex p-10  gap-3">
                {coupons.length > 0 ? coupons.map((coupon) => (
                    <div key={coupon._id} className="w-[200px] h-[200px] shadow-lg p-3 flex flex-col gap-2 items-center justify-center  relative">
                        <h1>{coupon.code}</h1>
                        <p>{coupon.ability}</p>

                        <p>{coupon.discount}</p>
                        <Button variant="bordered" color="danger" className="absolute top-3 right-3" onClick={() => handleDelete(coupon._id)} > <FaRegTrashAlt className="w-5 h-5" />                        </Button>
                    </div>
                )) : null}
            </div>
        </main>
    )
}

export default AddCoupon