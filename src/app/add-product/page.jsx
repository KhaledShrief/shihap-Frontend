"use client";
import { Select, SelectItem } from "@nextui-org/react";
import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useToast } from "../contexts/CustomToast";
import { FaRegTrashAlt } from "react-icons/fa";

const AddProduct = () => {
    const [errors, setErrors] = useState({});
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: null, // updated to hold a File object
        Category: "",
        price: "",
    });
    const { showToast } = useToast(); // Access showToast from context
    const Categories = [
        { Category: "Perfumes", value: "perfumes" },
        { Category: "Skin Care", value: "skin-care" },
        { Category: "Body care", value: "body-care" },
        { Category: "Hair care", value: "hair-care" },
        { Category: "Candles", value: "candles" },
        { Category: "Lip care", value: "lip-care" },
        { Category: "Makeup", value: "makeup" },
    ];

    const productSchema = z.object({
        name: z.string().min(2, "Product name should have at least 2 characters"),
        description: z.string().min(2, "Description should have at least 2 characters"),
        imageUrl: typeof window !== "undefined" ? z.instanceof(File).optional().refine(file => file?.size > 0, "Please select an image") : z.any(),
        Category: z.string().nonempty("Please select a category"),
        price: z.preprocess((val) => Number(val), z.number().min(1, "Price should be greater than 0")),
    });


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imageUrl") {
            setFormData({ ...formData, imageUrl: files[0] }); // set file object for imageUrl
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate form data
            productSchema.parse(formData);
            console.log("Form is valid:", formData);
            setErrors({});

            // Create a FormData object to send the data
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('imageUrl', formData.imageUrl); // This will include the file
            formDataToSend.append('Category', formData.Category);
            formDataToSend.append('price', formData.price);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product`, {
                method: 'POST',
                body: formDataToSend, // Use the FormData object directly
            });

            if (response.ok) {
                const data = await response.json();
                showToast(data.message);
                getdata();

                // Optionally reset the form or clear the state
            }
        } catch (error) {
            const formattedErrors = error.formErrors?.fieldErrors || {};
            setErrors(formattedErrors);
        }
    };
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
    console.log(products);

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (token) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                // Refetch data after deletion to ensure the orders state is updated correctly
                const updatedData = await getdata();
                setProducts(updatedData);
                showToast("Product deleted successfully!");

            } else {
                console.error("Failed to delete item:", response.status);
            }
        }
    };

    return (
        <>
            <main className="flex w-full h-full p-24 justify-center items-center">
                <form onSubmit={handleSubmit} className="w-[70%] max-lg:w-full h-fit flex flex-col gap-5">
                    <h1 className="text-2xl ml-2">Create A Product</h1>

                    <Input
                        type="text"
                        label="Product Name"
                        name="name"
                        className={`text-black relative z-0 ${errors.name ? "border-red-500 border-1 rounded-xl" : ""}`}
                        value={formData.name}
                        onChange={handleChange}
                        helperText={errors.name}
                        helperColor="error"
                    />
                    {errors.name && <p className="text-red-500">{errors.name}</p>}

                    <Input
                        type="file"
                        label="Product Image"
                        name="imageUrl"
                        className={`text-black relative z-0 ${errors.imageUrl ? "border-red-500 border-1 rounded-xl" : ""}`}
                        onChange={handleChange}
                        helperText={errors.imageUrl}
                        helperColor="error"
                    />
                    {errors.imageUrl && <p className="text-red-500">{errors.imageUrl}</p>}


                    <Input
                        type="text"
                        label="Product Description"
                        name="description"
                        className={`text-black relative z-0 ${errors.description ? "border-red-500 border-1 rounded-xl" : ""}`}
                        value={formData.description}
                        onChange={handleChange}
                        helperText={errors.description}
                        helperColor="error"
                    />
                    {errors.description && <p className="text-red-500">{errors.description}</p>}
                    <Select
                        label="Select a Category"
                        name="Category"
                        className={`text-black relative z-0 ${errors.Category ? "border-red-500 border-1 rounded-xl" : ""}`}
                        value={formData.Category}
                        onChange={(e) => setFormData({ ...formData, Category: Categories[e.target.value].value })}
                    >
                        {Categories.map((category, index) => (
                            <SelectItem key={index} value={category.value}>{category.Category}</SelectItem>
                        ))}
                    </Select>
                    {errors.Category && <p className="text-red-500">{errors.Category}</p>}

                    <Input
                        type="text"
                        label="Product Price"
                        name="price"
                        className={`text-black relative z-0 ${errors.price ? "border-red-500 border-1 rounded-xl" : ""}`}
                        value={formData.price}
                        onChange={handleChange}
                        helperText={errors.price}
                        helperColor="error"
                    />
                    {errors.price && <p className="text-red-500">{errors.price}</p>}
                    <Button type="submit" variant="shadow" color="primary">
                        Submit Order
                    </Button>
                </form>
            </main>
            <div className="w-full h-full flex p-10  gap-3">
                {products.length > 0 ? products.map((product) => (
                    <div key={product._id} className="w-fit h-fit relative">
                        <img src={product.imageUrl} className="h-[200px] w-[200px] " />
                        <Button variant="bordered" color="danger" className="absolute top-3 right-3" onClick={() => handleDelete(product._id)} > <FaRegTrashAlt className="w-5 h-5" />                        </Button>
                    </div>
                )) : null}
            </div>
        </>
    );
};

export default AddProduct;
