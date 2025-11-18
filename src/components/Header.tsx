import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Header.scss";

const Header = () => {
  const [scheduleKey, setScheduleKey] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const onScheduleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scheduleKey.trim()) {
      navigate(`/schedule?k=${scheduleKey}`);
    }
  };

  return (
    <div className="Header">
      <div className="Header__linkGroup">
        <NavLink to="/" className="Header__link">
          {({ isActive }) => (
            <span className={isActive ? "active" : ""}>Home</span>
          )}
        </NavLink>
        <NavLink to="/onboarding" className="Header__link">
          {({ isActive }) => (
            <span className={isActive ? "active" : ""}>Get Schedule</span>
          )}
        </NavLink>
      </div>

      {!isHomePage && (
        <form
          onSubmit={onScheduleKeySubmit}
          className={`Header__scheduleKey ${
            scheduleKey ? "Header__scheduleKey--hasInput" : ""
          }`}
        >
          <div className="Header__scheduleKeyInput">
            <span className="Header__scheduleKeyHash">#</span>
            <input
              type="text"
              name="scheduleKey"
              placeholder="Enter schedule key"
              value={scheduleKey}
              onChange={(e) => setScheduleKey(e.target.value)}
            />
          </div>
          <button className="Header__scheduleKeyButton" type="submit">
            ➜
          </button>
        </form>
      )}
    </div>
  );
};

export default Header;
