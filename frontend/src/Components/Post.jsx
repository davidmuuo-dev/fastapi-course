import mainApi from "../APIs.jsx";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import Button from "./Button.jsx";

export default function Posts() {
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const { post_id } = useParams();
    useEffect(() => {
        async function getPosts() {
            try {
                const response = await mainApi.get(`/${post_id}`);
                console.log(response.data);
                setPost(response.data);
            } catch (error) {
                console.error(error);
                console.log(error.response?.data);
            } finally {
                setLoading(false);
                console.log("Request complete");
            }
        }
        getPosts();
    }, []);

    function handleBack() {
        window.location = "/";
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
                                    <Button className="font-bold px-5 py-1 text-red-500 text-black">
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
