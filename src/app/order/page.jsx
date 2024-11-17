"use client";
import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
} from "@nextui-org/react";
import { PlusIcon } from "./PlusIcon";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { columns, statusOptions, FetchData } from "./data";
import { capitalize } from "./utils";
import { useToast } from "../contexts/CustomToast";

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "phone", "date", "total", "actions"];

const OrderPage = () => {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [orders, setOrders] = React.useState([]);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);
    const { showToast } = useToast();
    const hasSearchFilter = Boolean(filterValue);

    React.useEffect(() => {
        FetchData().then((data) => {
            setOrders(data)
        });
    }, []);


    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const calculateDateRange = (uid) => {
        const today = new Date();

        // Set time to Egypt timezone (UTC+2)
        today.setHours(2, 0, 0, 0);
        const startOfToday = new Date(today);

        switch (uid) {
            case "today":
                return { start: startOfToday, end: today };
            case "lastWeek":
                const lastWeek = new Date(startOfToday);
                lastWeek.setDate(today.getDate() - 7);
                return { start: lastWeek, end: today };
            case "lastMonth":
                const lastMonth = new Date(startOfToday);
                lastMonth.setMonth(today.getMonth() - 1);
                return { start: lastMonth, end: today };
            case "lastYear":
                const lastYear = new Date(startOfToday);
                lastYear.setFullYear(today.getFullYear() - 1);
                return { start: lastYear, end: today };
            default:
                return null;
        }
    };


    const filteredItems = React.useMemo(() => {
        let filteredOrders = [...orders];
        if (hasSearchFilter) {
            filteredOrders = filteredOrders.filter((order) =>
                (order.info.firstName + " " + order.info.lastName)
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }

        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredOrders = filteredOrders.filter((order) => {
                const orderDate = new Date(order.date); // Ensure orderDate is in local time
                return Array.from(statusFilter).some((uid) => {
                    const range = calculateDateRange(uid);
                    return range && orderDate >= range.start && orderDate <= range.end;
                });
            });
        }

        return filteredOrders;
    }, [orders, filterValue, statusFilter]);




    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);


    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (token) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                // Refetch data after deletion to ensure the orders state is updated correctly
                const updatedData = await FetchData();
                setOrders(updatedData);
                showToast("Order deleted successfully!");

            } else {
                console.error("Failed to delete item:", response.status);
            }
        }
    };


    const renderCell = React.useCallback((order, columnKey) => {
        const cellValue = order[columnKey];
        switch (columnKey) {
            case "name":
                return (
                    <User
                        description={order.info.firstName + " " + order.info.lastName}
                        name={cellValue}
                    >
                        {order.info.email}
                    </User>
                );
            case "email":
                return (
                    <div>

                        <p >{order.info.email}</p>

                    </div>
                );
            case "phone":
                return (
                    <div>

                        <p >{order.info.phone}</p>

                    </div>
                );
            case "products":
                return (
                    <div>
                        {order.cart.map((product, index) => (
                            <p key={index}>{product.name} - ${product.price} x {product.quantity}</p>
                        ))}
                    </div>
                );
            case "address":
                return (
                    <Chip color={statusColorMap[order.status]} size="sm" variant="flat">
                        {order.info.address}
                    </Chip>
                );
            case "governorate":
                return (
                    <Chip color={statusColorMap[order.status]} size="sm" variant="flat">
                        {order.info.governorate}
                    </Chip>
                );
            case "country":
                return (
                    <Chip color={statusColorMap[order.status]} size="sm" variant="flat">
                        {order.info.country}
                    </Chip>
                );
            case "date":
                return `${order.date}`;
            case "total":
                return `$${order.total}`;
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem onClick={() => handleDelete(order._id)}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);


    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])



    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat" className="relative z-0">
                                    Date Filter
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="single"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat" className="relative z-0">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {orders.length} users</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        orders.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${filteredItems.length} selected`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    className="relative z-0"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);
    return (
        <main className="p-24 w-full h-full">
            <Table
                aria-label="Example table with custom cells, pagination and sorting"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[382px]",
                }}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No users found"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </main>
    )
}
export default OrderPage