# E-commerce Login Management API

This project is a REST API for login management, blocking after failed attempts, and password recovery for an e-commerce platform. It is designed for software testing studies and uses in-memory storage (no database).

## Features
- User login (with blocking after 3 failed attempts)
- Password recovery (simulated)
- In-memory user storage
- JSON communication
- Swagger API documentation
- Mocha & Supertest tests

## Getting Started

### Install dependencies
```
npm install
```

### Run the API
```
npm start
```
The server will start on [http://localhost:3000](http://localhost:3000).

### API Documentation
Swagger docs are available at:
```
http://localhost:3000/api-docs
```

### Run Tests
```
npm test
```

## Endpoints
- `POST /api/login` — User login
- `POST /api/recover` — Password recovery

See Swagger docs for full details.

## Notes
- All data is stored in-memory and resets on server restart.
- This API is for testing and educational purposes only. 