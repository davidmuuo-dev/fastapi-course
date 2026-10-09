import Button from "./Button.jsx";

export default function Header() {
    return (
        <header className="flex items-center justify-between border-b border-gray-200">
            <p>LOGO</p>
            <div className="flex gap-2 p-1">
                <Button className="bg-sky-500 text-black px-5 py-1">
                    Register
                </Button>
                <Button className="border-2 border-sky-500 text-black px-5 py-1">
                    Login
                </Button>
            </div>
        </header>
    );
}
