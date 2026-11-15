import { useRef, useState } from "react";
import mainApi from "../APIs";

export default function EditPost({
  editPostModalOpen,
  setStateMessage,
  setState,
  setEditPostModalOpen,
  setOpenMessageModal,
  setMessageStatus,
  setStatusText,
  post
}) {
  const [title,setTitle] = useState(post.title)
  const [content,setContent] = useState(post.content)
  const newPost = useRef(null);
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(newPost.current);
    const postData = Object.fromEntries(formData.entries());
    delete postData.post_id
    

    try {
      const response = await mainApi.patch(`/${post.id}`, postData);
      setStateMessage(`Post editted Succesfully`);
      setMessageStatus(response.status);
      setStatusText(response.statusText);
      setEditPostModalOpen(false);
      setOpenMessageModal(true);
      console.log(response);
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
      setEditPostModalOpen(false);
      setOpenMessageModal(true);

      console.log(error.response || error.request || error.message);
    }
  }
  const handleCloseNewPostForm = () => {
    setEditPostModalOpen(false);
  };

  
  return (
    <>
      {" "}
      {editPostModalOpen && (
        <>
          <dialog
            open
            className="flex flex-col justify-center items-center w-[80%] m-auto md:max-w-180 rounded-lg border border-blue-500 p-2 mt-5 z-999 bg-gray-200 backdrop-blur-lg"
          >
            <p className="font-bold underline text-gray-900/60">
              Edit Post
            </p>
            <form
              onSubmit={handleSubmit}
              ref={newPost}
              className="w-[90%] flex flex-col  gap-5 "
            >
              <input
                required
                name="id"
                value={post.id}
                placeholder="Post Id..."
                className="outline-0 w-full bg-gray-500/20 rounded-md p-2 hidden"
              />
              <input
                required
                name="title"
                value={title}
                onChange={(e)=> setTitle(e.target.value)}
                placeholder="Post Title..."
                className="outline-0 w-full bg-gray-500/20 rounded-md p-2"
              />
              <textarea
                required
                name="content"
                value={content}
                onChange={(e)=> setContent(e.target.value)}
                placeholder="Post Content..."
                className="outline-0 w-full h-30 bg-gray-500/20 rounded-md p-2"
              ></textarea>
              <div className="flex justify-between ">
                <button
                  onClick={handleCloseNewPostForm}
                  type="button"
                  className="px-5 py-1 font-bold  text-gray-500"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-1 font-bold text-sky-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </dialog>
        </>
      )}{" "}
    </>
  );
}
