import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoginForm from '../src/components/LoginForm';
import { AuthProvider } from '../src/context/AuthContext';

it('renders login and accepts input', () => {
  const { getByLabelText, getByText } = render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );

  const email = getByLabelText(/email/i) as HTMLInputElement;
  const pass = getByLabelText(/password/i) as HTMLInputElement;
  fireEvent.change(email, { target: { value: 'a@b.com' } });
  fireEvent.change(pass, { target: { value: '123456' } });
  expect(email.value).toBe('a@b.com');
  expect(pass.value).toBe('123456');

  const button = getByText(/entrar/i);
  fireEvent.click(button);
});
