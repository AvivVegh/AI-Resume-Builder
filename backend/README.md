# AI Resume Builder Backend

This repo is the backend of the AI Resume Builder project.

## Usage

### Prerequisite

This project is using Serverless framework.

### Local

1. `docker-compose up -d --build`
2. `npm run migration:run`
3. `npm run dev`

## API Endpoints

### Authentication

- `GET /auth/google`: Initiates Google authentication.
- `GET /auth/google/callback`: Handles the callback from Google authentication.
- `GET /auth/logout`: Logs out the user.

### Profile

- `GET /profile`: Retrieves the user's profile.

### Resume

- `POST /ai/create-resume`: Creates a resume.
- `GET /ai/resume`: Retrieves resume json.

## Running with Docker

1. Ensure Docker and Docker Compose are installed on your machine.

2. Build and start the services:
   ```sh
   docker-compose up --build
   ```
