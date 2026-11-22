import mainApi from "../APIs.jsx";
import Button from "./Button.jsx";
export default function DeleteModal({openDeleteModal,setOpenDeleteModal,post,setStateMessage,setMessageStatus,setStatusText,setOpenMessageModal,setState}) {
    const handleCloseModal = () => {
        setOpenDeleteModal(false)
    }
     const handleDelete = async ()=> {
      try {
      const response = await mainApi.delete(`/posts/${post.id}`);
      setStateMessage(`Post Deleted Succesfully`);
      setMessageStatus(response.status);
      setStatusText(response.statusText);
      setOpenDeleteModal(false);
      setOpenMessageModal(true);
      window.location = "/"
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
      setOpenDeleteModal(false);
      setOpenMessageModal(true);

      console.log(error.response || error.request || error.message);
    }
     }
  return (
    <>
      {openDeleteModal && (
        <dialog
          open
          className=" w-[75%] md:max-w-150 m-auto rounded-sm border border-red-500  mt-0.4 z-999 bg-gray-200 backdrop-blur-lg absolute left-0 top-0"
        >
          <div className="text-lg w-full bg-red-200 border-b-2 border-red-600 rounded-y-sm flex justify-between p-1.5 ">
            <p>Delete Post</p>
          </div>
          <p className="text-xl font-medium font-sans text-gray-900">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="w-full flex justify-between">
            {" "}
            <Button
              onClick={handleCloseModal}
              className="px-5 py-1 text-gray-700 font-bold mt-3 "
            >
              Close
            </Button>
            <Button
              onClick={handleDelete}
              className="px-5 py-1 text-gray-700 font-bold mt-3 "
            >
              Delete
            </Button>
          </div>
        </dialog>
      )}
    </>
  );
}
