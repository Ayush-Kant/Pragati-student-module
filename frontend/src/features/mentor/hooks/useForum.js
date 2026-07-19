import { useState, useEffect, useMemo } from "react";
import { communicationService } from "../services/communicationService";

export default function useForum() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const data = await communicationService.getThreads(selectedCategory);
      setThreads(data);
      if (data && data.length > 0 && !activeThreadId) {
        // Set first thread as active initially
        setActiveThreadId(data[0].id);
      }
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch threads");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when category changes
  useEffect(() => {
    fetchThreads();
  }, [selectedCategory]);

  // Derived filtered threads for list
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      const matchesCategory =
        selectedCategory === "All" ||
        t.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [threads, selectedCategory, searchQuery]);

  // Derived currently active thread
  const activeThread = useMemo(() => {
    return threads.find((t) => t.id === activeThreadId) || null;
  }, [threads, activeThreadId]);

  const postReply = async (content, isAnonymous) => {
    if (!activeThreadId) return { success: false, error: "No active thread selected" };
    try {
      const replyData = {
        content,
        isAnonymous,
        author: isAnonymous ? "Anonymous Student" : "Dr. Jane Smith" // Mentor avatar/info
      };
      
      const newPost = await communicationService.postReply(activeThreadId, replyData);
      
      setThreads((prevThreads) =>
        prevThreads.map((t) => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              repliesCount: t.repliesCount + 1,
              posts: [...t.posts, newPost]
            };
          }
          return t;
        })
      );
      return { success: true };
    } catch (err) {
      console.error("Failed to post reply", err);
      return { success: false, error: err.message };
    }
  };

  const handleVote = (threadId, postId, direction) => {
    setThreads((prevThreads) =>
      prevThreads.map((t) => {
        if (t.id === threadId) {
          const updatedPosts = t.posts.map((p) => {
            if (p.id === postId) {
              let voteChange = 0;
              let newVoted = null;

              if (direction === "up") {
                if (p.voted === "up") {
                  voteChange = -1;
                  newVoted = null;
                } else if (p.voted === "down") {
                  voteChange = 2;
                  newVoted = "up";
                } else {
                  voteChange = 1;
                  newVoted = "up";
                }
              } else if (direction === "down") {
                if (p.voted === "down") {
                  voteChange = 1;
                  newVoted = null;
                } else if (p.voted === "up") {
                  voteChange = -2;
                  newVoted = "down";
                } else {
                  voteChange = -1;
                  newVoted = "down";
                }
              }

              return {
                ...p,
                votes: p.votes + voteChange,
                voted: newVoted
              };
            }
            return p;
          });
          return { ...t, posts: updatedPosts };
        }
        return t;
      })
    );
  };

  return {
    threads: filteredThreads,
    allThreads: threads,
    activeThread,
    activeThreadId,
    setActiveThreadId,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    postReply,
    handleVote,
    refresh: fetchThreads
  };
}
