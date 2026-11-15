import Button from "./Button.jsx"
export default function RequestMessage({ state, stateMessage,openMessageModal,setOpenMessageModal,messageStatus,statusText }) {
    const handleCloseModal = () => {
        setOpenMessageModal(false);
        window.location.reload()
    };
    return (
       <>
       {openMessageModal &&  <dialog
            open
            className=" w-[75%] md:max-w-150 m-auto rounded-sm border border-blue-500  mt-0.4 z-999 bg-gray-200 backdrop-blur-lg absolute left-0 top-0"
        >
           <div className={
                    state === "error"
                        ? "text-lg w-full bg-red-200 border-b-2 border-red-600 rounded-y-sm flex justify-between p-1.5 "
                        : "text-xs w-full bg-green-200 border-b-2 border-green-600 rounded-sm  flex justify-between p-1.5"
                }>
             <p
                
            >
                {state === "error" ? "Error Message" : "Success Message"}
            </p>
            <div className="flex gap-2">
                <p>{messageStatus}</p>
                <p>{statusText}</p>
            </div>
           </div>
            <p className="text-xl font-bold font-sans text-gray-900">{stateMessage}</p>
         <div className="w-full flex justify-end">   <Button
                onClick={handleCloseModal}
                className="px-5 py-1 text-gray-700 font-bold mt-3 "
            >
                Close
            </Button></div>
        </dialog>}
       </>
    );
}
