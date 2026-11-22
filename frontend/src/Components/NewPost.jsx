import { useRef } from "react";
import mainApi from "../APIs";

export default function DataPopup({
  newPostModalOpen,
  setStateMessage,
  setState,
  setnewPostModalOpen,
  setOpenMessageModal,
  setMessageStatus,
  setStatusText,
}) {
  const newPost = useRef(null);
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(newPost.current);
    const postData = Object.fromEntries(formData.entries());
    postData.user_id = 3;

    try {
      const response = await mainApi.post("/posts", postData);
      setStateMessage(`Post ${response.statusText} Succesfully`);
      setMessageStatus(response.status);
      setStatusText(response.statusText);
      setnewPostModalOpen(false);
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
      setnewPostModalOpen(false);
      setOpenMessageModal(true);

      console.log(error.response || error.request || error.message);
    }
  }
  const handleCloseNewPostForm = () => {
    setnewPostModalOpen(false);
  };
  return (
    <>
      {" "}
      {newPostModalOpen && (
        <>
          <dialog
            open
            className="flex flex-col justify-center bg-slate-500 items-center w-[80%] m-auto md:max-w-180 rounded-lg border border-blue-500 p-2 mt-5 z-999 backdrop-blur-lg"
          >
            <p className="font-bold underline text-gray-900/60">
              Create New Post
            </p>
            <form
              onSubmit={handleSubmit}
              ref={newPost}
              className="w-[90%] flex flex-col  gap-5 "
            >
              <input
                required
                name="title"
                placeholder="Post Title..."
                className="outline-0 w-full bg-gray-200 rounded-md p-2"
              />
              <textarea
                required
                name="content"
                placeholder="Post Content..."
                className="outline-0 w-full h-30 bg-gray-200 rounded-md p-2"
              ></textarea>
              <div className="flex justify-between ">
                <button
                  onClick={handleCloseNewPostForm}
                  type="button"
                  className="px-5 py-1 font-bold  text-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1 font-bold text-sky-900 bg-sky-500 rounded-md"
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
