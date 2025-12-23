import { useNavigate } from "react-router-dom";
import TopicsList from "../components/topics/TopicsList";
import "./TopicsPage.css";
import { Button } from "@mui/material";

function TopicsPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="top">
        <Button disabled></Button>
        {/* Above button is just for spacing */}
        <h1>Topics</h1>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate("create")}
          sx={{
            margin: 1,
            backgroundColor: "#006f80",
            "&:hover": { backgroundColor: "#005f6e" },
          }}
        >
          New Topic
        </Button>
      </div>
      <TopicsList></TopicsList>
    </>
  );
}

export default TopicsPage;
