import type { Topic } from "../../types";
import TopicCard from "./TopicCard";

function TopicsList() {
  const topics: Topic[] = [
    {
      id: 1,
      title: "Java",
      created_by: 1,
      created_at: "2024-01-01T10:00:00Z",
    },
    {
      id: 2,
      title: "JavaScript",
      created_by: 2,
      created_at: "2024-01-02T14:30:00Z",
    },
    {
      id: 3,
      title: "Go",
      created_by: 1,
      created_at: "2024-01-03T09:15:00Z",
    },
    {
      id: 4,
      title: "Python",
      created_by: 3,
      created_at: "2024-01-04T16:45:00Z",
    },
  ];

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
