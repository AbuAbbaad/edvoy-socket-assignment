import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import cx from "classnames";

const MESSAGES_QUERY = gql`
  query Messages($userId: String!) {
    messages(userId: $userId) {
      id
      text
      time
      sender {
        id
      }
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($message: MessageInput!) {
    sendMessage(message: $message) {
      id
      text
      time
      sender {
        id
      }
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageSent($userId: String!) {
    messageSent(userId: $userId) {
      id
      text
      sender {
        id
      }
    }
  }
`;

function Conversation(props) {
  const { user } = useParams();

  const userName = user
    .substr(user.lastIndexOf("-") + 1, user.length)
    .replace(/_/g, " ");

  const userId = user.replace("-" + userName, "");

  return <Messages user={{ userId, userName }} {...props} />;
}

function Messages(props) {
  const {
    user: { userId, userName },
    ...otherProps
  } = props;

  const messageListContainer = useRef(null);

  const { data, loading, error, subscribeToMore } = useQuery(MESSAGES_QUERY, {
    variables: {
      userId,
    },
  });

  useEffect(() => {
    if (messageListContainer && messageListContainer.current) {
      messageListContainer.current.scrollTop =
        messageListContainer.current.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  if (loading) return <p className="animate-spin">☢️</p>;
  if (error) return `Error! ${error.message}`;

  const subscribeToNewMessages = () =>
    subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: {
        userId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.messageSent;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
        };
      },
    });

  return (
    <div
      className="bg-white rounded-bl-2xl rounded-tl-2xl overflow-auto conversation-layout overflow-y-auto h-screen"
      style={{
        boxShadow:
          "-10px 0 15px -3px rgba(0, 0, 0, 0.1), -4px 0 6px -2px rgba(225, 225, 225, 0.05)",
      }}
      ref={messageListContainer}
    >
      <ConversationHeader user={{ userId, userName }} />
      <ConversationMessages
        messages={data.messages}
        userId={userId}
        subscribeToNewMessages={subscribeToNewMessages}
        {...otherProps}
      />
      <ConversationFooter user={{ userId, userName }} {...otherProps} />
    </div>
  );
}

export default Conversation;

function ConversationMessages(props) {
  const { messages, subscribeToNewMessages, me, userId } = props;
  useEffect(() => {
    // do not subscribe if am mesgsing myself.
    if (me.id !== userId) {
      const unsubscribe = subscribeToNewMessages();

      return unsubscribe;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col justify-end px-6 gap-2">
      {messages.map((msg) => {
        const mine = msg.sender.id === me.id;
        return (
          <div
            className={cx("px-4 py-1 rounded-3xl border border-solid", {
              "bg-white": mine,
              "border-green-500": !mine,
              "bg-green-500": !mine,
              "text-gray-800": mine,
              "border-gray-300": mine,
              "text-white": !mine,
              "self-end": mine,
              "self-start": !mine,
            })}
            key={msg.id}
          >
            {msg.text}
          </div>
        );
      })}
    </div>
  );
}

function ConversationHeader({ user }) {
  return (
    <div className="bg-white pt-3 px-6 sticky top-0">
      <div className="rounded-xl shadow-lg p-4 flex items-center gap-2">
        <div
          className="rounded-full text-lg uppercase text-green-600 font-semibold h-8 w-8 text-center border-2 border-green-600"
          style={{ lineHeight: "2rem" }}
          alt={user.userName}
        >
          {user.userName.charAt(0)}
        </div>
        <h1 className="text-lg font-semibold text-green-600 capitalize truncate">
          {user.userName}
        </h1>
      </div>
    </div>
  );
}

function ConversationFooter({ user, me }) {
  const [text, setText] = useState("");
  const [sendMessage, { loading: sending }] = useMutation(
    SEND_MESSAGE_MUTATION
  );

  const formSubmitRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await sendMessage({
        variables: {
          message: {
            text,
            receiver: {
              id: user.userId,
              name: user.userName,
            },
          },
        },
        optimisticResponse: {
          id: "fsdfsuyyenwbejwuefgeu-sdfsdf-bnnbbm",
          text,
          sender: {
            id: me.id,
          },
          __typename: "Message",
        },
        update: (cache, { data }) => {
          const newMessage = data?.sendMessage;
          const { messages } = cache.readQuery({
            query: MESSAGES_QUERY,
            variables: {
              userId: user.userId,
            },
          });
          cache.writeQuery({
            query: MESSAGES_QUERY,
            variables: {
              userId: user.userId,
            },
            data: {
              messages: [...messages, newMessage],
            },
          });
        },
      });
      setText("");
    } catch (error) {}
  };

  const keyDownHandler = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      if (formSubmitRef.current) {
        formSubmitRef.current.click();
      }
    }
  };

  return (
    <div className="bg-white pb-3 px-6 sticky bottom-0">
      <form
        className="rounded-xl shadow-lg flex items-end p-4 gap-4"
        onSubmit={handleSubmit}
      >
        <textarea
          className="flex-1 border-gray-100 resize-none p-2"
          placeholder="Enter your message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={keyDownHandler}
        />
        <button
          type="submit"
          className="bg-green-500 text-white rounded-2xl px-6 py-1 shadow"
          disabled={sending}
          ref={formSubmitRef}
        >
          Send
        </button>
      </form>
    </div>
  );
}
