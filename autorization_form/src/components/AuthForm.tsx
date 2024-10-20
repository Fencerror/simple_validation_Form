import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PhoneInput from './PhoneInput';
import OtpInput from './OtpInput';
import ResendTimer from './ResendTimer';
import './AuthForm.css';

// Интерфейс для данных формы
interface FormData {
  phone: string;
  otp: string;
}

const AuthForm: React.FC = () => {
  // Состояния для управления формой и ошибками
  const [otpRequested, setOtpRequested] = useState(false); // Флаг, указывающий, был ли запрошен OTP
  const [errorMessage, setErrorMessage] = useState(''); // Сообщение об ошибке
  const [initialTime] = useState(30); // Начальное время для таймера повторной отправки OTP
  const [, setAuthToken] = useState<string | null>(null); // Хранит токен авторизации (пока не используется)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!otpRequested) {
      // Запрос на получение OTP
      try {
        const response = await fetch('https://shift-backend.onrender.com/auth/otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: data.phone }),
        });

        if (response.ok) {
          setOtpRequested(true); // Устанавливаем флаг, что OTP был запрошен
          setErrorMessage(''); // Очищаем сообщение об ошибке
        } else {
          setErrorMessage('Ошибка отправки кода. Попробуйте снова.'); // Устанавливаем сообщение об ошибке
        }
      } catch (error) {
        setErrorMessage('Ошибка отправки кода. Попробуйте снова.'); // Обработка ошибок сети
      }
    } else {
      // Запрос на авторизацию пользователя
      try {
        const response = await fetch('https://shift-backend.onrender.com/users/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: data.phone, code: data.otp }), // Используем код OTP для авторизации
        });

        if (response.ok) {
          const userData = await response.json();
          setAuthToken(userData.token); // Сохраняем токен после успешной авторизации
          setErrorMessage(''); // Очищаем сообщение об ошибке
          console.log('Авторизация успешна:', userData);

          // После успешной авторизации запрашиваем данные о сессии
          await getSession(userData.token);
        } else {
          setErrorMessage('Ошибка авторизации. Проверьте код и попробуйте снова.'); // Сообщение об ошибке авторизации
        }
      } catch (error) {
        setErrorMessage('Ошибка авторизации. Попробуйте снова.'); // Обработка ошибок сети
      }
    }
  };

  // Функция для получения данных о сессии пользователя
  const getSession = async (token: any) => {
    try {
      const authToken = localStorage.getItem('authToken'); // Получаем токен из локального хранилища
      const response = await fetch('https://shift-backend.onrender.com/users/session', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`, // Используем токен для авторизации
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json(); // Получаем данные пользователя
        console.log('Данные пользователя:', userData);
        // Здесь можно сохранить данные пользователя в состоянии или перенаправить его
      } else {
        console.error('Ошибка при получении сессии.'); // Логируем ошибку
      }
    } catch (error) {
      console.error('Ошибка сети при получении сессии:', error); // Логируем ошибку сети
    }
  };

  // Функция для повторной отправки кода OTP
  const handleResend = async (phone: string) => {
    try {
      const response = await fetch('https://shift-backend.onrender.com/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }), // Отправляем запрос на повторную отправку кода
      });

      if (response.ok) {
        setErrorMessage(''); // Очищаем сообщение об ошибке
        setOtpRequested(true); // Ставим флаг, что OTP был запрошен
        console.log('Код подтверждения отправлен повторно.'); // Логируем успешную отправку
        setValue('otp', ''); // Очищаем поле ввода OTP
      } else {
        setErrorMessage('Ошибка при повторной отправке кода. Попробуйте снова.'); // Сообщение об ошибке
      }
    } catch (error) {
      setErrorMessage('Ошибка при повторной отправке кода. Попробуйте снова.'); // Обработка ошибок сети
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Вход</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <div className="form-group">
          <PhoneInput register={register} errors={errors} disabled={otpRequested} />
        </div>

        {otpRequested && (
          <div className="form-group">
            <OtpInput register={register} errors={errors} />
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Отображаем сообщение об ошибке */}

        <button type="submit" className="submit-button">
          {otpRequested ? 'Войти' : 'Продолжить'} {/* Изменяем текст кнопки в зависимости от состояния */}
        </button>

        {otpRequested && (
          <ResendTimer
            onResend={() => handleResend('89990009999')} // Повторная отправка кода по номеру телефона
            initialTime={initialTime} // Начальное время для таймера
          />
        )}
      </form>
    </div>
  );
};

export default AuthForm;
