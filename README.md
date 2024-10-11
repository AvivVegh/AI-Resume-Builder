# AI-Resume-Builder

## Prerequisites

- Node.js
- Docker

## Setup

### Backend

1. Navigate to the `backend` directory:

   ```sh
   cd backend
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `config.yaml` file in the `backend/src/config` directory with the necessary configuration.

4. Start the backend server:
   ```sh
   npm run start
   ```

### Web

1. Navigate to the `web` directory:

   ```sh
   cd web
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the `web` directory with the necessary environment variables.

4. Start the web server:
   ```sh
   npm run dev
   ```

## Running with Docker

1. Ensure Docker and Docker Compose are installed on your machine.

2. Build and start the services:
   ```sh
   docker-compose up --build
   ```

## Usage

- Access the web application at `http://localhost:3000`.
- The backend API will be available at `http://localhost:3001`.

## API Endpoints

### Backend

- `POST /api/resume`: Create a resume.
- `GET /api/resume/text`: Get resume text.
- `GET /auth/google`: Google authentication.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
