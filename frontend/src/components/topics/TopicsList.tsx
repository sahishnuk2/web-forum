import { fetchTopics } from "../../services/api";
import type { Topic } from "../../types";
import TopicCard from "./TopicCard";
import { useEffect, useState } from "react";

function TopicsList() {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    fetchTopics()
      .then((data) => setTopics(data))
      .catch((error) => console.error("Error fetching topics:", error));
  }, []);

  return (
    <div>
      <h1>Topics</h1>
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          id={topic.id}
          title={topic.title}
          created_by={topic.created_by}
          created_at={topic.created_at}
        />
      ))}
    </div>
  );
}

export default TopicsList;
