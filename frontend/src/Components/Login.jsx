import { useRef } from "react";
import Button from "./Button";
import { Link, useNavigate } from "react-router";
import mainApi from "../APIs.jsx";
import { useCurrentUser } from "../UserContext.jsx";
export default function Login({
  setOpenMessageModal,
  setStateMessage,
  setMessageStatus,
  setStatusText,
  setState,
}) {
  const loginForm = useRef(null);
  const { fetchUser } = useCurrentUser();
  const navigate = useNavigate();
  async function handleLogin(e) {
    e.preventDefault();

    try {
      const form_data = new FormData(loginForm.current);
      const response = await mainApi.post("/users/token", form_data);
      if (response.status == 200) {
        localStorage.setItem("access_token", response.data.access_token);
        console.log(response);
        setStateMessage(`Logged in Succesfully`);
        setMessageStatus(response.status);
        setStatusText(response.statusText);
        setOpenMessageModal(true);
        setState("success");
        fetchUser();
        navigate("/");
        //setOpenMessageModal(false);
      }
    } catch (error) {
      console.log(error.response?.data);
      if (error.response) {
        const detail = error.response.data?.detail;

        let message;

        if (typeof detail === "string") {
          message = detail;
        } else if (Array.isArray(detail)) {
          message = detail.map((err) => err.msg).join(", ");
        } else {
          message = "Something went wrong";
        }

        setStateMessage(message);
        setMessageStatus(error.response.status);
        setStatusText(error.response.statusText);
      } else if (error.request) {
        setStateMessage("Server is not responding");
        setMessageStatus(null);
        setStatusText("Network Error");
      } else {
        setStateMessage(error.message || "Something went wrong");
        setMessageStatus(null);
        setStatusText("Request Error");
      }
      setState("error");
      setOpenMessageModal(true);

      console.log(error.response || error.request || error.message);
    }
  }
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
            <Button onClick={() => navigate("/")} className="bg-gray-200 px-3 py-1" type="button">
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
