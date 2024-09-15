function getProjects(req, res, next) {
    res.json({message: "Here are your projects!"})
}

module.exports = {
    getProjects
}