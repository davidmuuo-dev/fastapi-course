import Button from "./Button.jsx";

export default function Header({ loginStatus, onClick,setLoginStatus }) {
    return (
        <header className="flex items-center justify-between border-b border-gray-200">
            <p>LOGO</p>
            <div className="flex gap-2 p-1">
                {loginStatus ? (
                   <>
                    <Button onClick={() => setLoginStatus(false)} className="bg-gray-300 text-gray-900 px-5 py-1">
                        Logout
                    </Button>

                     <Button
                            onClick={onClick}
                            className="border-2 border-gray-900 bg-gray-300 backdrop-blur-2xl text-gray-900 px-5 py-1"
                        >
                            New Post
                        </Button></>
                ) : (
                    <div className="flex gap-2">
                       
                        <Button onClick={()=> setLoginStatus(true)} className="border-2 border-gray-900 bg-gray-300 backdrop-blur-2xl text-gray-900 px-5 py-1">
                            Register
                        </Button>
                        <Button onClick={()=> setLoginStatus(true)} className="border-2 border-gray-900 text-gray-900 px-5 py-1">
                            Login
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
