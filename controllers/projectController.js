function getProjects(req, res, next) {
    res.status(200).json({message: "Here are your projects!"})
}

module.exports = {
    getProjects
}