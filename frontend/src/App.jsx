import "./App.css";
import { useEffect, useState } from "react";
import { Routes } from "react-router";
import { Route } from "react-router";
import Header from "./Components/Header.jsx";
import Posts from "./Components/Posts.jsx";
import Post from "./Components/Post.jsx";
import Error from "./Components/Error.jsx";
import NewPost from "./Components/NewPost.jsx";
import RequestMessage from "./Components/RequestMessage.jsx";
import Register from "./Components/Register.jsx";
import Login from "./Components/Login.jsx";
import { useCurrentUser } from "./UserContext.jsx";

function App() {
  const [loginStatus, setLoginStatus] = useState(true);
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [newPostModalOpen, setnewPostModalOpen] = useState(false);
  const [state, setState] = useState("Success");
  const [stateMessage, setStateMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [statusText, setStatusText] = useState("");
  const handleOpenNewPostForm = () => {
    setnewPostModalOpen(true);
  };
  const {fetchUser} = useCurrentUser()
  useEffect(() => {fetchUser()},[fetchUser] )
  return (
    <div className="min-h-screen relative min-w-screen bg-slate-950">
      <RequestMessage
        state={state}
        stateMessage={stateMessage}
        openMessageModal={openMessageModal}
        setOpenMessageModal={setOpenMessageModal}
        messageStatus={messageStatus}
        statusText={statusText}
      />
      <NewPost
        setMessageStatus={setMessageStatus}
        setStatusText={setStatusText}
        newPostModalOpen={newPostModalOpen}
        setnewPostModalOpen={setnewPostModalOpen}
        setStateMessage={setStateMessage}
        setState={setState}
        openMessageModal={openMessageModal}
        setOpenMessageModal={setOpenMessageModal}
      />

      <Header
        loginStatus={loginStatus}
        setLoginStatus={setLoginStatus}
        onClick={handleOpenNewPostForm}
      />
      <Routes>
        <Route path="/" element={<Posts />}></Route>
        <Route path="/posts" element={<Posts />}></Route>
        <Route path="/register" element={<Register setOpenMessageModal={setOpenMessageModal} setStatusText={setStatusText} setStateMessage={setStateMessage} setMessageStatus={setMessageStatus} />} ></Route>
        <Route
          path="/login"
          element={<Login setOpenMessageModal={setOpenMessageModal} setState={setState} setStateMessage={setStateMessage} setMessageStatus={setMessageStatus} setStatusText={setStatusText} />}
        ></Route>
        <Route
          path="*"
          element={<Error status={404} message="Page not Found" />}
        />
        <Route
          path="/posts/:post_id"
          element={
            <Post
              setStateMessage={setStateMessage}
              setState={setState}
              setOpenMessageModal={setOpenMessageModal}
              setMessageStatus={setMessageStatus}
              setStatusText={setStatusText}
            />
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
