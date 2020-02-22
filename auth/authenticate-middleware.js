/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const restricted = (req, res, next) => {
  if (req.session && req.session.user)
    if (req.params.id) {
      if (req.session.user.id == req.params.id)
        //the user logged in can only operate on their own account (delete, access content)
        next();
      else
        res
          .status(401)
          .json({
            message: "You do not have priviledge to access or edit this user."
          });
    } else next();
  else res.status(401).json({ message: "You shall not pass!" });
};

module.exports = restricted;
