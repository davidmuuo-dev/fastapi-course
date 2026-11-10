import { useState } from "react";
export default function RequestMessage({ state, stateMessage }) {
    const [openModal, setOpenModal] = useState(true);
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    return (
        <dialog
            open
            className=" w-[75%] m-auto rounded-sm border border-blue-500  mt-0.4 z-999 bg-gray-200 backdrop-blur-lg absolute left-0 top-0"
        >
            <p
                className={
                    state === "error"
                        ? "text-xs w-full bg-red-200 border-b-2 border-red-600 rounded-y-sm"
                        : "text-xs w-full bg-green-200 border-b-2 border-green-600 rounded-sm"
                }
            >
                {state === "error" ? "Error Message" : "Success Message"}
            </p>
            <p className="text-sm font-sans text-gray-700">{stateMessage}</p>
            <Button
                onClick={handleCloseModal}
                className="px-5 py-1 text-gray-700 font-bold "
            >
                Back
            </Button>
        </dialog>
    );
}
