import mainApi from "../APIs.jsx";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import Button from "./Button.jsx";
import Error from "./Error.jsx";

export default function Posts() {
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const { post_id } = useParams();
    const [error, setError] = useState(null);
    useEffect(() => {
        async function getPosts() {
            try {
                setLoading(true);
                setError(null);
                const response = await mainApi.get(`/${post_id}`);
                console.log(response.data);
                setPost(response.data);
            } catch (error) {
                const detail = error.response?.data?.detail;

                const message = Array.isArray(detail)
                    ? detail.map(item => item.msg).join(", ")
                    : typeof detail === "string"
                      ? detail
                      : "Something went wrong.";

                setError({
                    status: error.response?.status || 500,
                    message
                });
            } finally {
                setLoading(false);
            }
        }
        getPosts();
    }, []);

    function handleBack() {
        window.location = "/";
    }

    if (error) {
        return <Error status={error.status} message={error.message} />;
    }

    return (
        <>
            <div>
                {loading ? (
                    <p className="bg-gray-400 rounded-lg animate-pulse p-2 m-2">
                        Loading...
                    </p>
                ) : (
                    <div className=" flex flex-col gap-2 p-2">
                        <div
                            className="bg-gray-200 rounded-lg p-2"
                            key={post.id}
                        >
                            <div className="flex justify-between">
                                <div className="flex justify-baseline gap-0.5 flex-col">
                                    <p className="font-medium text-blue-500">
                                        {post.title}
                                    </p>
                                    <p className="text-xs text-gray-700 underline">
                                        {post.author}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-700">
                                    {post.date_posted}
                                </p>
                            </div>
                            <p className="mt-2 text-sm ">{post.content}</p>
                            <div className="mt-5 flex justify-between">
                                <Button
                                    onClick={handleBack}
                                    className="px-5 py-1 text-black font-bold "
                                >
                                    Back
                                </Button>
                                <div className="flex gap-2 items-center">
                                    <Button className="px-5 py-1 font-bold text-sky-500 ">
                                        Edit
                                    </Button>
                                    <Button className="font-bold px-5 py-1 text-red-500 ">
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
