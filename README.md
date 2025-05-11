# 📚 WikiBookmarkTool

A full-stack application that lets users search Wikipedia articles, save them with auto-generated tags using Google's Gemini model (via Langchain), and manage their personal knowledge base — all secured with JWT-based authentication.

---

## ✨ Features

- 🔐 **User Authentication**: Register and log in using JWT-secured endpoints.
- 🔎 **Wikipedia Search**: Search for articles using the Wikipedia API.
- 🏷️ **Auto Tagging**: Automatically generate semantic tags for saved articles using Gemini via Langchain.
- 💾 **Bookmark Management**: Save, view, and manage favorite articles.
- 🗃️ **CockroachDB Support**: Scalable, resilient database setup with SQLAlchemy and async sessions.
- 🚀 **Modular FastAPI Backend**: Organized into routers, services, CRUD layers, and dependency injection.           |

---

## 📁 Project Structure
backend/
├── app/
│ ├── crud/
│ │ └── user.py
│ ├── db/
│ │ └── database.py
│ ├── models/
│ │ └── user.py
│ ├── routers/
│ │ ├── auth.py
│ │ ├── wiki.py
│ │ └── saved.py
│ ├── schemas/
│ │ └── user.py
│ ├── services/
│ │ └── llm.py
│ ├── util/
│ │ └── auth.py
│ └── main.py
├── .env
└── requirements.txt

📄 License
MIT License. 

🧑‍💻 Author
Built with ❤️ by Shubham Priyadarshi

