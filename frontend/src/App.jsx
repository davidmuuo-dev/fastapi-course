import "./App.css";
import { Routes } from "react-router";
import { Route } from "react-router";
import Header from "./Components/Header.jsx";
import Posts from "./Components/Posts.jsx";
import Post from "./Components/Post.jsx";

function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Posts />}></Route>
                <Route path="/posts/:post_id" element={<Post />}></Route>
            </Routes>
        </div>
    );
}

export default App;
