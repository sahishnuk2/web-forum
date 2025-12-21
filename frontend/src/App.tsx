import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import TopicsPage from "./pages/TopicsPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import CreateTopicPage from "./pages/CreateTopicPage";
import PostsPage from "./pages/PostsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        {/* Protected - need user authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topics/create" element={<CreateTopicPage />} />
          <Route path="/posts/:topic_id" element={<PostsPage />} />
        </Route>
        {/* Invalid Routes */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
