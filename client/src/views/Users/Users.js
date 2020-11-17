import {
  gql,
  useApolloClient,
  useQuery,
  useSubscription,
} from "@apollo/client";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const USERS_QUERY = gql`
  query Users {
    users {
      id
      name
    }
  }
`;

const USER_ADD_SUBSCRIPTION = gql`
  subscription UserAdded {
    userAdded {
      id
      name
    }
  }
`;

const USER_REMOVE_SUBSCRIPTION = gql`
  subscription UserRemoved {
    userRemoved
  }
`;

function useRemoveUser() {
  const apollo = useApolloClient();
  const { data, loading } = useSubscription(USER_REMOVE_SUBSCRIPTION);
  useEffect(() => {
    if (!loading && data?.userRemoved) {
      const { users: prevUsers } = apollo.readQuery({
        query: USERS_QUERY,
      });
      console.log("hey");
      apollo.writeQuery({
        query: USERS_QUERY,
        data: {
          users: prevUsers.filter((u) => u.id !== data.userRemoved),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.userRemoved, loading]);
  return null;
}

function Users(props) {
  const { data, error, loading, subscribeToMore } = useQuery(USERS_QUERY);

  if (loading) {
    return (
      <div className="bg-white rounded-bl-2xl rounded-tl-2xl h-screen grid place-items-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-bl-2xl rounded-tl-2xl h-screen grid place-items-center">
        {`Error! ${error.message}`}
      </div>
    );
  }

  const subscribeToNewUsers = () =>
    subscribeToMore({
      document: USER_ADD_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newUser = subscriptionData.data.userAdded;
        return {
          ...prev,
          users: [...prev.users, newUser],
        };
      },
    });

  return (
    <div className="bg-white rounded-bl-2xl rounded-tl-2xl overflow-y-auto h-screen p-5">
      <h1 className="font-bold text-gray-700 mb-4 uppercase">Online users</h1>
      <ol className="list-decimal pl-5">
        <UsersList
          users={data.users}
          subscribeToNewUsers={subscribeToNewUsers}
          {...props}
        />
      </ol>
    </div>
  );
}

function UsersList(props) {
  const { users, subscribeToNewUsers, me } = props;
  useRemoveUser();
  useEffect(() => {
    const unsubscribe = subscribeToNewUsers();
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {users.map((user) => {
        return (
          <li key={user.id}>
            <Link
              to={`/user/${user.id}-${user.name.replace(/\s+/g, "_")}`}
              className="text-green-500"
            >
              {`${user.name}`}
              <span className="text-sm ml-1 text-gray-700">
                {me.id === user.id ? "(You)" : null}
              </span>
            </Link>
          </li>
        );
      })}
    </>
  );
}

export default Users;
