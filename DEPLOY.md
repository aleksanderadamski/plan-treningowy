# Deployment Guide

This project is now configured for **Firebase Hosting**. This allows you to host the application on a professional, fast CDN that integrates perfectly with Firebase Authentication and Firestore.

## Prerequisites

1.  **Node.js & npm** must be installed on your machine.
2.  **Firebase CLI** should be installed. If you don't have it, run:
    ```bash
    npm install -g firebase-tools
    ```

## Step 1: Login to Firebase

Run the following command and follow the instructions in the browser window:
```bash
firebase login
```

## Step 2: Test Locally

Since the application uses **ES Modules** (`import` statements in JavaScript), it will no longer work if you simply open `index.html` as a file (`file://` protocol). You must serve it from a local web server.

You can use the Firebase CLI to test locally:
```bash
firebase serve --only hosting
```
Then open `http://localhost:5000` in your browser.

## Step 3: Deploy to Production

Once everything looks good locally, deploy to Firebase:
```bash
firebase deploy --only hosting
```

Your app will be live at a URL like:
`https://training-assistant-44a28.web.app`

## Troubleshooting

- **Auth Issues:** Ensure that `training-assistant-44a28.web.app` is added to the "Authorized domains" list in the Firebase Console (under Authentication > Settings > Authorized domains). *Note: Firebase Hosting domains are usually added automatically.*
- **Blank Page:** If the page is blank, check the browser console (F12) for error messages. Ensure all files (`app.js`, `workouts.js`, `styles.css`) are present in the root directory.
