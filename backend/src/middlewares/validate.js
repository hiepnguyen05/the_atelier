const validate = (schema, source = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[source], { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    const err = new Error(errorMessage);
    err.statusCode = 400;
    return next(err);
  }
  next();
};

module.exports = validate;
