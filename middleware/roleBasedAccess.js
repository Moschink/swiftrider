// const jsonWebToken = require("jsonwebtoken");
const roleBasedAccess = (role) => {
    return (req, res, next) => {
        // console.log("role", role, "decoded role", req.decoded.role);
        console.log("ROLE :::", req.decoded.role);
        if(!role.includes(req.decoded.role)){
            res.status(403).send({
                  message: "You are not allowed to access this role"
                });
                return;
        }
        next();
    }
}
module.exports = roleBasedAccess;