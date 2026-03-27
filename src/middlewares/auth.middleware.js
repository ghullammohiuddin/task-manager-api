import jwt from 'jsonwebtoken'

const authenticate = (req,res,next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token){
        return res.status(401).json({message: "No Token Provided", success: false})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { id: decoded.id, email: decoded.email };
        next();
    } catch (error) {
        return res.status(401).json({sccuess: false, message: "Invalid Token"})
    }
};

export {authenticate}