import Button from "./Button.jsx";
export default function Error({ status, message }) {
    function handleBack() {
        window.location = "/";
    }

    return (
        <main className="rounded-sm border mt-3 m-auto w-[95%] shadow-2xl shadow-black/50 max-w-160   border-red-200">
            <h1 className="bg-red-100 font-medium text-red-700 p-1 ">
                {status}
            </h1>
            <h2 className="p-2 text-sm font-bold">
                Error...
                {status || "Something went wrong"}
            </h2>
            <p className="p-2 pt-0 text-sm">
                {message || "An unexpected error occurred."}
            </p>
            <div className="mt-5 flex justify-end">
                <Button
                    onClick={handleBack}
                    className="px-5 py-1 text-black font-bold "
                >
                    Back
                </Button>
            </div>
        </main>
    );
}
