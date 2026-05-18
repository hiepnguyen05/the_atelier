const request = require('supertest');
const app = require('../src/app');
const { models } = require('../src/config/db');
const jwt = require('jsonwebtoken');
const userService = require('../src/services/userService');

// Mocking the database models
jest.mock('../src/config/db', () => ({
    models: {
        users: {
            findAndCountAll: jest.fn(),
            findByPk: jest.fn()
        },
        roles: {
            findByPk: jest.fn()
        }
    }
}));

describe('User Management Unit & API Tests', () => {
    let adminToken;
    let userToken;

    beforeAll(() => {
        adminToken = jwt.sign(
            { userId: 1, email: 'admin@example.com', role: 'admin' },
            process.env.JWT_SECRET || 'your_default_jwt_secret'
        );
        userToken = jwt.sign(
            { userId: 2, email: 'user@example.com', role: 'user' },
            process.env.JWT_SECRET || 'your_default_jwt_secret'
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('User Service Tests', () => {
        it('should get all users with search and pagination', async () => {
            const mockUsers = [
                { userId: 1, fullName: 'John Doe', email: 'john@example.com', roleId: 1, isActive: true },
                { userId: 2, fullName: 'Jane Doe', email: 'jane@example.com', roleId: 2, isActive: false }
            ];

            models.users.findAndCountAll.mockResolvedValue({
                count: 2,
                rows: mockUsers
            });

            const result = await userService.getAllUsers({ page: 1, limit: 10, search: 'Doe' });

            expect(models.users.findAndCountAll).toHaveBeenCalled();
            expect(result.users).toEqual(mockUsers);
            expect(result.totalItems).toBe(2);
            expect(result.totalPages).toBe(1);
            expect(result.currentPage).toBe(1);
        });

        it('should toggle user status successfully', async () => {
            const mockUser = {
                userId: 2,
                fullName: 'Jane Doe',
                email: 'jane@example.com',
                isActive: false,
                save: jest.fn().mockResolvedValue(true)
            };

            models.users.findByPk.mockResolvedValue(mockUser);

            const result = await userService.toggleUserStatus(2, true);

            expect(models.users.findByPk).toHaveBeenCalledWith(2);
            expect(mockUser.isActive).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });

        it('should throw error when toggling non-existent user status', async () => {
            models.users.findByPk.mockResolvedValue(null);

            await expect(userService.toggleUserStatus(999, true)).rejects.toThrow('USER_NOT_FOUND');
        });

        it('should update user role successfully', async () => {
            const mockUser = {
                userId: 2,
                roleId: 1,
                save: jest.fn().mockResolvedValue(true)
            };

            const mockRole = { roleId: 30001, roleName: 'admin' };

            models.users.findByPk
                .mockResolvedValueOnce(mockUser) // First find for checking
                .mockResolvedValueOnce({ ...mockUser, roleId: 30001, role: mockRole }); // Second find for reloading

            models.roles.findByPk.mockResolvedValue(mockRole);

            const result = await userService.updateUserRole(2, 30001);

            expect(mockUser.roleId).toBe(30001);
            expect(mockUser.save).toHaveBeenCalled();
            expect(result.roleId).toBe(30001);
        });

        it('should throw error when updating role of non-existent user', async () => {
            models.users.findByPk.mockResolvedValue(null);

            await expect(userService.updateUserRole(999, 30001)).rejects.toThrow('USER_NOT_FOUND');
        });

        it('should throw error when assigning non-existent role', async () => {
            const mockUser = { userId: 2 };
            models.users.findByPk.mockResolvedValue(mockUser);
            models.roles.findByPk.mockResolvedValue(null);

            await expect(userService.updateUserRole(2, 9999)).rejects.toThrow('ROLE_NOT_FOUND');
        });
    });

    describe('User API Routes Tests', () => {
        describe('GET /api/users', () => {
            it('should return 401 if unauthorized', async () => {
                const res = await request(app).get('/api/users');
                expect(res.statusCode).toBe(401);
                expect(res.body.success).toBe(false);
            });

            it('should return 403 if normal user attempts to access', async () => {
                const res = await request(app)
                    .get('/api/users')
                    .set('Authorization', `Bearer ${userToken}`);
                
                expect(res.statusCode).toBe(403);
                expect(res.body.success).toBe(false);
            });

            it('should return 200 and list of users if admin requests', async () => {
                const mockUsers = [
                    { userId: 1, fullName: 'John Doe', email: 'john@example.com', roleId: 1, isActive: true }
                ];

                models.users.findAndCountAll.mockResolvedValue({
                    count: 1,
                    rows: mockUsers
                });

                const res = await request(app)
                    .get('/api/users')
                    .set('Authorization', `Bearer ${adminToken}`);

                expect(res.statusCode).toBe(200);
                expect(res.body.users).toEqual(mockUsers);
            });
        });

        describe('PUT /api/users/:id/status', () => {
            it('should return 401 if unauthorized', async () => {
                const res = await request(app)
                    .put('/api/users/2/status')
                    .send({ isActive: true });
                
                expect(res.statusCode).toBe(401);
            });

            it('should return 403 if normal user attempts to change status', async () => {
                const res = await request(app)
                    .put('/api/users/2/status')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({ isActive: true });
                
                expect(res.statusCode).toBe(403);
            });

            it('should successfully toggle status if admin requests', async () => {
                const mockUser = {
                    userId: 2,
                    isActive: false,
                    save: jest.fn().mockResolvedValue(true)
                };

                models.users.findByPk.mockResolvedValue(mockUser);

                const res = await request(app)
                    .put('/api/users/2/status')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send({ isActive: true });

                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.message).toContain('thành công');
            });

            it('should return 404 if user not found', async () => {
                models.users.findByPk.mockResolvedValue(null);

                const res = await request(app)
                    .put('/api/users/999/status')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send({ isActive: true });

                expect(res.statusCode).toBe(404);
                expect(res.body.success).toBe(false);
            });
        });

        describe('PUT /api/users/:id/role', () => {
            it('should return 401 if unauthorized', async () => {
                const res = await request(app)
                    .put('/api/users/2/role')
                    .send({ roleId: 30001 });
                
                expect(res.statusCode).toBe(401);
            });

            it('should return 403 if normal user attempts to change role', async () => {
                const res = await request(app)
                    .put('/api/users/2/role')
                    .set('Authorization', `Bearer ${userToken}`)
                    .send({ roleId: 30001 });
                
                expect(res.statusCode).toBe(403);
            });

            it('should successfully update role if admin requests', async () => {
                const mockUser = {
                    userId: 2,
                    roleId: 1,
                    save: jest.fn().mockResolvedValue(true)
                };

                const mockRole = { roleId: 30001, roleName: 'admin' };

                models.users.findByPk
                    .mockResolvedValueOnce(mockUser)
                    .mockResolvedValueOnce({ ...mockUser, roleId: 30001, role: mockRole });
                models.roles.findByPk.mockResolvedValue(mockRole);

                const res = await request(app)
                    .put('/api/users/2/role')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send({ roleId: 30001 });

                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.message).toContain('thành công');
            });

            it('should return 400 if role is invalid', async () => {
                const mockUser = { userId: 2 };
                models.users.findByPk.mockResolvedValue(mockUser);
                models.roles.findByPk.mockResolvedValue(null);

                const res = await request(app)
                    .put('/api/users/2/role')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send({ roleId: 9999 });

                expect(res.statusCode).toBe(400);
                expect(res.body.success).toBe(false);
                expect(res.body.message).toContain('hợp lệ');
            });
        });
    });
});
