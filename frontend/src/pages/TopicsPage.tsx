import { useNavigate } from "react-router-dom";
import TopicsList from "../components/topics/TopicsList";
import "./TopicsPage.css";
import { Button } from "@mui/material";

function TopicsPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="top">
        <div style={{ flex: 1 }}></div>
        <h1>Topics</h1>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 10,
          }}
        >
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
      </div>
      <TopicsList></TopicsList>
    </>
  );
}

export default TopicsPage;
