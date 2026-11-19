import Button from "./Button"
import {Link} from "react-router"
export default function Register() {
  return <>
  
  <div className="size-full flex justify-center items-center">
    
    <form className="flex flex-col w-[80%] md:w-[30%]  gap-5 mt-30 bg-slate-500 rounded-md shadow-2xl shadow-gray-800 p-2">
        <p>Create an account with us.</p>
        <Input type="text" name="username" placeholder="Username..." />
        <Input type="email" name="email" placeholder="Email..." />
        <Input type="password" name="password" placeholder="Pasword..." />
        <Input type="password" name="confirmPassword" placeholder="Confirm Pasword..." />
        <div className="flex justify-between p-2">
            <Button className="bg-gray-200 px-3 py-1" type="button">Cancel</Button>
            <Button className="bg-gray-400 px-3 py-1" type="submit">Submit</Button>
        </div>
        <p>Already have an account? <Link className="underline text-purple-800" to="/login">Login</Link> </p>
    </form>
  </div>
  </>;
}

function Input({type,name,placeholder}){
    return <input type={type} name={name} placeholder={placeholder} className="outline-none border border-gray-300 rounded-lg p-2" />
}