// Centralized error handler keeps controller code simple.
// This also makes it easy to plug in logging/monitoring and scale to
// multiple instances where all errors are streamed to a shared log system.
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error"
  });
}

module.exports = { errorHandler };

