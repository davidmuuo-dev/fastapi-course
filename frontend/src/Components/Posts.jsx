import mainApi from "../APIs.jsx";
import { useEffect, useState } from "react";

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
                                    <div>
                                        <p>{post.title}</p>
                                        <p>{post.author}</p>
                                    </div>
                                    <p>{post.content}</p>
                                </div>
                            );
                        })}{" "}
                    </div>
                )}
            </div>
        </>
    );
}
