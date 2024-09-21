function errorHandler(err, req, res, next) {
    // global catch
    return res.status(500).json({ message: err })
}



module.exports = errorHandler