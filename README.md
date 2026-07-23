# Finance Tracker

A web app that helps to track and analyse how much you spend through the year.

[View demo](https://finance-tracker-nine-rho.vercel.app/)

## Features

- Track balances across different accounts that you specify.
- Dynamically define your own income and expense categories.
- Responsive design, designed for your phone.
- Monthly and yearly toggles showing total balance, net savings, and active account states.
- Charts representing monthly income vs. expenses and category breakdown.

## Tech Stack

- Java, Spring Boot
- PostgreSQL, Hibernate
- Angular (TypeScript)
- Tailwind CSS

---

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js & Angular CLI
- PostgreSQL instance running locally or via Docker

### 1. Backend Setup

1. Clone the repository and navigate to the backend directory.
2. Configure your PostgreSQL connection and JWT secret in `src/main/resources/application.properties` (or via environment variables).
3. Run the Spring Boot application.

### 2. Frontend Setup

1. Navigate to the frontend directory.
2. Install the required dependencies:

   npm install

3. Start the Angular development server:

   ng serve

4. Open your browser and navigate to `http://localhost:4200`.

---
