import { useRef } from "react";
import Button from "./Button";
import { Link, useNavigate } from "react-router";
import mainApi from "../APIs";
export default function Register({
  setStateMessage,
  setOpenMessageModal,
  setMessageStatus,
  setStatusText,
  setState,
}) {
  const newUser = useRef(null);
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    const form_data = new FormData(newUser.current);
    const userData = Object.fromEntries(form_data.entries());
    try {
      const response = mainApi.post("/users", userData);
      setStateMessage(`Account Registered Succesfully`);
      setMessageStatus(response.status);
      setStatusText(response.statusText);
      setOpenMessageModal(true);
      navigate("/login");
    } catch (error) {
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
  };
  return (
    <>
      <div className="size-full flex justify-center items-center">
        <form
          ref={newUser}
          onSubmit={handleRegister}
          className="flex flex-col w-[80%] md:w-[40%] lg:w-[30%] gap-5 mt-30  bg-gray-700 rounded-md shadow-2xl shadow-gray-800 p-4"
        >
          <p className="text-gray-100"> Create an account with us.</p>
          <Input type="text" name="username" placeholder="Username..." />
          <Input type="email" name="email" placeholder="Email..." />
          <Input type="password" name="password" placeholder="Pasword..." />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Pasword..."
          />
          <div className="flex justify-between p-2">
            <Button
              onClick={() => navigate("/")}
              className="bg-gray-200 px-3 py-1"
              type="button"
            >
              Cancel
            </Button>
            <Button className="bg-gray-400 px-3 py-1" type="submit">
              Submit
            </Button>
          </div>
          <p className="text-gray-100">
            Already have an account?{" "}
            <Link className="underline text-blue-500" to="/login">
              Login
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
