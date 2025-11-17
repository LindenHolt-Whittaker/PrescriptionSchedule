import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Header.scss";

const Header = () => {
  const [scheduleKey, setScheduleKey] = useState<string>("");

  console.log(scheduleKey);

  const navigate = useNavigate();

  // TODO: Actually implement. Currently mock implementation
  // for serialized schedule key in place of URL params, and better error page
  const onScheduleKeySubmit = () => {
    const isKeyValid = scheduleKey.length === 10;

    if (!isKeyValid) {
      navigate("/invalidSchedule");
      return;
    }

    navigate(`/schedule?${scheduleKey}`);
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

      <div className={`Header__scheduleKeyInput ${
            scheduleKey ? "Header__scheduleKeyInput--hasInput" : ""
          }`}>
        <input
          type="text"
          name="scheduleKey"
          placeholder="Enter Schedule Key ###"
          onChange={(e) => setScheduleKey(e.target.value)}
        />
        <button onClick={onScheduleKeySubmit}>➜</button>
      </div>
    </div>
  );
};

export default Header;
