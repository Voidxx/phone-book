# Phonebook Application

This is a full-stack web application built with Spring Boot and React for managing contacts. The backend is implemented using Spring Boot and MongoDB, while the frontend is built with React.

## Features

- View a list of contacts
- Search contacts
- Sort contacts by first name, last name, or phone number
- Add a new contact
- Update an existing contact
- Delete a contact
- Import contacts from a CSV file
- Export contacts to a CSV file
- Upload contact pictures

## Technologies Used

### Backend

- Java
- Spring Boot
- Spring Data MongoDB
- Maven

### Frontend

- React
- React Router
- Axios

## Getting Started

### Prerequisites

- Java 17
- Node.js
- MongoDB
- Docker

### Backend Setup

1. Navigate to the `backend` directory.
2. Run `mvn clean install` to build the project.
3. Run `mvn spring-boot:run` to start the backend server.

The backend server will start running on `http://localhost:8080`.

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Run `npm install` to install the dependencies.
3. Run `npm start` to start the development server.

The frontend application will be available at `http://localhost:3000`.

### Database Setup

The project uses MongoDB as the database. You can run the database using Docker Compose by navigating to the `backend/db` directory and running the following command:
`docker-compose up -d`


This will start the MongoDB container and expose it on `localhost:27017`. The application configuration automatically finds the database on that port.

