import { useEffect, useState } from "react";
import { HeartIcon, SpinnerIcon } from "./icons";
import "./styles.css";

export default function App() {
  // like / unlike
  const [status, setStatus] = useState("unlike");
  const [isLoading, setLoading] = useState(false);

  const toggleLikeStatus = async (action) => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://questions.greatfrontend.com/api/questions/like-button",
        {
          method: "POST",
          headers: {
            "Content-Type": "json",
          },
          body: JSON.stringify({
            action,
          }),
        },
      );
      console.log(res);
      setStatus(action);
    } catch (err) {}
    setLoading(false);
  };

  console.log(status, isLoading);

  const onLikeClick = async () => {
    await toggleLikeStatus(status === "like" ? "unlike" : "like");
  };

  return (
    <>
      <div>
        <button className={"default"}>
          <HeartIcon /> Like
        </button>
        <button className={"default liked"}>
          <HeartIcon /> Like
        </button>
        <button className="default loading">
          <SpinnerIcon /> Like
        </button>
        <button className="default liked loading">
          <SpinnerIcon /> Like
        </button>
      </div>
      <div>
        <button
          className={`default ${status === "like" ? "liked" : null} ${isLoading ? "loading" : null}`}
          onClick={onLikeClick}
        >
          {isLoading ? <SpinnerIcon /> : <HeartIcon />} Like
        </button>
      </div>
    </>
  );
}
