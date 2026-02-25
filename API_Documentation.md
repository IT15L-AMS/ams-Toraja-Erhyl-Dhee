Erhyl Dhee D. Toraja

Academic Management System (AMS) - API Documentation
Auth Module


1. Register User
Description:  Creates a new user account and returns an access token.

- Endpoint:POST /auth/register
- Method: POST
- Authentication Required:No
- Headers:
- Content-Type: application/json

Request Body:
json
{
  "full_name": "Erhyl Dhee Toraja",
  "email": "toraja@gmail.com",
  "password": "password123",
  "role_name": "Student"
}

Valid roles: Admin, Registrar, Instructor, Student

Success Response (201 Created):
json
{
  "success": true,
  "message": "User registered successfully",
  "token": "JWT_TOKEN_STRING"
}


Error Response (400 Bad Request):
json
{
  "success": false,
  "message": "Email already registered"
}


---

 2. Login User
Description: Authenticates user and returns an access token.

- Endpoint: POST /auth/login
- Method: POST
- Authentication Required: No
- Headers: 
  - Content-Type: application/json

Request Body:
json
{
  "email": "toraja@gmail.com",
  "password": "password123"
}


Success Response (200 OK):
json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN_STRING",
  "user": {
    "id": 1,
    "full_name": "Erhyl Dhee Toraja",
    "email": "toraja@gmail.com",
    "role": "Student"
  }
}


Error Response (401 Unauthorized):
json
{
  "success": false,
  "message": "Invalid email or password"
}


---

 3. Get Profile
Description: Returns the profile information of the currently authenticated user.

- Endpoint: GET /auth/profile
- Method: GET
- Authentication Required: Yes (JWT)
- Headers: 
  - Authorization: Bearer <token>

Request Body:
- None

Success Response (200 OK):
json
{
  "success": true,
  "user": {
    "id": 1,
    "full_name": "Erhyl Dhee Toraja",
    "email": "Toraja@gmail.com",
    "role_name": "Student"
  }
}






Error Response (401 Unauthorized):
json
{
  "success": false,
  "message": "Access denied. No token provided."
}


---

 4. Role-Based Access Examples (RBAC)

 Admin Data
- Endpoint: GET /auth/admin-data
- Auth Required: Yes (Role: Admin)
- Success: Returns restricted admin message.

 Registrar Data
- Endpoint: GET /auth/registrar-data
- Auth Required: Yes (Role: Registrar)
- Success: Returns institutional registrar message.
