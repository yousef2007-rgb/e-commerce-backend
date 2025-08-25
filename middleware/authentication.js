const jwt = require('jsonwebtoken');

const authentication = async (req, res, next) => {
    try{
        const token = req.headers["x-auth-token"]
        console.log(req.headers)
        if(!token) {return res.status(401).send("unauthenticated please sign in to continue")}

        const decoded = await jwt.verify(token, process.env.JWT_KEY);
        if(!decoded) { return res.status(401).send("unauthenticated please sign in to continue")}

        next(decoded)
    }catch(err){
        return res.status(401).send("unauthenticated please sign in to continue")
    }
}

module.exports = authentication;
