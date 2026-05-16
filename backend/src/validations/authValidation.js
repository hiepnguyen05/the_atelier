const Joi = require('joi');

const registerSchema = Joi.object({
    fullName: Joi.string().min(2).max(255).required().messages({
        'string.empty': 'Họ tên không được để trống',
        'string.min': 'Họ tên phải có ít nhất 2 ký tự',
        'any.required': 'Họ tên là bắt buộc'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email không hợp lệ',
        'string.empty': 'Email không được để trống',
        'any.required': 'Email là bắt buộc'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'string.empty': 'Mật khẩu không được để trống',
        'any.required': 'Mật khẩu là bắt buộc'
    }),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/).allow(null, '').messages({
        'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email không hợp lệ',
        'string.empty': 'Email không được để trống',
        'any.required': 'Email là bắt buộc'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Mật khẩu không được để trống',
        'any.required': 'Mật khẩu là bắt buộc'
    })
});

module.exports = {
    registerSchema,
    loginSchema
};
