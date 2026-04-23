# Node.js User Management API

A simple REST API built using Node.js without Express.

## Features
- Get all users
- Add new user
- Delete user
- File-based storage (JSON)
- Simple authentication middleware

## Technologies
- Node.js
- Built-in HTTP module
- File System (fs)

## API Routes

GET /users  
POST /users  
DELETE /users/:id  

## Auth
Send header:
password: admin123

## Run Project
node server.js