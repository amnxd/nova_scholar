# Nova Scholar

Nova Scholar is an AI-based Academic Assistant platform designed to help students with their academic needs.

## Project Structure

This is a monorepo containing the following workspaces:

- **Frontend (`apps/web`)**: Next.js 16 (App Router) with Tailwind CSS 4.
- **Backend (`apps/api`)**: FastAPI backend for API services.
- **AI Research (`packages/ai`)**: Python environment for AI agents and research scripts.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.12+)
- Firebase Project Credentials

### Installation

1.  **Frontend**:
    ```bash
    cd apps/web
    npm install
    npm run dev
    ```

2.  **Backend**:
    ```bash
    cd apps/api
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

3.  **AI Research**:
    ```bash
    cd packages/ai
    pip install -r requirements.txt
    ```
