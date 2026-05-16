const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check if token exists in headers
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Bạn cần đăng nhập để thực hiện thao tác này'
            });
        }

        // 2. Verify token
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'your_default_jwt_secret'
            );

            // 3. Attach user info to request
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Phiên làm việc hết hạn hoặc token không hợp lệ'
            });
        }
    } catch (error) {
        next(error);
    }
};

// Middleware to restrict access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện thao tác này'
            });
        }
        next();
    };
};

module.exports = {
    protect,
    authorize
};
