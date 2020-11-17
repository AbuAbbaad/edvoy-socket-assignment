import React from "react";
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute(props) {
  const { component: Component, ...rest } = props;
  const user = sessionStorage.getItem("user");
  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <Route {...rest}>
      <Component me={JSON.parse(user)} />
    </Route>
  );
}

export default ProtectedRoute;
