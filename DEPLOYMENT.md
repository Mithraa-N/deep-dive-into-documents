# 🚀 Deployment Guide: Render

Prepare your **Deep Dive Docs** for the world. This project is optimized for deployment as a **Static Site** on Render.

## 1. Quick Deploy (Recommended)
The easiest way is to use the `render.yaml` file I've already created for you:

1.  Push your code to **GitHub** or **GitLab**.
2.  Log in to [Render](https://dashboard.render.com/).
3.  Click **"New +"** and select **"Blueprint"**.
4.  Connect your repository.
5.  Render will automatically detect the `render.yaml` and configure everything:
    *   **Environment**: Static Site
    *   **Build Command**: `npm install && npm run build`
    *   **Publish Directory**: `dist`
    *   **SPA Rewrites**: Automatically redirects all routes to `index.html`.

## 2. Manual Configuration (Alternative)
If you prefer to set it up manually:

1.  Select **"Static Site"** on Render.
2.  **Build Command**: `npm run build`
3.  **Publish Directory**: `dist` (⚠️ **CRITICAL**: Do NOT use your project name here. It must be `dist`.)
4.  **Advanced Options**:
    *   Add a **Rewrite Rule**:
        *   **Source**: `/*`
        *   **Destination**: `/index.html`
        *   **Action**: `Rewrite` (This is critical for React Router to work!)

## ⚡ Important Note on AI Models
Because the AI engine runs **entirely in the browser**, you don't need any special backend or GPU on Render! The "Static Site" tier is perfectly sufficient (and free!).

When users first visit your deployed site, their browser will download the required models (~130MB). After that, the site will be lightning-fast.
