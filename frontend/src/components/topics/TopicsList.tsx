import { useNavigate } from "react-router-dom";
import { fetchTopics } from "../../services/api";
import type { Topic } from "../../types";
import ErrorMessage from "../common/ErrorMessage";
import { handleApiError } from "../common/Functions";
import TopicCard from "./TopicCard";
import { useEffect, useState } from "react";
import { Box, CircularProgress, TextField } from "@mui/material";

function TopicsList() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredTopics = [...topics].filter((topic) => {
    return topic.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 2,
              paddingRight: 2,
            }}
          >
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#006f80",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#005f6e",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#006f80",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "white",
                },
              }}
            />
          </Box>
          {filteredTopics.length === 0 ? (
            <p>No topics yet</p>
          ) : (
            filteredTopics.map((topic) => (
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
