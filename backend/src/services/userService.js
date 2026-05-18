const { models } = require('../config/db');
const { Op } = require('sequelize');
const User = models.users;
const Role = models.roles;

exports.getAllUsers = async ({ page = 1, limit = 10, search = '', roleId, isActive }) => {
    const offset = (page - 1) * limit;

    const whereCondition = {};
    if (search) {
        whereCondition[Op.or] = [
            { fullName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
        ];
    }

    if (roleId) {
        whereCondition.roleId = parseInt(roleId);
    }

    if (isActive !== undefined && isActive !== '') {
        whereCondition.isActive = isActive === 'true' || isActive === true || isActive === 1 || isActive === '1';
    }

    const { count, rows } = await User.findAndCountAll({
        where: whereCondition,
        attributes: { exclude: ['passwordHash'] },
        include: [{
            model: Role,
            as: 'role',
            attributes: ['roleName']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
    });

    return {
        users: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page)
    };
};

exports.toggleUserStatus = async (id, isActive) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    user.isActive = isActive;
    await user.save();

    return user;
};

exports.updateUserRole = async (id, roleId) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
        throw new Error('ROLE_NOT_FOUND');
    }

    user.roleId = roleId;
    await user.save();

    // Reload with role association
    return await User.findByPk(id, {
        attributes: { exclude: ['passwordHash'] },
        include: [{
            model: Role,
            as: 'role',
            attributes: ['roleName']
        }]
    });
};
