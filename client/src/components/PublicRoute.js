import React from "react";
import { Redirect, Route } from "react-router-dom";

function PublicRoute(props) {
  const user = sessionStorage.getItem("user");
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return <Route {...props} />;
}

export default PublicRoute;
