// import controller functions
const { getUsers, addUser, deleteUser } = require('./controllers/userController');

// import auth middleware
const auth = require('./middleware/auth');

function routes(req, res) {

    // GET / -> health check, just confirms api is alive
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: "success",
            message: "API is running" 
        }));

    // GET /users -> get all users
    // auth runs first, if password is wrong it stops here
    // if password is correct it calls getUsers
    } else if (req.url === "/users" && req.method === "GET") {
        auth(req, res, () => getUsers(req, res));

    // POST /users -> add a new user
    // auth runs first, if password is wrong it stops here
    // if password is correct it calls addUser
    } else if (req.url === "/users" && req.method === "POST") {
        auth(req, res, () => addUser(req, res));

    // DELETE /users/1 -> delete user with id 1
    // auth runs first, if password is wrong it stops here
    // if password is correct it calls deleteUser
    } else if (req.url.startsWith("/users/") && req.method === "DELETE") {
        auth(req, res, () => deleteUser(req, res));

    // if nothing matched -> send 404 route not found
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: "error",
            message: "route not found" 
        }));
    }
}

module.exports = routes;