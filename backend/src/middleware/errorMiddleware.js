export const errorHandler = (err, req, res, next) => {
  // Handle multer errors
  if (err.name === "MulterError") {
    const status = err.code === "FILE_TOO_LARGE" ? 413 : 400;
    const message = err.code === "FILE_TOO_LARGE" 
      ? "File size exceeds maximum limit (50MB)"
      : err.message;
    return res.status(status).json({
      success: false,
      message
    });
  }

  // Handle custom validation errors
  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Handle other errors
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message
  });
};
