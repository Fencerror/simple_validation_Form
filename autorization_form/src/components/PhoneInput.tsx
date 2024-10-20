import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface FormData {
  phone: string;
  otp: string;
}

interface PhoneInputProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  disabled? : boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ register, errors, disabled }) => (
  <div>
    <p className="phone">Введите номер телефона для входа<br/> в личный кабинет</p>
    <input
      id="phone"
      type="text"
      placeholder="Телефон"
      {...register('phone', {
        required: 'Поле является обязательным',
        pattern: {
          value: /^(\+7|8)\d{10}$/,
          message: 'Не можем ввести.',
        },
      })}
      className={errors.phone ? 'input-error' : ''}
      disabled={disabled}
    />
    {errors.phone && <p className="error-message">{errors.phone.message}</p>}
  </div>
);

export default PhoneInput;
