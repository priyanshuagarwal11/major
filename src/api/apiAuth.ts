export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export async function mockLogin(email: string, password: string): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (!email.trim() || !password.trim()) {
    throw new Error('Email and password are required.');
  }

  return {
    token: 'mock-jwt-token',
    user: {
      id: 'user-1',
      name: email.split('@')[0],
      email
    }
  };
}

export async function mockSignup(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (!name.trim() || !email.trim() || !password.trim()) {
    throw new Error('All fields are required.');
  }

  return {
    token: 'mock-jwt-token',
    user: {
      id: 'user-1',
      name,
      email
    }
  };
}