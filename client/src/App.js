import { BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./views/Home/Home";
import Conversation from "./views/Conversation/Conversation";
import "./app.css";
import Users from "./views/Users/Users";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <ProtectedRoute exact path="/user/:user" component={Conversation} />
          <ProtectedRoute exact path="/dashboard" component={Users} />
          <PublicRoute path="/" component={Home} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
