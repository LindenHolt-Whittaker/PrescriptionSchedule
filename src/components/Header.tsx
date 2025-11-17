import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Header.scss";

const Header = () => {
  const [scheduleKey, setScheduleKey] = useState<string>("");

  console.log(scheduleKey);

  const navigate = useNavigate();

  const onScheduleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    navigate(`/schedule?k=${scheduleKey}`);
  };

  return (
    <div className="Header">
      <div className="Header__linkGroup">
        <NavLink to="/" className="Header__link">
          Home
        </NavLink>
        <NavLink to="/onboarding" className="Header__link">
          Schedule
        </NavLink>
      </div>

      <form
        onSubmit={onScheduleKeySubmit}
        className={`Header__scheduleKey ${
          scheduleKey ? "Header__scheduleKey--hasInput" : ""
        }`}
      >
        <input
          className="Header__scheduleKey__input"
          type="text"
          name="scheduleKey"
          placeholder="Enter Schedule Key #"
          onChange={(e) => setScheduleKey(e.target.value)}
        />
        <button className="Header__scheduleKey__button" type="submit">
          ➜
        </button>
      </form>
    </div>
  );
};

export default Header;
