# PS10 — Infrared Image Colorization and Enhancement

### 🛰️ Project: Nicolas TIR Intelligence
**Bharatiya Antariksh Hackathon 2026**

---

## 📝 Overview
This project addresses the ISRO PS10 challenge: converting single-channel **Thermal Infrared (TIR)** imagery from Landsat-9 (200m resolution) into **Super-resolved (100m)** and **Colorized RGB** imagery for improved object interpretation.

## 🚀 Key Features
- **Deterministic Pipeline:** Physics-informed math model (Percentile Stretch + 8-Anchor LUT + Unsharp Masking).
- **2× Super-Resolution:** Upsampling 200m TIR to 100m for sharper detail.
- **AI Enhancement:** Optional Gemini AI integration for photorealistic visual refinement.
- **Earth Intelligence:** Live interpretation panels for Urban Heat, Pollution (AQI Proxy), and Hazard Alerts.
- **In-browser Compute:** Runs entirely in the client-side browser using TypeScript and Pyodide.

## 🛠️ Technical Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Framework:** TanStack Start (Router/Server functions)
- **Math:** Pure TypeScript (Float32Array operations)
- **Integration:** Google Gemini API for visual enhancement

## 📂 Repository Structure
- `app/`: Application routing and entry points.
- `src/`: Core logic, components, and mathematical models.
- `public/`: Sample datasets and static assets.
- `driver.py`: Python baseline script for dataset generation (ISRO aligned).

---

## 🏃 How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

---
**Team Nicolas** | ISRO BAH 2026 | PS10 Submission