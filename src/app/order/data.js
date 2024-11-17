const columns = [
    { name: "NAME", uid: "name", sortable: true },
    { name: "PRODUCTS", uid: "products" },
    { name: "EMAIL", uid: "email" },
    { name: "ADDRESS", uid: "address" },
    { name: "GOVERNORATE", uid: "governorate" },
    { name: "COUNTRY", uid: "country" },
    { name: "PHONE", uid: "phone", sortable: true },
    { name: "DATE", uid: "date" },
    { name: "TOTAL", uid: "total", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];


const statusOptions = [
    { name: "Today", uid: "today" },
    { name: "Last Week", uid: "lastWeek" },
    { name: "last Month", uid: "lastMonth" },
    { name: "last Year", uid: "lastYear" },
];


const FetchData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    });
    if (response.ok) {
        const data = await response.json();
        return data
    }
}

export { columns, statusOptions, FetchData };