const jwt = require("jsonwebtoken");

const authorization = async (req,res, next ) => {
    try{
        const token = req.headers['x-auth-token'];
        if(!token) {return res.status(401).send("unauthenticated please sign in to continue 1")}

        const decoded = await jwt.verify(token, process.env.JWT_KEY);
        if(!decoded) {return res.status(401).send("unauthenticated please sign in to continue 2")}
        if(!decoded.isAdmin) { return res.status(403).send("unauthorized to access")}

        next(decoded);
    }catch(err){
        return res.status(401).send("unauthenticated please sign in to continue 3")
    }
} 

module.exports = authorization;
