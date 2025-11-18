import { useEffect, useState } from "react";
import "./FieldError.scss";

const nonBreakingSpace = "\u00A0";

const FieldError = ({ children }: { children?: string }) => {
  const [displayedMessage, setDisplayedMessage] = useState(
    children || nonBreakingSpace
  );
  const [isVisible, setIsVisible] = useState(!!children);

  useEffect(() => {
    if (children) {
      if (displayedMessage !== nonBreakingSpace && displayedMessage !== children) {
        // Transitioning between error message states
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsVisible(false);
        const timeout = setTimeout(() => {
          setDisplayedMessage(children);
          setIsVisible(true);
        }, 100); // Half the transition time for a quick crossfade
        return () => clearTimeout(timeout);
      } else {
        // New error or same error
        setIsVisible(true);
        setDisplayedMessage(children);
      }
    } else {
      // Error cleared
      setIsVisible(false);
      const timeout = setTimeout(() => {
        setDisplayedMessage(nonBreakingSpace);
      // Setting timeout to same length as transition duration in scss
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [children, displayedMessage]);

  return (
    <div className={`FieldError ${!isVisible ? "FieldError--hidden" : ""}`}>
      <div className="FieldError__message">{displayedMessage}</div>
    </div>
  );
};

export default FieldError;
