import { useNavigate } from "react-router-dom";
import { fetchTopics } from "../../services/api";
import type { Topic } from "../../types";
import ErrorMessage from "../common/ErrorMessage";
import { handleApiError } from "../common/Functions";
import TopicCard from "./TopicCard";
import { useEffect, useState } from "react";

function TopicsList() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics()
      .then((data) => setTopics(data))
      .catch((err) => {
        const errorMessage = handleApiError(err, navigate);
        if (errorMessage) {
          setError(errorMessage);
        }
      });
  }, []);

  return (
    <div>
      {error && <ErrorMessage error={error} />}
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
