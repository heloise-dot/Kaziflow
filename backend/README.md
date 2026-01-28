# KaziFlow Backend Technical Documentation

KaziFlow is a robust Supply Chain Finance platform built with **FastAPI**, **SQLModel**, and **PostgreSQL**. It leverages **Google Gemini 2.0 Flash** for AI-driven risk assessment and provides a QR-based verification system for secure invoicing.

## 🏗️ System Architecture

The backend follows a modular router-based architecture for scalability and maintainability.

```mermaid
graph TD
    A[Client App] -->|HTTPS/JWT| B(FastAPI Gateway)
    B --> C{Routers}
    C -->|Auth| D[Auth Router]
    C -->|Invoices| E[Invoice Router]
    C -->|Risk| F[Risk Router]
    C -->|Notify| G[Notification Router]
    
    D & E & F & G -->|SQLModel| H[PostgreSQL DB]
    F -->|SDK| I[Google Gemini AI]
    E -->|Utilities| J[QR Generator]
```

## 🔒 Security & Authentication

- **JWT (JSON Web Tokens)**: Secure, stateless authentication.
- **Bcrypt**: Industry-standard password hashing using `passlib`.
- **RBAC (Role-Based Access Control)**: Enforced via FastAPI dependencies (`get_current_user`).
- **CORS**: Configured for secure frontend-backend communication.

## 🤖 AI Risk Analysis

Our AI service analyzes vendor stability using a **FIFO (First-In, First-Out) Back-Score** logic:
1.  **History Retrieval**: Fetches the last 5 invoices and 5 risk assessments.
2.  **Prompt Engineering**: Feeds historical status, amounts, and company details into Gemini 2.0 Flash.
3.  **Scoring**: Returns a 0-100 risk score and qualitative reasoning.

## 📄 API Reference (Swagger)

KaziFlow provides interactive API documentation out of the box. Once the server is running, you can access:

- **Interactive UI (Swagger)**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| Framework | FastAPI |
| ORM | SQLModel (SQLAlchemy) |
| Database | PostgreSQL (asynchronous via asyncpg) |
| AI | Google Gemini 2.0 Flash |
| Auth | python-jose, passlib |
| Documentation | OpenAPI (Swagger) |

## 🚀 Deployment & Local Setup

### 1. Requirements
- Python 3.10+
- PostgreSQL instance

### 2. Environment Variables (`.env`)
```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/kaziflow
GOOGLE_API_KEY=your_gemini_key
SECRET_KEY=your_jwt_secret
```

### 3. Installation
```bash
pip install -r backend/requirements.txt
python start_backend.py
```

---
*KaziFlow - Empowring Small Businesses through Secure Financing.*
