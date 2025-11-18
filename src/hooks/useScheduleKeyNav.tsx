import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE62_REGEX = /^[0-9A-Za-z]+$/;

export const useScheduleKeyNav = () => {
  const [scheduleKey, setScheduleKey] = useState<string>("");
  const navigate = useNavigate();

  const handleScheduleKeyChange = (value: string) => {
    setScheduleKey(value);
  };

  const handleScheduleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scheduleKey.trim()) {
      navigate(`/schedule?k=${scheduleKey}`);
    }
  };

  return {
    scheduleKey,
    setScheduleKey: handleScheduleKeyChange,
    onKeySearch: handleScheduleKeySubmit,
    isKeyValid: scheduleKey.trim().length >= 6 && BASE62_REGEX.test(scheduleKey.trim()),
  };
};
