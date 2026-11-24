import { useEffect } from "react";
import { useCurrentUser } from "../UserContext.jsx";
import Button from "./Button.jsx";

export default function Header({ onClick }) {
  const { currentUser, fetchUser,logout } = useCurrentUser();
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return (
    <header className="flex items-center justify-between border-b border-gray-200">
      <p className="text-white font-black">LOGO</p>

      <div className="flex gap-2 p-1">
        {currentUser ? (
          <>
          <p className="text-gray-300">{currentUser.email}</p>
            <Button onClick={()=>{logout()}} className="bg-gray-600 text-gray-100 px-5 py-1">
              Logout
            </Button>

            <Button
              onClick={onClick}
              className="border-2 border-gray-900 bg-gray-800 backdrop-blur-2xl text-gray-100 px-5 py-1"
            >
              New Post
            </Button>

          </>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => (window.location = "/register")}
              className="border-2 border-gray-900 bg-gray-500 backdrop-blur-2xl text-gray-900 px-5 py-1"
            >
              Register
            </Button>
            <Button
              onClick={() => (window.location = "/login")}
              className="border-2 border-gray-900 text-gray-900 px-5 py-1 bg-gray-500"
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
