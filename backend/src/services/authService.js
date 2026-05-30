const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { models } = require('../config/db');
const { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } = require('../utils/errors');

const register = async (userData) => {
    const { fullName, email, password, phone } = userData;

    // Check if email already exists
    const existingUser = await models.users.findOne({ where: { email } });
    if (existingUser) {
        throw new BadRequestError('Email đã được sử dụng');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Get default role 'user'
    let userRole = await models.roles.findOne({ where: { roleName: 'user' } });
    
    // If role 'user' doesn't exist, create it (defensive)
    if (!userRole) {
        userRole = await models.roles.create({ roleName: 'user' });
    }

    // Create user
    const newUser = await models.users.create({
        fullName,
        email,
        passwordHash,
        phone,
        roleId: userRole.roleId,
        isActive: true
    });

    // Return response (without password)
    const userResponse = newUser.toJSON();
    delete userResponse.passwordHash;

    return userResponse;
};

const login = async (credentials) => {
    const { email, password } = credentials;

    // Find user by email
    const user = await models.users.findOne({
        where: { email },
        include: [{
            model: models.roles,
            as: 'role'
        }]
    });

    if (!user) {
        throw new UnauthorizedError('Email hoặc mật khẩu không chính xác');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new UnauthorizedError('Email hoặc mật khẩu không chính xác');
    }

    // Check if user is active
    if (!user.isActive) {
        throw new ForbiddenError('Tài khoản đã bị khóa');
    }

    // Generate JWT
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

    // Return response
    const userResponse = user.toJSON();
    delete userResponse.passwordHash;

    return { token, user: userResponse };
};

const getMe = async (userId) => {
    const user = await models.users.findByPk(userId, {
        attributes: { exclude: ['passwordHash'] },
        include: [{
            model: models.roles,
            as: 'role'
        }]
    });

    if (!user) {
        throw new NotFoundError('Không tìm thấy người dùng');
    }

    return user;
};

module.exports = {
    register,
    login,
    getMe
};
