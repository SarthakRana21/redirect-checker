project preview



https://github.com/user-attachments/assets/612ca094-53c5-4168-b132-9a1f79971415




# 🔁 Redirect Checker

A web-based tool to bulk check redirects from 100 to 1000+ URLs via Excel upload. Built to eliminate the pain of manual checking and clunky script setups.

> Clean. Fast. Web-based. Queue it, track it, done.

---

## 🚀 Features

- 📥 Upload `.xlsx` file with URLs
- 📊 Queue management using **BullMQ** and **Redis**
- 🔁 Follows and records redirect chains
- 📄 Paginated results using [react-table-pagination-v1](https://www.npmjs.com/package/react-table-pagination-v1)
- ⚠️ Handles large jobs efficiently
- 🌐 Web UI for smooth experience

---

## 📦 Tech Stack

**Frontend**
- React.js
- TailwindCSS
- [react-table-pagination-v1](https://www.npmjs.com/package/react-table-pagination-v1)

**Backend**
- Node.js
- Express.js
- SQLite (with DrizzleORM)
- BullMQ
- Redis

---

## ⚙️ Setup

1. **Clone the repo**
```bash
git clone https://github.com/SarthakRana21/redirect-checker.git
cd redirect-checker
````

2. **Start Redis Server**
   Make sure Redis is running locally.

3. **Install dependencies**

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

4. **Run the app**

```bash
# Terminal 1: Redis
redis-server

# Terminal 2: Backend
cd server
npm run dev

# Terminal 3: Frontend
cd client
npm run dev
```

---

## 📄 Excel Format

Your file should be a `.xlsx` file with the following columns:




---

## 🙌 Special Thanks

Shoutout to [Vishal Kumar](https://www.npmjs.com/package/react-table-pagination-v1) for the pagination library that powers the UI table.

---

## 🔐 Note

The production instance is internal to the organization and not publicly hosted.

---

## 🧑‍💻 Author

[Sarthak Rana](https://github.com/SarthakRana21)

---

## ⭐️ Show Your Support

If you find this useful, consider giving the repo a ⭐️!

---

## 📃 License

MIT License
