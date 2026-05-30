const userService = require('../services/userService');

// [GET] /api/users
exports.getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '', roleId, isActive } = req.query;
        const data = await userService.getAllUsers({ page, limit, search, roleId, isActive });
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// [PUT] /api/users/:id/status
exports.toggleUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const user = await userService.toggleUserStatus(id, isActive);

        res.status(200).json({
            success: true,
            message: `Tài khoản đã được ${isActive ? 'mở khóa' : 'khóa'} thành công`,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// [PUT] /api/users/:id/role
exports.updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { roleId } = req.body;

        const user = await userService.updateUserRole(id, roleId);

        res.status(200).json({
            success: true,
            message: 'Phân quyền người dùng thành công',
            data: user
        });
    } catch (error) {
        next(error);
    }
};
