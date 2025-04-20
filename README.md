# Bakery Order System

## System Architecture Overview

This project is a full-stack bakery order management system built using **Docker**, **Node.js**, **PostgreSQL**, **Redis**, and **RabbitMQ**. The system allows users to view bakery products, place orders, and track order statuses. The backend leverages a message queue (RabbitMQ) to process orders asynchronously and updates the order status in the database.

### Key Components

1. **Frontend (React.js with Vite)**:
   - Displays a list of bakery products.
   - Allows users to place orders.
   - Users can check the order status with a single click.
   - The UI is designed with a minimalistic, cute theme using **Material UI** and **soft pastel colors**.

2. **Backend (Node.js + Express.js)**:
   - Handles API requests from the frontend.
   - Interacts with **PostgreSQL** to store product information and orders.
   - Uses **Redis** for caching product data.
   - Sends order messages to **RabbitMQ** for asynchronous processing.

3. **PostgreSQL**:
   - Stores bakery product details and order information.
   - Initialized with default product data in `init.sql`.

4. **Redis**:
   - Caches product information to improve read performance.

5. **RabbitMQ**:
   - Used for processing orders asynchronously. When an order is placed, the backend sends the order to RabbitMQ, and a worker process updates the order status.

6. **Docker**:
   - The entire system is containerized using Docker, with services orchestrated via `docker-compose`.

## Setup Instructions

Follow these steps to set up the project on your local machine:

### Prerequisites
- Install **Docker** and **Docker Compose**.

### Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd <project-directory>
   ```

2. **Build and start the services with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the services:**
   - **Frontend (React)**: Visit `http://localhost:5173` to see the app in action.
   - **Backend (API)**: The backend API will be available at `http://localhost:3000/`.
   - **RabbitMQ Management UI**: Visit `http://localhost:15672/` (username: `user`, password: `password`) to monitor queues.
   - **PostgreSQL**: Connect to PostgreSQL on `localhost:5432`.

4. **To stop the services:**
   ```bash
   docker-compose down
   ```

---

## API Documentation

### Endpoints

#### 1. **GET /products**
- **Description**: Fetches a list of all bakery products.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "Chocolate Cake",
      "price": "15.99",
      "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    ...
  ]
  ```

#### 2. **POST /order**
- **Description**: Creates a new order.
- **Request Body**:
  ```json
  {
    "product_id": 1,
    "customer_name": "John Doe",
    "quantity": 2
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "product_id": 1,
    "customer_name": "John Doe",
    "status": "Pending"
  }
  ```

#### 3. **GET /order/:id**
- **Description**: Fetches the status of an order.
- **Response**:
  ```json
  {
    "id": 1,
    "product_id": 1,
    "customer_name": "John Doe",
    "status": "Processing"
  }
  ```

---

## Brief Report on Design Decisions

### **1. Choice of Technologies:**

- **React.js for Frontend**: React was chosen for its component-based architecture, enabling easy management of the UI and state. The use of React ensures scalability and reusability of components.
  
- **Node.js with Express.js for Backend**: Node.js was chosen due to its non-blocking I/O, making it a great choice for real-time applications. Express.js provides a lightweight, flexible framework for building the backend API.
  
- **PostgreSQL for Data Persistence**: PostgreSQL was selected due to its reliability and support for complex queries. It’s used to store product details and orders.
  
- **Redis for Caching**: Redis was used to cache frequently accessed product data, reducing the load on PostgreSQL and improving response times.
  
- **RabbitMQ for Message Queuing**: RabbitMQ handles asynchronous order processing, allowing orders to be queued and processed in the background, thus enhancing system scalability and decoupling.

- **Docker and Docker Compose**: Docker is used to containerize the application, ensuring that the development and production environments are consistent. Docker Compose simplifies managing multi-container applications.

### **2. System Design:**

- **Separation of Concerns**: The system follows a microservice-based architecture with clear separation of concerns between frontend, backend, database, and message queue. This ensures modularity and maintainability.

- **Asynchronous Processing**: By using RabbitMQ for order processing, we avoid blocking the main thread and ensure that the system can handle high traffic without degradation in performance.

- **Data Integrity**: PostgreSQL ensures data integrity with ACID-compliant transactions. The use of Redis ensures that frequently queried data, such as product information, is readily available.

### **3. UI/UX Design:**

- The UI follows a **minimalistic, cute design** with soft pastel colors to provide a pleasant user experience. 
- **Responsiveness**: The layout adjusts to different screen sizes, ensuring a good user experience on both mobile and desktop devices.
  
### **4. Scalability Considerations:**

- **Message Queuing with RabbitMQ**: RabbitMQ ensures that orders can be processed asynchronously, and the system can scale by adding more workers to handle orders.
- **Docker**: The use of Docker ensures that the application is easily deployable and can scale horizontally by adding more container instances.

---