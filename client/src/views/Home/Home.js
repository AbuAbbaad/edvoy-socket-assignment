import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import cx from "classnames";
import { useHistory } from "react-router-dom";

const ADD_USER_MUTATION = gql`
  mutation AddUser($user: UserInput) {
    addUser(user: $user) {
      id
      name
    }
  }
`;

function Home() {
  const history = useHistory();
  const [addUser, { loading: adding }] = useMutation(ADD_USER_MUTATION);
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addUser({
        variables: {
          user: { name: username },
        },
      });
      const newUser = response.data?.addUser;
      if (!newUser) throw new Error("Something went wrong");
      sessionStorage.setItem("user", JSON.stringify(newUser));
      history.push("/dashboard");
    } catch (error) {}
  };

  const disabled = adding || !username;

  return (
    <div className="bg-white rounded-bl-2xl rounded-tl-2xl h-screen flex flex-col items-center justify-center gap-2">
      <p className="text-gray-700 text-2xl">
        Hey there! Please introduce yourself...
      </p>
      <form className="flex items-center gap-4" onSubmit={handleSubmit}>
        <input
          autoFocus={true}
          placeholder="Your good name?"
          className="text-2xl text-gray-700"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          type="submit"
          className={cx(
            "bg-white text-green-500 rounded-2xl py-1 hover:bg-green-500 hover:text-white w-24",
            {
              "pointer-events-none opacity-50 text-3xl": disabled,
              "pointer-events-auto shadow transition duration-300 ease-in-out": !disabled,
            }
          )}
          disabled={disabled}
        >
          {!username ? "🤔" : "Let's Go"}
        </button>
      </form>
    </div>
  );
}

export default Home;
