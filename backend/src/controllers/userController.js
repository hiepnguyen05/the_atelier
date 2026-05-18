const userService = require('../services/userService');

// [GET] /api/users
exports.getAllUsers = async (req, res) => {
    try {
                const { page = 1, limit = 10, search = '', roleId, isActive } = req.query;
        
        const data = await userService.getAllUsers({ page, limit, search, roleId, isActive });

        res.status(200).json(data);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách người dùng' });
    }
};

// [PUT] /api/users/:id/status
exports.toggleUserStatus = async (req, res) => {
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
        console.error('Error toggling user status:', error);
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật trạng thái người dùng' });
    }
};

// [PUT] /api/users/:id/role
exports.updateUserRole = async (req, res) => {
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
        console.error('Error updating user role:', error);
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        if (error.message === 'ROLE_NOT_FOUND') {
            return res.status(400).json({ success: false, message: 'Vai trò không hợp lệ' });
        }
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật quyền người dùng' });
    }
};
