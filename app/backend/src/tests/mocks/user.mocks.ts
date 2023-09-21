const mockValidUser = {
  id: 1,
  email: 'user@user.com',
  password: '12345678',
  username: 'user',
  role: 'admin',
};

const invalidErrorMsg = { message: 'Invalid email or password' };

const missingErrorMsg = { message: 'All fields must be filled' };

export { mockValidUser, invalidErrorMsg, missingErrorMsg };
