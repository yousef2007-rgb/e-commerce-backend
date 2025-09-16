const errorHandler = (err, req, res, next) => {
    console.log(err)
    res.status(500).send(`something went wrong ${err}`)
} 

module.exports = errorHandler;
