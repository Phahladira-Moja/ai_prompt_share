"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const Profiles = ({ params }) => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);

  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = posts.filter((p) => p._id !== post._id);

        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${params?.id}/posts`);
      const data = await response.json();
      setPosts(data);
    };

    if (session?.user.id) {
      fetchPosts();
    }
  }, [session?.user]);

  return (
    <Profile
      name={userName}
      desc={
        session?.user.id === params?.id
          ? `Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`
          : `Welcome to your personalized profile page. Explore exceptional prompts and be inspired by the power of their imagination`
      }
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};
export default Profiles;
