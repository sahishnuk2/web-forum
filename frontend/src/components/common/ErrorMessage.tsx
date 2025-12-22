import { Alert } from "@mui/material";

interface ErrorMessageProp {
  error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProp) {
  return (
    <Alert
      variant="outlined"
      severity="error"
      sx={{
        color: "red",
        borderColor: "red",
        mb: 1,
        "& .MuiAlert-icon": {
          color: "red",
        },
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      {error}
    </Alert>
  );
}
