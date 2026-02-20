# 🌊 Deep Dive Docs | Local Intelligence Analysis

![Version](https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Built With](https://img.shields.io/badge/built%20with-React%20%2B%20Vite%20%2B%20Transformers.js-blue?style=for-the-badge)

**Deep Dive Docs** is a state-of-the-art document analysis tool that brings high-performance AI intelligence directly to your browser. Analyze massive PDFs, DOCX, and text files with zero data leaving your device.

[View Live Demo](#) · [Report Bug](https://github.com/Mithraa-N/deep-dive-into-documents/issues) · [Request Feature](https://github.com/Mithraa-N/deep-dive-into-documents/issues)

---

## ✨ Key Features

- **🛡️ 100% Privacy-First**: All AI processing happens locally via `Transformers.js`. Your documents never touch a server.
- **🧠 Semantic Hybrid Search**: Combines traditional keyword matching with deep vector embeddings for precise context retrieval.
- **📑 Direct Evidence Synthesis**: The AI doesn't just summarize—it extracts verbatim evidence with section and paragraph references.
- **⚡ Zero-API Architecture**: No OpenAI keys or subscription required. Runs entirely on your hardware.
- **🎨 Premium Interface**: A sleek, dark-themed glassmorphism UI designed for focus and productivity.
- **🚀 Large Document Support**: Optimized indexing engine capable of handling "heavy" documents without browser hanging.

---

## 🛠️ Technical Stack

- **Frontend core**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **AI Engine**: [@xenova/transformers](https://huggingface.co/docs/transformers.js/) (Local inference)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [React Query](https://tanstack.com/query/latest)
- **File Parsing**: [PDF.js](https://mozilla.github.io/pdf.js/) & [Mammoth.js](https://github.com/mwilliamson/mammoth.js)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Mithraa-N/deep-dive-into-documents.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```

---

## 🎨 Design System

The application uses a custom-built premium design system defined in `src/index.css`:
- **Glassmorphism**: High-blur panels for an immersive feel.
- **Dynamic Glows**: Subtle radial gradients that track interaction.
- **Typography**: Optimized with `Inter` for data and `Outfit` for brand identity.

---

## 📦 Deployment

This project is optimized for deployment on **Render** (as a Static Site):
1. Connect your repo to Render.
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Add a rewrite rule for SPA logic: `/*` -> `/index.html` (Action: Rewrite).

See [DEPLOYMENT.md](./DEPLOYMENT.md) for more details.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for the Developer Community
</p>
