const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { models } = require('../config/db');
const { registerSchema, loginSchema } = require('../validations/authValidation');

const authController = {
    // [POST] /api/auth/register
    register: async (req, res, next) => {
        try {
            // 1. Validate data
            const { error, value } = registerSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const { fullName, email, password, phone } = value;

            // 2. Check if email already exists
            const existingUser = await models.users.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã được sử dụng'
                });
            }

            // 3. Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // 4. Get default role 'user'
            let userRole = await models.roles.findOne({ where: { roleName: 'user' } });
            
            // If role 'user' doesn't exist, create it (defensive)
            if (!userRole) {
                userRole = await models.roles.create({ roleName: 'user' });
            }

            // 5. Create user
            const newUser = await models.users.create({
                fullName,
                email,
                passwordHash,
                phone,
                roleId: userRole.roleId,
                isActive: true
            });

            // 6. Return response (without password)
            const userResponse = newUser.toJSON();
            delete userResponse.passwordHash;

            return res.status(201).json({
                success: true,
                message: 'Đăng ký tài khoản thành công',
                data: userResponse
            });

        } catch (error) {
            next(error);
        }
    },

    // [POST] /api/auth/login
    login: async (req, res, next) => {
        try {
            // 1. Validate data
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const { email, password } = value;

            // 2. Find user by email
            const user = await models.users.findOne({
                where: { email },
                include: [{
                    model: models.roles,
                    as: 'role'
                }]
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email hoặc mật khẩu không chính xác'
                });
            }

            // 3. Check password
            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Email hoặc mật khẩu không chính xác'
                });
            }

            // 4. Check if user is active
            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Tài khoản đã bị khóa'
                });
            }

            // 5. Generate JWT
            const payload = {
                userId: user.userId,
                email: user.email,
                role: user.role ? user.role.roleName : 'user'
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET || 'your_default_jwt_secret',
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            // 6. Return response
            const userResponse = user.toJSON();
            delete userResponse.passwordHash;

            return res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                token,
                data: userResponse
            });

        } catch (error) {
            next(error);
        }
    },

    // [GET] /api/auth/me (Optional - Get current user info)
    getMe: async (req, res, next) => {
        try {
            const user = await models.users.findByPk(req.user.userId, {
                attributes: { exclude: ['passwordHash'] },
                include: [{
                    model: models.roles,
                    as: 'role'
                }]
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy người dùng'
                });
            }

            return res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;
