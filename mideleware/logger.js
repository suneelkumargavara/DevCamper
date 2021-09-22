// @desc Logs request to the console
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.original}`,
  )
  next()
}

module.exports = logger
