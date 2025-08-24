const errorHandler = (err, req, res, next) => {
    res.status(500).send(`something went wrong ${err}`)
    console.log(err)
} 

module.exports = errorHandler;
