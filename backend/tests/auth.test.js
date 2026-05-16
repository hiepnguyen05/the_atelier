const request = require('supertest');
const app = require('../src/app');
const { models } = require('../src/config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mocking dependencies
jest.mock('../src/config/db', () => ({
    models: {
        users: {
            findOne: jest.fn(),
            create: jest.fn(),
            findByPk: jest.fn()
        },
        roles: {
            findOne: jest.fn(),
            create: jest.fn()
        }
    }
}));

describe('Authentication API Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        const validUser = {
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            phone: '0123456789'
        };

        it('should register a new user successfully', async () => {
            models.users.findOne.mockResolvedValue(null);
            models.roles.findOne.mockResolvedValue({ roleId: 1, roleName: 'user' });
            models.users.create.mockResolvedValue({
                userId: 1,
                ...validUser,
                roleId: 1,
                toJSON: function() {
                    const obj = { ...this };
                    delete obj.toJSON;
                    return obj;
                }
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send(validUser);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe(validUser.email);
            expect(res.body.data).not.toHaveProperty('passwordHash');
        });

        it('should return 400 if email already exists', async () => {
            models.users.findOne.mockResolvedValue({ userId: 1, email: validUser.email });

            const res = await request(app)
                .post('/api/auth/register')
                .send(validUser);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Email đã được sử dụng');
        });

        it('should return 400 for invalid email format', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ ...validUser, email: 'invalid-email' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Email không hợp lệ');
        });

        it('should return 400 if password is too short', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ ...validUser, password: '123' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Mật khẩu phải có ít nhất 6 ký tự');
        });
    });

    describe('POST /api/auth/login', () => {
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };

        it('should login successfully and return a token', async () => {
            const hashedPassword = await bcrypt.hash(loginData.password, 10);
            const user = {
                userId: 1,
                email: loginData.email,
                passwordHash: hashedPassword,
                isActive: true,
                role: { roleName: 'user' },
                toJSON: function() {
                    return { userId: 1, email: loginData.email, isActive: true };
                }
            };

            models.users.findOne.mockResolvedValue(user);

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty('token');
            expect(res.body.data.email).toBe(loginData.email);
        });

        it('should return 401 for non-existent user', async () => {
            models.users.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Email hoặc mật khẩu không chính xác');
        });

        it('should return 401 for wrong password', async () => {
            const user = {
                userId: 1,
                email: loginData.email,
                passwordHash: await bcrypt.hash('different-password', 10),
                isActive: true
            };

            models.users.findOne.mockResolvedValue(user);

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Email hoặc mật khẩu không chính xác');
        });

        it('should return 403 if user is inactive', async () => {
            const user = {
                userId: 1,
                email: loginData.email,
                passwordHash: await bcrypt.hash(loginData.password, 10),
                isActive: false
            };

            models.users.findOne.mockResolvedValue(user);

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe('Tài khoản đã bị khóa');
        });
    });

    describe('GET /api/auth/me', () => {
        it('should return user info if token is valid', async () => {
            const token = jwt.sign(
                { userId: 1, email: 'test@example.com', role: 'user' },
                process.env.JWT_SECRET || 'your_default_jwt_secret'
            );

            models.users.findByPk.mockResolvedValue({
                userId: 1,
                email: 'test@example.com',
                role: { roleName: 'user' }
            });

            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe('test@example.com');
        });

        it('should return 401 if no token provided', async () => {
            const res = await request(app).get('/api/auth/me');

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Bạn cần đăng nhập để thực hiện thao tác này');
        });

        it('should return 401 if token is invalid', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token');

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Phiên làm việc hết hạn hoặc token không hợp lệ');
        });
    });
});
