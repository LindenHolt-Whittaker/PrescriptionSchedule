import { NavLink, useLocation } from "react-router-dom";
import { useScheduleKeyNav } from "../hooks/useScheduleKeyNav";
import "./Header.scss";

const Header = () => {
  const location = useLocation();
  const { scheduleKey, setScheduleKey, onKeySearch } = useScheduleKeyNav();

  const isHomePage = location.pathname === "/";

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
          onSubmit={onKeySearch}
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