import { useNavigate } from "react-router-dom";
import { fetchTopics } from "../../services/api";
import type { Topic } from "../../types";
import ErrorMessage from "../common/ErrorMessage";
import { handleApiError } from "../common/Functions";
import TopicCard from "./TopicCard";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

function TopicsList() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchTopics()
      .then((data) => setTopics(data))
      .catch((err) => {
        const errorMessage = handleApiError(err, navigate);
        if (errorMessage) {
          setError(errorMessage);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: "#006f80" }} />
          <p>Loading topics</p>
        </Box>
      ) : (
        <div>
          {error && <ErrorMessage error={error} />}
          {topics.length == 0 ? (
            <p>No topics yet</p>
          ) : (
            topics.map((topic) => (
              <TopicCard
                key={topic.id}
                id={topic.id}
                title={topic.title}
                created_by={topic.created_by}
                created_at={topic.created_at}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}

export default TopicsList;
