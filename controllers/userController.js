// fs is a built in node.js module
// it lets us read and write files on the computer
const fs = require('fs');

// path to our data file
// all users are stored here permanently
const DB_PATH = './users.json';

// helper function to read users from file
// we use this in every function so we put it in one place
function readUsers() {
    return JSON.parse(fs.readFileSync(DB_PATH));
}

// helper function to save users to file
// we use this in every function so we put it in one place
function saveUsers(users) {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

// GET /users
// reads all users from users.json and sends them back
function getUsers(req, res) {
    try {
        const users = readUsers();

        // 200 -> success, everything went fine
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: "success",
            count: users.length,
            data: users
        }));

    } catch (error) {
        // 500 -> server error, something broke on our end
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: "error",
            message: "could not read users" 
        }));
    }
}

// POST /users
// adds a new user to users.json
function addUser(req, res) {
    let body = '';

    // the request body comes in as small pieces called chunks
    // we collect all chunks and combine them into one string
    req.on('data', chunk => {
        body += chunk;
    });

    // once all chunks are received we process the data
    req.on('end', () => {
        try {
            const users = readUsers();

            // convert the incoming text into a javascript object
            const newUser = JSON.parse(body);

            // give the new user a unique id
            newUser.id = users.length + 1;

            // add new user to the array
            users.push(newUser);

            // save the updated array back to the file
            saveUsers(users);

            // 201 -> created, a new resource was successfully created
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: "success",
                message: "user created",
                data: newUser
            }));

        } catch (error) {
            // 500 -> server error, something broke on our end
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: "error",
                message: "could not add user" 
            }));
        }
    });
}

// DELETE /users/1
// deletes the user with the given id from users.json
function deleteUser(req, res) {
    try {
        // extract the id from the url
        // example: /users/3 -> split gives ["", "users", "3"] -> [2] gives "3"
        // parseInt converts "3" from string to number 3
        const id = parseInt(req.url.split('/')[2]);

        let users = readUsers();

        // check if a user with this id actually exists
        const userExists = users.find(user => user.id === id);

        // user not found -> send 404
        // 404 -> not found, the thing they asked for does not exist
        if (!userExists) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: "error",
                message: `user with id ${id} not found` 
            }));
            return;
        }

        // filter out the user with the matching id
        // filter keeps everyone EXCEPT the user we want to delete
        users = users.filter(user => user.id !== id);

        // save the updated array back to the file
        saveUsers(users);

        // 200 -> success, user was deleted
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: "success",
            message: `user with id ${id} deleted` 
        }));

    } catch (error) {
        // 500 -> server error, something broke on our end
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: "error",
            message: "could not delete user" 
        }));
    }
}

module.exports = { getUsers, addUser, deleteUser };