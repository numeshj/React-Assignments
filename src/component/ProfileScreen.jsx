import { use } from "react";

export default function ProfileScreen({ user, success, handleLogout }) {
  return (
    <>
      {success && <pre className="asg10-success">{success}</pre>}

      <div className="user-profile">
        <h3>{user.name}</h3>
        <p>{user.description}</p>
        {user.avatar && (
          <img
            src={user.avatar}
            alt="Profile"
            style={{ width: "100px", borderRadius: "50%" }}
          />
        )}
      </div>

      <button className="btn-logout" type="button" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
}
