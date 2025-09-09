# ⚙️ CPU Scheduling Algorithms Visualizer

An **interactive web application** built with **Angular** to visualize **CPU scheduling algorithms** such as:

* ✅ **FIFO (First In First Out)**
* ✅ **SJF (Shortest Job First)**
* ✅ **Priority Scheduling**
* ✅ **Round Robin**
* ✅ **SRTF (Shortest Remaining Time First)**

The app generates **Gantt charts**, calculates **average waiting time**, **turnaround time**, and provides a **clear comparison between algorithms**.

![Demo Screenshot](./demo.png) <!-- Replace with actual image -->
![Dispatch\_Algorithms](<img width="1399" height="728" alt="image" src="https://github.com/user-attachments/assets/232abf26-9141-47d7-8112-0e086a8f5c2b" />)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-green?style=for-the-badge)](https://algoritmodespachoboshelljohan.netlify.app/)
[![Built With](https://img.shields.io/badge/Angular-19-red?style=for-the-badge\&logo=angular)](https://angular.dev)

---

## 🎯 Features

* 🔹 **Multiple Scheduling Algorithms** – FIFO, SJF, Priority, Round Robin, and SRTF
* 📊 **Dynamic Gantt Chart** – Visualize process execution in real-time
* ⏱ **Performance Metrics** – Average waiting time and turnaround time
* 🧩 **Custom Input** – Add processes with `burst time`, `arrival time`, `priority`, and `quantum`
* 🔄 **Interactive Controls** – Show/hide algorithms and update in real-time
* ✅ **Responsive UI** – Works on different screen sizes

---

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/BoshellJohan/Algoritmos_Despacho.git
   cd Algoritmos_Despacho
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   ng serve
   ```

   Navigate to: **[http://localhost:4200/](http://localhost:4200/)**

4. **Build for production**

   ```bash
   ng build
   ```

---

## 📂 Project Structure

```
so_project/
├── src/
│   ├── app/
│   │   ├── components/      # UI components (Gantt chart, inputs, etc.)
│   │   ├── services/        # Algorithm logic (FIFO, SJF, etc.)
│   │   ├── models/          # Process interface & types
│   │   └── app.component.ts # Main application logic
│   ├── assets/              # Static resources
│   └── main.ts              # Angular entry point
└── angular.json             # Angular config
```

---

## 📌 How It Works

👉 **\[Components]**

---

## 🛠 Built With

* **Angular 20**
* **TypeScript**
* **RxJS**
* **Netlify**

---

## ✅ Deployment on Netlify

If deploying on **Netlify**, ensure your `angular.json` is configured with:

* `outputPath: dist/so_project/browser` for the client build
* Use `netlify.toml` for SSR support (optional)

---

## 📸 Screenshots


---

## 🤝 Contributing

Feel free to fork this project and submit pull requests with improvements or new features.

---

Do you want me to **also include a section with example algorithms and expected Gantt outputs in Markdown tables** (for FIFO, SJF, etc.) to make the README even more complete? Or should I keep it more general?
