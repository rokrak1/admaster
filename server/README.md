# Running the Backend

This document provides instructions for setting up and running the backend server for Admaster built with FastAPI. Please follow the steps carefully to ensure a smooth setup.

## Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.x
- pip (Python package manager)
- git (version control system)

## Installation

1. **Clone the Repository**

```bash
git clone [Your Repository URL]
cd [Your Project Directory]
```

2. **Set Up a Virtual Environment (Optional but Recommended)**

- For Windows:
  ```
  python -m venv venv
  venv\Scripts\activate
  ```
- For macOS and Linux:
  ```
  python3 -m venv venv
  source venv/bin/activate
  ```

3. **Install Dependencies**

```bash
pip install -r requirements.txt
```

## Running the Server

1. Navigate to the project directory (if not already there):

```bash
cd [Your Project Directory]
```

2. Start the FastAPI server using Uvicorn:

```bash
uvicorn main:app --reload
```

- `main`: the file where your FastAPI app is created.
- `app`: the FastAPI instance.
- `--reload`: makes the server restart after code changes. Only use this for development.

# Info about tokens

Access and refresh tokens are both send as HttpOnly cookie. This is done because supabase session_generation besides to refresh token also needs access token even if one is expired.
So instead of saving acces token in variable (which is reseted on page refresh) or local storage (which is vulnerable to XXS attacks) we save it as cookie.
