"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.length === 0 ? (
        <div className="flex flex-row">
          <p className="desc text-center">No Prompts Available</p>
        </div>
      ) : (
        data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        ))
      )}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = async (value) => {
    try {
      const response = await fetch("/api/prompt/search", {
        method: "POST",
        body: JSON.stringify({
          searchText: value,
        }),
      });

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const delayedSearch = debounce(handleSearch, 1500);

  const handleSearchChange = (e) => {
    setSearchText(e.currentTarget.value);
    delayedSearch(e.currentTarget.value);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setSearchText("");
      const response = await fetch("/api/prompt", { cache: "no-store" });
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={posts}
        handleTagClick={(value) => {
          setSearchText(value);
          handleSearch(value);
        }}
      />
    </section>
  );
};

export default Feed;
