import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const menuItems = [
    { label: "Quiz Dashboard", path: "/adminPannel" },
    { label: "Add Question", path: "/adminPannel/addQuestion" },
    { label: "Edit Question", path: "/adminPannel/editQuestion" },
    { label: "Leadboard", path: "/adminPannel/leadboard" }
  ];

  return (
    <div className="bg-[rgba(0,0,0,0.5)] w-screen absolute top-0 flex justify-between items-center">
      <img
        src="/Codex-logo.png"
        alt="Codex Logo"
        className="p-[0.5rem] ml-[4rem] h-[4rem]"
      />

      <div className="flex gap-6 mr-6">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <p
              className={`adminNavbar ${
                location.pathname === item.path
                  ? "text-[#34d8e4] [text-shadow:_0_0_10px_#34d8e4]"
                  : "text-white"
              }`}
            >
              {item.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
