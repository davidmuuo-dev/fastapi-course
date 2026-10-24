import mainApi from "../APIs.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Spinner from "../assets/spinner.svg";
export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function getPosts() {
            try {
                const response = await mainApi.get("/");
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                console.log("Request complete");
            }
        }
        getPosts();
    }, []);
    return (
        <>
            <div className="relative">
                {loading ? (
                    <div className="flex items-start justify-center min-h-screen w-full">
                        <svg
                            className="fill-sky-500 text-5xl w-12 h-12"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                                opacity=".25"
                            />
                            <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    dur="0.75s"
                                    values="0 12 12;360 12 12"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </svg>
                    </div>
                ) : (
                    <div className=" flex flex-col gap-2 p-2">
                        {posts.map(post => {
                            return (
                                <div
                                    className="bg-gray-200 backdrop-blur-xl rounded-lg p-2"
                                    key={post.id}
                                >
                                    <div>
                                        <img src={post.image_path} />
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex justify-baseline gap-0.5 flex-col">
                                            <Link to={`/posts/${post.id}`}>
                                                {" "}
                                                <p className="font-medium text-gray-900">
                                                    {post.title}
                                                </p>
                                            </Link>
                                            <p className="text-xs text-gray-900 underline">
                                                {post.author.username}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-xs text-gray-900">
                                                {new Date(
                                                    post.date_posted
                                                ).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-900">
                                                {new Date(
                                                    post.date_posted
                                                ).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm line-clamp-1">
                                        {post.content}
                                    </p>
                                </div>
                            );
                        })}{" "}
                    </div>
                )}
            </div>
        </>
    );
}
