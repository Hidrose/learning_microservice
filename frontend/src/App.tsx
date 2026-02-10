import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import LayoutRoute from "./LayoutRoute";
function App() {
  return (
    <Router>
      <Toaster />
      <ScrollToTop />
      <LayoutRoute />
    </Router>
  );
}

export default App;
