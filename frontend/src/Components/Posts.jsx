import mainApi from "../APIs.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function getPosts() {
            try {
                const response = await mainApi.get("/");
                console.log(response.data);
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
            <div>
                {loading ? (
                    <p className="bg-sky-400 rounded-lg animate-pulse p-2 m-2">
                        Loading...
                    </p>
                ) : (
                    <div className=" flex flex-col gap-2 p-2">
                        {posts.map(post => {
                            return (
                                <div
                                    className="bg-gray-200 rounded-lg p-2"
                                    key={post.id}
                                >
                                    <div className="flex justify-between">
                                        <div className="flex justify-baseline gap-0.5 flex-col">
                                            <Link to={`/posts/${post.id}`}>
                                                {" "}
                                                <p className="font-medium text-blue-500">
                                                    {post.title}
                                                </p>
                                            </Link>
                                            <p className="text-xs text-gray-700 underline">
                                                {post.author}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-700">
                                            {post.date_posted}
                                        </p>
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
