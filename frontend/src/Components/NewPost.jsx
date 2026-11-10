export default function DataPopup({ modalOpen, setModalOpen }) {
    const handleCloseNewPostForm = () => {
        setModalOpen(false);
    };
    return (
        <>
            {" "}
            {modalOpen && (
                <dialog
                    open
                    className="flex flex-col justify-center items-center w-[80%] m-auto rounded-lg border border-blue-500 p-2 mt-5 z-999 bg-gray-200 backdrop-blur-lg"
                >
                    <p className="font-bold underline text-gray-900/60">
                        Create New Post
                    </p>
                    <form className="w-[90%] flex flex-col  gap-5 ">
                        <input
                            required
                            placeholder="Post Title..."
                            className="outline-0 w-full bg-gray-500/20 rounded-md p-2"
                        />
                        <textarea
                            required
                            placeholder="Post Content..."
                            className="outline-0 w-full h-30 bg-gray-500/20 rounded-md p-2"
                        ></textarea>
                        <div className="flex justify-between ">
                            <button
                                onClick={handleCloseNewPostForm}
                                type="button"
                                className="px-5 py-1 font-bold  text-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-1 font-bold text-sky-500"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </dialog>
            )}{" "}
        </>
    );
}
