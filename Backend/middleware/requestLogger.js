// Custom request logging middleware (not morgan)

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
};

module.exports = requestLogger;
