# Collaborative Task Tracking System

A collaborative platform for tracking tasks, enabling teams to manage, assign, and monitor progress efficiently. Users can register, log in, create and assign tasks, update statuses, and collaborate via comments.

## Project Structure
```
.env
.gitignore
app.js
package.json
controllers/
  taskController.js
  teamController.js
  userControllers.js
middlewares/
  auth.js
models/
  taskModel.js
  teamModel.js
  userModel.js
  commentModel.js
routes/
  taskRoutes.js
  teamRoutes.js
  userRoutes.js
```

## Features
- User registration and login with JWT-based authentication
- Task creation, updating, and deletion
- Assign tasks to users
- Track task status (open, in-progress, completed)
- Comment on tasks for collaboration
- Team creation and member management
- Middleware for authorization

## Installation
1. **Clone the repository:**
   ```bash
git clone <repository-url>
cd collab-task-tracking-system
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a `.env` file** in the root directory and add the following environment variables:
   ```env
   PORT=<your-port>
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRE=1h
   ```

## Running the Server
Start the server:
```bash
npm start
```

## API Endpoints
### User Routes (`/v1/users`)
- `POST /register`: Register a new user
- `POST /login`: Log in a user
- `GET /profile`: Get user profile (auth required)
- `PUT /profile`: Update user profile (auth required)
- `PUT /change-password`: Change password (auth required)

### Task Routes (`/v1/tasks`)
- `POST /task`: Create a new task (auth required)
- `PUT /task/:id`: Update a task (auth required)
- `GET /my-tasks`: Get tasks assigned to the logged-in user (auth required)
- `GET /filter`: Filter tasks (auth required)
- `GET /search`: Search tasks (auth required)
- `POST /task/:id/comments`: Add a comment to a task (auth required)
- `GET /task/:id/comments`: Get comments for a task (auth required)

### Team Routes (`/v1/teams`)
- `POST /`: Create a new team (auth required)
- `POST /:teamId/invite/:userId`: Invite a user to a team (auth required)
- `GET /my-teams`: Get teams the user is a member of (auth required)

## Technologies Used
- **Node.js**: Backend runtime
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication and authorization
- **dotenv**: Environment variable management

## Folder Details
- **controllers/**
  - `taskController.js`: Handles task-related logic
  - `teamController.js`: Handles team-related logic
  - `userControllers.js`: Handles user-related logic
- **middlewares/**
  - `auth.js`: Middleware for verifying JWT and user authentication
- **models/**
  - `taskModel.js`: Mongoose schema for tasks
  - `teamModel.js`: Mongoose schema for teams
  - `userModel.js`: Mongoose schema for users
  - `commentModel.js`: Mongoose schema for comments
- **routes/**
  - `taskRoutes.js`: Routes for task-related API endpoints
  - `teamRoutes.js`: Routes for team-related API endpoints
  - `userRoutes.js`: Routes for user-related API endpoints

## Usage
- Access the app at `http://localhost:<PORT>` (default: 3000)
- Register or log in to your account
- Create and manage tasks, assign them to team members, and track progress
- Create teams and invite members for better collaboration

## Troubleshooting
- **Port already in use:** Change the `PORT` variable in `.env`
- **Database connection errors:** Check your `MONGODB_URI` and ensure the database server is running
- **CORS issues:** Make sure your frontend is configured to use the correct backend URL

## Author
Manish 