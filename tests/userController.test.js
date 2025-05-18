// tests/userController.test.js
const userController = require('../controllers/authController');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

jest.mock('../models/userModel');
jest.mock('jsonwebtoken');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('register - success', async () => {
    const req = {
      body: { name: 'Abdul', email: 'test@example.com', password: '123456' }
    };
    const res = mockRes();

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: 'user123', ...req.body });
    jwt.sign.mockReturnValue('fake-token');

    await userController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'fake-token' })
    );
  });

  test('login - invalid credentials', async () => {
    const req = { body: { email: 'a@a.com', password: 'pass' } };
    const res = mockRes();

    User.findOne.mockResolvedValue(null);
    await userController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('login - success', async () => {
    const mockUser = {
      _id: 'user123',
      email: 'a@a.com',
      matchPassword: jest.fn().mockResolvedValue(true),
    };
    const req = { body: { email: 'a@a.com', password: 'pass' } };
    const res = mockRes();

    User.findOne.mockResolvedValue(mockUser);
    jwt.sign.mockReturnValue('valid-token');

    await userController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'valid-token' })
    );
  });
});
