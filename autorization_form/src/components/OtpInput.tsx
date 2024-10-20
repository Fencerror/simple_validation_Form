import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface FormData {
  phone: string;
  otp: string;
}

interface OtpInputProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const OtpInput: React.FC<OtpInputProps> = ({ register, errors }) => (
  <div>
    <input
      id="otp"
      type="text"
      placeholder="Код подтверждения"
      {...register('otp', {
        required: 'Код должен содержать 6 цифр',
        pattern: {
          value: /^[0-9]{6}$/,
          message: 'Код должен содержать 6 цифр.',
        },
      })}
      className={errors.otp ? 'input-error' : ''}
    />
    {errors.otp && <p className="error-message">{errors.otp.message}</p>}
  </div>
);

export default OtpInput;
