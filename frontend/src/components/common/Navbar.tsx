import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { getCurrentUsername } from "./Functions";
import AdbIcon from "@mui/icons-material/Adb";
import { logOut } from "../../services/api";

export default function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    if (!window.confirm("Are you sure you want to logout")) {
      return;
    }
    try {
      await logOut();
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#006f80" }}>
        <Toolbar disableGutters sx={{ pr: 2 }}>
          <Box
            onClick={() => navigate("/topics")}
            sx={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              mr: 2,
              cursor: "pointer",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              padding: 2,
            }}
          >
            <AdbIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              FORUM
            </Typography>
          </Box>

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: "left",
              marginLeft: 0,
              marginTop: 0.2,
            }}
          >
            {getCurrentUsername()}
          </Typography>
          <Button color="inherit" onClick={handleLogout} sx={{ padding: 2 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
