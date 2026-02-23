/**
 * Standardized response helpers for consistent API format:
 * { success: true|false, message: string, data: object|array }
 */

/**
 * Send success response with standardized shape.
 * @param {import('express').Response} res
 * @param {object|array} data - Response payload
 * @param {string} [message=''] - Optional success message
 * @param {number} [status=200]
 */
function success(res, data, message = "", status = 200) {
  const payload =
    data !== undefined && data !== null ? data : [];
  res.status(status).json({
    success: true,
    message: message || "OK",
    data: payload,
  });
}

/**
 * Trigger not-found flow; pass to error middleware via next()
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @param {string} message
 */
function notFound(res, next, message = "Resource not found") {
  const error = new Error(message);
  res.status(404);
  next(error);
}

module.exports = {
  success,
  notFound,
};
