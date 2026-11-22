import { useRef } from "react";
import Button from "./Button";
import { Link } from "react-router";
import mainApi from "../APIs.jsx";
export default function Login() {
  const loginForm = useRef(null);
  ////////////////////////////////////////////////////////
  function handleLogin(e) {
    e.preventDefault();
    try {
      const form_data = new FormData(loginForm.current);
      const response = mainApi.post("/users/token", form_data);
      if(response.ok){
        localStorage.getItem("access_token",response.data.access_token)
      }
      console.log(response);
    } catch (error) {
      console.log(error.response?.data);
    }
  }
  ///////////////////////////////////////////////////
  return (
    <>
      <div className="size-full flex justify-center items-center ">
        <form
          onSubmit={handleLogin}
          ref={loginForm}
          className="flex flex-col w-[80%] md:w-[40%] lg:w-[30%] gap-5 mt-30  bg-gray-700 rounded-md shadow-2xl shadow-gray-800 p-4"
        >
          <p className="text-gray-100">Login to continue.</p>
          <Input type="email" name="username" placeholder="Email..." />
          <Input type="password" name="password" placeholder="Pasword..." />
          <div className="flex justify-between p-2">
            <Button className="bg-gray-200 px-3 py-1" type="button">
              Cancel
            </Button>
            <Button className="bg-gray-400 px-3 py-1" type="submit">
              Submit
            </Button>
          </div>
          <p className="text-gray-100">
            Don't have an account?{" "}
            <Link className="underline text-blue-500" to="/register">
              Register
            </Link>{" "}
          </p>
        </form>
      </div>
    </>
  );
}

function Input({ type, name, placeholder }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="outline-none border border-gray-300 rounded-lg p-2 bg-gray-400 "
    />
  );
}
