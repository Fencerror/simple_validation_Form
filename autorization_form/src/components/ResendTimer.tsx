import React, { useEffect, useState } from "react";

interface ResendTimerProps{
  onResend: () => void; //Функция для повторной отправки кода.
  initialTime: number; //Время в секундах для таймера.
}

const ResendTimer: React.FC<ResendTimerProps> = ({onResend, initialTime}) => {
  const[timeLeft, setTimeLeft] = useState(initialTime);
  const [isTimerActive, setIsTimerActive] = useState (true);

  useEffect(() => {
    if (isTimerActive && timeLeft>0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime-1);
      }, 1000)
      return () => clearInterval(timer);
    }
    else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
  }, [isTimerActive, timeLeft]);

  const handleResend = () => {
    onResend(); //Вызываем функцию для повторной отправки кода
    setTimeLeft(initialTime); //Сбрасываем таймер
    setIsTimerActive(true); // Перезапускаем таймер
  };

  return (
    <div className="resend-timer">
      {isTimerActive ? (
        <p className="resend-label">Запросить код повторно можно через {timeLeft} секунд.</p>
      ): (
        <button onClick={handleResend} className="resend-button">
          Отправить код ещё раз
        </button>
      )}
    </div>
  );
};

export default ResendTimer;