const authService = require('../services/authService');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const { BadRequestError } = require('../utils/errors');

const authController = {
    // [POST] /api/auth/register
    register: async (req, res, next) => {
        try {
            // 1. Validate data
            const { error, value } = registerSchema.validate(req.body);
            if (error) {
                throw new BadRequestError(error.details[0].message);
            }

            // 2. Delegate to service
            const userResponse = await authService.register(value);

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
                throw new BadRequestError(error.details[0].message);
            }

            // 2. Delegate to service
            const { token, user } = await authService.login(value);

            return res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                token,
                data: user
            });
        } catch (error) {
            next(error);
        }
    },

    // [GET] /api/auth/me (Get current user info)
    getMe: async (req, res, next) => {
        try {
            // Delegate to service
            const user = await authService.getMe(req.user.userId);

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
