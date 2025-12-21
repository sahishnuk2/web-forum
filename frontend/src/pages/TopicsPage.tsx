import { useNavigate } from "react-router-dom";
import TopicsList from "../components/topics/TopicsList";
import "./TopicsPage.css";

function TopicsPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="top">
        <h1>Topics</h1>
        <button onClick={() => navigate("create")}>New Topic</button>
      </div>
      <TopicsList></TopicsList>
    </>
  );
}

export default TopicsPage;
