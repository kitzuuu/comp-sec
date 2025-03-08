# Computer Security Project (Easy Mode - OWASP Top 10 Demonstration)

## 1. Project Overview
This project has been developed as part of the **Computer Security (BSC2420)** course to demonstrate real-world security vulnerabilities based on the **OWASP Top 10 (2021) vulnerabilities**.

The objective is to intentionally implement and analyze security flaws in a **Next.js web application** connected to a **MySQL database**, simulating **common weaknesses found in modern web applications**.

The project follows the **Easy Mode** requirements, which mandate the inclusion of at least **six (6) OWASP Top 10 vulnerabilities** in the application. The identified vulnerabilities and their explanations are detailed below.

## 2. Technology Stack
- **Frontend:** Next.js (React 19)
- **Backend:** Next.js API routes
- **Database:** MySQL (local instance)
- **ORM:** Prisma
- **Authentication:** Basic login system
- **Styling:** Tailwind CSS

## 3. Repository and Branches

The project is hosted on GitHub at the following link:

git clone https://github.com/kitzuuu/comp-sec.git
This repository contains two distinct branches:

unsafe branch: Contains the intentionally vulnerable version of the application, showcasing security flaws based on the OWASP Top 10 vulnerabilities.
safe branch: Contains the secure version of the application, where the identified vulnerabilities have been patched to meet security best practices.
3.1 Cloning and Branch Management
The repository can be cloned using git clone, and branch switching can be performed using git checkout.

Windows users can clone the repository and switch branches using Command Prompt or PowerShell. Ensure Git is installed and properly configured.

Mac users can use Terminal to clone the repository and switch between branches. The default macOS Git installation should be sufficient.

Linux users can use Terminal to clone the repository and navigate between branches. If Git is not installed, it can be obtained from the system’s package manager.

To switch between branches:

Use the unsafe branch for the vulnerable version.
Use the safe branch for the patched version.

## 4. Setup Instructions

### 4.1 Install Dependencies
Ensure that **Node.js (version 18 or later)** is installed. After cloning the repository, install all required dependencies using the package manager.

### 4.2 Configure the Database
The application requires a **local MySQL instance** to store user authentication details and other data.

1. Ensure MySQL is installed and running on the local machine.
2. Create a database named `next_auth`.
3. Copy the example environment configuration file and modify it with the correct database credentials.
4. Define the database connection parameters in the `.env` file.

### 4.3 Apply Database Migrations
Once the database is configured, apply the Prisma migrations to ensure the required tables are created.

### 4.4 Start the Application
The application runs in **development mode**. After setting up the database and installing dependencies, the development server can be started.

The application will be available locally.

## 5. Implemented OWASP Top 10 Vulnerabilities (2021)

This project includes six security vulnerabilities categorized according to the **OWASP Top 10 (2021)** list.

### 5.1 A01:2021 - Broken Access Control
- The system does not restrict access to the **admin dashboard (`/admin-dashboard`)**.
- Any user can manually navigate to `/admin-dashboard` and gain access to sensitive administrative functionalities.


### 5.2 A02:2021 - Cryptographic Failures
- The application encrypts user passwords using the **Caesar Cipher**, which is an outdated and insecure encryption method.
- This approach does not protect user credentials and makes it trivial to recover stored passwords.

### 5.3 A03:2021 - Injection
- The **login system is vulnerable to SQL injection attacks** due to the lack of proper input sanitization.
- Attackers can bypass authentication using SQL injection techniques, such as entering `' OR 1=1 --` in the username field.

### 5.4 A04:2021 - Insecure Design
- The **Forgot Password feature does not verify user identity before displaying passwords**.
- When users request a password reset, the system **reveals the original password in plaintext** instead of securely resetting it.

### 5.5 A05:2021 - Security Misconfiguration
- The application does not log authentication attempts (failed or successful).
- Without authentication logging, there is no way to detect brute-force attempts or suspicious login behavior.

### 5.6 A07:2021 - Identification and Authentication Failures
- The system allows **extremely weak passwords**, such as `"1234"`, without enforcing any security policies.
- There are **no password complexity requirements** (e.g., minimum length, uppercase letters, special characters).

## 6. Important Notes

- This project is developed **exclusively for academic purposes** and **must not be deployed in production**.
- The security vulnerabilities included are **intentional** for demonstration and research purposes.
- The application must be executed in a **controlled environment** with appropriate precautions.
- The `unsafe` branch contains **known security flaws** and should only be used for educational analysis.
- The `safe` branch contains a **patched version** of the application with vulnerabilities fixed.
- The project must not be used for unauthorized security testing or malicious activities.

## 7. Contributors

This project was developed as part of the **Computer Security (BSC2420)** course by the following contributors:

- **Group 19**
    - **Huci Petrut-Rares**
    - **Nitu Toma Cristian**
