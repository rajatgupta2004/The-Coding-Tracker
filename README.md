# The Coding Tracker

#### A full-featured analytics web app for tracking, visualizing, and comparing competitive programming progress across platforms like LeetCode, Codeforces, CodeChef, and GFG — built for colleges and communities.

---
[![Website](https://img.shields.io/badge/Live-Demo-2ea44f?style=for-the-badge&logo=vercel&logoColor=white)](https://thecodingtracker.vercel.app/)
---

### Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Local Setup for Developers](#local-setup-for-developers)
---

# Overview

![Hero Preview](<img width="2560" height="1440" alt="Black Gradient Minimalistic Future Technology YouTube Banner (1)" src="https://github.com/user-attachments/assets/b2ea8c22-a223-408a-a062-e59bcd211d76" />)


**The Coding Tracker** is a real-time dashboard that tracks students' coding activity across platforms like LeetCode, Codeforces, GFG, and CodeChef.
 
It centralizes all progress in one place, eliminating the need to check profiles manually.
Mentors can filter by year, branch, section, or month to analyze trends and improvements.
Built for institutions, it highlights top performers and supports data-driven evaluations.

---

# Features

## 1. Leaderboard
![Leaderboard Preview](<img width="2560" height="1440" alt="2" src="https://github.com/user-attachments/assets/be2c8531-a51a-4df2-8df5-d3a4d34168e2" />
)
---

* View all users’ competitive programming stats in one place
* Filter and sort by year, branch, section, or platform metrics
* Download the leaderboard data as an Excel sheet
* Manually reload/fetch the latest data with a single click
* Click on a user to see their full analytics dashboard
* Quick access to their original platform profiles (LeetCode, CF, etc.)

---
## 2. Smart Username Validation
![Username error](<img width="2560" height="1440" alt="3" src="https://github.com/user-attachments/assets/9141e9e5-3b73-4eb3-a971-7a42baaa5a3f" />
)

Automatically detects and flags invalid or misspelled usernames during data entry.
Ensures only valid platform handles are tracked, preventing errors in analytics and leaderboard rankings.
Helpful messages guide users to correct their inputs instantly.


## 3.  Comprehensive Analytics Dashboard
![Analytics Dashboard](<img width="2560" height="1440" alt="4" src="https://github.com/user-attachments/assets/588fe14b-7f34-4f9b-aa82-253f5fa2c6b3" />
)


Tracks growth trends over time across platforms, highlights performance spikes, and enables mentor-level insights.
Supports filtering by year, branch, or month for targeted academic evaluations.


## 4. Smart Analytics with Graphs & Detailed Data
![Smart Analysis](<img width="2560" height="1440" alt="5" src="https://github.com/user-attachments/assets/c1a3e022-b45a-4e32-a2d6-b7b402016779" />
)

Get a clear picture of students progress with insightful graphs and in-depth stats.
Analyze coding trends, identify top performers, and monitor improvements over time — all in one place.
Designed for mentors to make data-driven decisions with ease.


## 5. Easy Student Data Integration
![adding student data](<img width="2560" height="1440" alt="6" src="https://github.com/user-attachments/assets/a5ab606c-2b0b-4c7b-a9e4-c27fce95e90a" />
)
Seamlessly add student data through a connected Google Form or directly from the platform.
This ensures quick onboarding and effortless management of large student batches.


# Tech Stack

| Frontend                | Backend           | Database | Others |
| ----------------------- | ----------------- | -------- | ------ |
| React.js + Tailwind CSS | Node.js + Express | MongoDB  | Vercel |


---


# Local Setup for Developers

To run this project locally:

### 1. Clone the repo
```bash
git clone https://github.com/rajatgupta2004/The-Coding-Tracker.git
cd the-coding-tracker
```
### 2. Go to Backend folder and do installation
```bash
cd ./backend
npm i
```
### 3. Setup .env
- create .env file in backend folder
- Copy the content of .env.example and paste it to .env
```bash
MONGODB_URI = "YOUR_MONGODB_URI"
SpreadSheet_ID="SPREADSHEET_ID"
PORT = 3000
```

### 4. Go to Frontend folder and do installation
```bash
cd ./frontend
npm i 
```
### 5. Run the backend
```bash
cd ./backend
node index.js
```

### 5. Run the frontend
```bash
cd ./frontend
npm run dev
```
---

## Developer
| Developer                | LinkedIn                                                     | GitHub                                           |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------ |
| **Rajat Gupta**        | [LinkedIn](https://www.linkedin.com/in/rajatgupta562004/)        | [GitHub](https://github.com/rajatgupta2004)

<a href="https://github.com/rajatgupta2004/the-coding-tracker/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=rajatgupta2004/the-coding-tracker" />
</a>

# Thanks for using our Platform ❤️
