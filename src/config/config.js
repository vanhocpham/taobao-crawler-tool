module.exports = {
  PORT:  process.env.NODE_ENV === "production" ? 8686 : 8686,
  FOLDER: "./image",
  ZIP: "./image.zip"
};