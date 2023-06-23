
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//for registration
module.exports.createUserController = (req, res) => {


    //Create a new user Document
    User.findOne({ email: req.body.email })
        .then(result => { // able to capture the result of query and process the result 
            console.log(result);
            if (result !== null && result.email === req.body.email) {
                return res.send("Duplicate User Found.");
            } else {
                let newUser = new User({
                    email: req.body.email,
                    password: req.body.password,
                    isAdmin: req.body.isAdmin
          

                });
                newUser.save()// this will allow us to save the document in our collection. 
                    .then(result => res.send(result)).catch(err => res.send(err))
                    .catch(err => res.send(err)) // if error occur
            }
        })
        .catch(err => res.send(err));
}
        
//for login
module.exports.loginUser = (req, res) => { 
    console.log(req.body);

    
    User.findOne({ email: req.body.email })
        .then(result => { // able to capture the result of query and process the result 
            console.log(result);
            if (!result.email) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            if (result.password !== req.body.password) {
                return res.status(401).json({ message: 'Password is invalid' });
            }
        
        const token = jwt.sign({ userId: result._id, isAdmin: result.isAdmin }, 'gelca');
        res.status(200).json({ message: 'Login successful', token });
        
        })
            .catch(err => res.send(err));

}

module.exports.setAsAdmin = (req, res) => {
  const token = req.headers.authorization;
  // Verify the token and check if the user is an admin
  const trimmedToken = token.trim();

  jwt.verify(trimmedToken, 'gelca', (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    const isAdmin = decoded.isAdmin;
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admin can access' });
    }

    const userId = req.body.userId;

    User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true })
      .then(updatedUser => {
        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.send(updatedUser);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
};

