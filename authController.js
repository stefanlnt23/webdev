const User = require('./models/User');
const Comment = require('./models/commentModel');

exports.getLogin = (req, res) => {
  // Render the login view
  res.render('login');
};

exports.postLogin = async (req, res) => {
  // Handle login form submission
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username });

    // If the user doesn't exist, or the password is incorrect, redirect back to the login page
    if (!user || user.password !== password) {
      return res.redirect('/login');
    }

    // If the user exists and the password is correct, authenticate the user and redirect to the dashboard
    req.session.user = user;
    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during login:', error);
    return res.redirect('/login');
  }
};

exports.checkSession = (req, res, next) => {
  if(req.session.user){
    let timeLeft = ((req.session.cookie._expires.getTime() - new Date().getTime()) / 1000); 
    if(timeLeft <= 10){
      res.send({timeLeft: timeLeft, message: 'Session expires in 10 seconds'});
    } else {
      next();
    }
  } else {
    next();
  }
}

exports.extendSession = (req, res) => {
  if(req.session.user){
    req.session.cookie.expires = new Date(Date.now() + 10*60*1000); // Extend session by 10 minutes
    req.session.save(function(err) {
      // session has been regenerated and is now 10 minutes longer
      res.send({status: 'Session extended'});
    })
  } else {
    res.redirect('/login');
  }
}

exports.getRegister = (req, res) => {
  // Render the register view
  res.render('register');
};

exports.getDashboard = (req, res) => {
  // Here, "user" should be your authenticated user. 
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('dashboard', { user: req.session.user });
};

exports.postRegister = (req, res) => {
  // Handle register form submission
  const { username, password } = req.body;
  // Create a new user in the database
  const newUser = new User({ username, password });
  newUser.save()
    .then(() => {
      res.redirect('/login');
    })
    .catch((error) => {
      console.error(error);
      res.redirect('/register');
    });
};

exports.postLogout = (req, res) => {
  // Destroy the session and redirect to the login page
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

// Middleware to ensure user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Controller to get posts and comments
exports.getPosts = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ timestamp: -1 });
    res.render('posts', { user: req.session.user, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.redirect('/dashboard');
  }
};

// Controller to add a comment
exports.addComment = async (req, res) => {
  try {
    const comment = new Comment({
      user: req.session.user.username,
      text: req.body.comment
    });
    await comment.save();
    res.redirect('/posts');
  } catch (error) {
    console.error('Error adding comment:', error);
    res.redirect('/posts');
  }
};
