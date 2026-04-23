// middleware is a function that runs BEFORE the main code
// it acts like a security guard
// if the password is wrong -> block the request
// if the password is correct -> call next() to move forward

function auth(req, res, next) {

    // headers are extra info sent with every request
    // we expect the client to send a header called "password"
    const password = req.headers['password'];

    // no password was sent at all
    // 400 -> bad request, the client did something wrong
    if (!password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: "error",
            message: "no password provided" 
        }));
        // return stops the function here, next() never gets called
        return;
    }

    // password was sent but it is wrong
    // 401 -> unauthorized, not allowed in
    if (password !== "admin123") {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: "error",
            message: "wrong password" 
        }));
        // return stops the function here, next() never gets called
        return;
    }

    // password is correct -> call next() to move to the controller
    next();
}

module.exports = auth;