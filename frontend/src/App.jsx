import "./App.css";
import { useState } from "react";
import { Routes } from "react-router";
import { Route } from "react-router";
import Header from "./Components/Header.jsx";
import Posts from "./Components/Posts.jsx";
import Post from "./Components/Post.jsx";
import Error from "./Components/Error.jsx";

function App() {
    const [loginStatus, setLoginStatus] = useState(false);
    return (
        <div className="min-h-screen min-w-screen bg-gray-100">
            <Header loginStatus={loginStatus} />
            <Routes>
                <Route path="/" element={<Posts />}></Route>
                <Route path="/posts" element={<Posts />}></Route>
                <Route
                    path="*"
                    element={<Error status={404} message="Page not Found" />}
                />
                <Route path="/posts/:post_id" element={<Post />}></Route>
            </Routes>
        </div>
    );
}

export default App;
