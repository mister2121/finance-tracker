# 💰 Finance Tracker

A modern, full-stack personal finance management web application designed to replace clunky, non-responsive spreadsheets. Built with a **mobile-first** approach, it allows users to quickly log transactions, manage multiple accounts, and view automated financial insights on the go.

## 🚀 Features

### Phase 1 & 2: Core MVP
* **Secure Authentication:** Stateless auth using JWT and Spring Security.
* **Multi-Account Management:** Track balances across bank accounts, cash, and investments.
* **Custom Categories:** Dynamically define your own income and expense categories.
* **Intuitive Transaction Logging:** Quick-add forms designed for mobile screens (type, amount, category, date, and notes).

### Phase 3 & 4: Analytics & Polish (In Progress / Agile approach)
* **Interactive Dashboard:** Monthly and yearly toggles showing total balance, net savings, and active account states.
* **Visual Insights:** Charts representing monthly income vs. expenses and category breakdown.
* **Data Portability:** Export transaction history directly to CSV format.

---

## 🛠️ Tech Stack

### Backend
* **Language/Framework:** Java, Spring Boot
* **Security:** Spring Security, JWT (JSON Web Tokens)
* **Database:** PostgreSQL, Hibernate / Spring Data JPA
* **Validation:** Jakarta Bean Validation

### Frontend
* **Framework:** Angular (TypeScript)
* **Styling:** Tailwind CSS (Responsive, Mobile-First Design)

### DevOps & Tools
* **Containerization:** Docker
* **Version Control:** Git

---

## 💻 Getting Started

### Prerequisites
* Java 17 or higher
* Node.js & Angular CLI
* PostgreSQL instance running locally or via Docker

### 1. Backend Setup
1. Clone the repository and navigate to the backend directory.
2. Configure your PostgreSQL connection and JWT secret in `src/main/resources/application.properties` (or via environment variables).
3. Run the Spring Boot application:
   
    ./mvnw spring-boot:run

### 2. Frontend Setup
1. Navigate to the frontend directory.
2. Install the required dependencies:

    npm install

3. Start the Angular development server:

    ng serve

4. Open your browser and navigate to `http://localhost:4200`.

---
