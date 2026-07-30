import { Link } from "react-router-dom";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.hash = "#/login";
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#1f2937",
        color: "white",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            marginRight: "2rem",
          }}
        >
          NeoCare Health
        </h2>

        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Board
        </Link>

        <Link
          to="/my-hours"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          My Hours
        </Link>

        <Link
          to="/reports"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Reports
        </Link>
      </div>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "0.6rem 1rem",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;