import { HiOutlineChatAlt2, HiOutlineUserCircle } from "react-icons/hi";
import { Link, useHistory } from "react-router-dom";

function Menu(props) {
  const history = useHistory();
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    history.push("/");
  };
  return (
    <>
      <aside className="flex flex-col items-center justify-between bg-green-500 shadow-sm py-4">
        <Link to="/">
          <HiOutlineChatAlt2 color="#fff" size={40} />
        </Link>
        <div className="text-2xl uppercase text-white transform -rotate-90">
          dasher
        </div>
        <button onClick={handleLogout} className="bg-green-100 rounded-full">
          <HiOutlineUserCircle className="text-green-500" size={25} />
        </button>
      </aside>
      {props.children}
    </>
  );
}

export default Menu;
