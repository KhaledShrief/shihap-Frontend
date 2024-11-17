import { useToast } from "../contexts/CustomToast";

const CustomToast = ({ message, onClose }) => {
    const { showToast } = useToast(); // Access showToast from the ToastContext

    const handleToast = () => {
        showToast(message);
        setTimeout(onClose, 3000); // Automatically close the toast after 3 seconds
    };

    return (
        <div className="fixed top-24 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
            <p>{message}</p>
            <button onClick={onClose} className="text-sm underline">Close</button>
        </div>
    );
};

export default CustomToast;
