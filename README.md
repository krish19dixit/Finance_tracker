
#  Spend Savvy Scope — Personal Finance Tracker

A modern personal finance tracker web app built using **Next.js**, **MongoDB**, **Tailwind CSS**, and **ShadCN UI**. It lets users track transactions, visualize income and expenses, and manage financial metrics like balance, income, and spending — all in one place.

![screenshot](./public/screenshot.png) <!-- Optional: Add an image to showcase UI -->


## 🚀 Features

- ✅ Track income and expense transactions
- ✅ View and update total balance, income, and expense metrics
- ✅ Visual charts for monthly financial overview
- ✅ Editable dashboard cards with custom values
- ✅ Full transaction history with editable and deletable entries
- ✅ Simple and responsive UI powered by Tailwind and ShadCN
- ✅ Server-side API using MongoDB (via Mongoose)
- ✅ Modular codebase using latest Next.js App Router

## 🧑‍💻 Tech Stack

| Tech       | Description                      |
|------------|----------------------------------|
| **Next.js** | Full-stack React framework with App Router |
| **MongoDB** | NoSQL database for transactions & metrics |
| **Tailwind CSS** | Utility-first CSS styling framework |
| **ShadCN/UI** | Accessible and stylish UI components |
| **Recharts** | Pie charts for expense/income breakdown |
| **Axios** | API request handler on frontend |
| **React Query** | Data fetching and caching |


## 📦 Folder Structure (Next.js)
├── app/
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Main dashboard page
│   └── api/
│       └── finance/route.ts   # GET/POST API for financial data
├── components/                # Reusable components (Card, Chart, etc.)
├── lib/
│   └── db.ts                  # MongoDB connection setup
├── models/
│   └── Finance.ts             # Mongoose schema
├── styles/
│   └── globals.css            # Tailwind + design system
├── types/
│   └── Transaction.ts         # Shared TS types
└── public/                    # Static assets (e.g. screenshot.png)

## 🛠️ Getting Started

### 1. Clone the repo


git clone https://github.com/yourusername/spend-savvy-scope.git
cd spend-savvy-scope

### 2. Install dependencies


npm install

### 3. Create `.env.local`

env
MONGODB_URI=


> Replace with your MongoDB connection string.

### 4. Run the development server

bash
npm run dev


Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📊 Screenshots

| Dashboard                       | Edit Mode                       |
| ------------------------------- | ------------------------------- |
| ![dashboard](./public/dash.png) | ![edit-mode](./public/edit.png) |

---

## 🧪 API Routes

| Route          | Method | Description                  |
| -------------- | ------ | ---------------------------- |
| `/api/finance` | GET    | Fetch metrics + transactions |
| `/api/finance` | POST   | Update metrics               |

---

## 📘 Future Enhancements

* ✅ Editable users
* ✅ History panel for activity logs
* ⬜ Add user authentication
* ⬜ Export data to CSV
* ⬜ Mobile app with same backend

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT License

---

## 🙏 Acknowledgements

* [Next.js](https://nextjs.org/)
* [ShadCN/UI](https://ui.shadcn.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [MongoDB Atlas](https://www.mongodb.com/)

