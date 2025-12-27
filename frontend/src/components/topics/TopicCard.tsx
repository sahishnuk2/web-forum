import { useNavigate } from "react-router-dom";
import type { Topic } from "../../types";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

function TopicCard({ id, title }: Topic) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        maxWidth: 800,
        width: "75%",
        margin: "16px auto",
        backgroundColor: "inherit",
        color: "inherit",
        boxShadow: 6,
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        border: "1px solid transparent",
        transition: "border-color 0.2s ease",
        "&:hover": {
          borderColor: "#006f80",
        },
      }}
    >
      <CardContent>
        <Typography variant="h5" sx={{ textAlign: "left" }}>
          {title}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="text"
          size="small"
          onClick={() => navigate(`/topics/${id}`)}
          sx={{ color: "#006f80" }}
        >
          See Posts
        </Button>
      </CardActions>
    </Card>
  );
}

export default TopicCard;
