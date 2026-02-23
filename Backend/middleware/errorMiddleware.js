// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/** Standard error response shape */
const errorBody = (message, extra = {}) => ({
  success: false,
  message,
  data: [],
  ...extra,
});

// Global error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json(errorBody(message));
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json(
      errorBody(`Invalid ${err.path || "ID"} format`),
    );
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json(errorBody("Duplicate value provided"));
  }

  res.json(
    errorBody(err.message || "Server error", {
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    }),
  );
};

module.exports = {
  notFound,
  errorHandler,
};

