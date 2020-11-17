import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import Menu from "./Menu";

const REMOVE_USER_MUTATION = gql`
  mutation RemoveUser($userId: ID!) {
    removeUser(userId: $userId)
  }
`;

const Layout = (props) => {
  const [removeUser] = useMutation(REMOVE_USER_MUTATION);

  useEffect(() => {
    function unloadUser() {
      const userJSON = sessionStorage.getItem("user");
      if (!userJSON) return;
      const user = JSON.parse(userJSON);
      removeUser({
        variables: {
          userId: user.id,
        },
        update: () => {
          sessionStorage.removeItem("user");
        },
      });
    }

    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      return unloadUser();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="menu-layout bg-green-500 min-h-screen min-w-full">
      <Menu>{props.children}</Menu>
    </div>
  );
};

export default Layout;
