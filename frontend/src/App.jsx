import "./App.css";
import { useState } from "react";
import { Routes } from "react-router";
import { Route } from "react-router";
import Header from "./Components/Header.jsx";
import Posts from "./Components/Posts.jsx";
import Post from "./Components/Post.jsx";
import Error from "./Components/Error.jsx";
import NewPost from "./Components/NewPost.jsx";
import RequestMessage from "./Components/RequestMessage.jsx";

function App() {
    const [loginStatus, setLoginStatus] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenNewPostForm = () => {
        setModalOpen(true);
    };
    return (
        <div className="min-h-screen relative min-w-screen bg-gray-100">
            <RequestMessage
                state="error"
                stateMessage="NetWork Error. Please try again later"
            />
            <NewPost modalOpen={modalOpen} setModalOpen={setModalOpen} />
            <Header loginStatus={loginStatus} onClick={handleOpenNewPostForm} />
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
