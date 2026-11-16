# Luma — Image Search | GoIT React Homework 04

Image search built with **Vite + React**, the **Unsplash API**, **Axios**, **React Hot Toast**, **React Loader Spinner**, **React Modal**, and **CSS Modules**. Axios sends HTTP requests from the React app to our Vercel API route, and Axios also sends the server-side request to Unsplash. The access key stays on the server.

## Features

- Search for photographs by keyword; blank searches display a toast.
- Responsive image gallery displaying `urls.small`, with photographer credits.
- Load More appends a new page beneath existing images; loader is shown _below_ gallery.
- Full-size modal uses `urls.regular`, includes photographer information, likes and links, and closes by ESC, overlay click or the close button.
- Empty search, loading, error, missing API key and rate-limit states.
- Cancels stale requests when a new search begins; avoids duplicate photos across pages.
- Accessible labels, button semantics, keyboard interactions and Unsplash attribution.

## Run locally

1. `npm install`
2. Copy `.env.example` to `.env.local`.
3. Register a developer app at https://unsplash.com/developers and copy its **Access Key** (not the Secret Key) to `.env.local`:

   ```env
   UNSPLASH_ACCESS_KEY=YOUR_ACCESS_KEY
   ```

4. `npm run dev`.

Vite's development proxy forwards `/api/search` to Unsplash and attaches the key on the server side. Do not use a `VITE_` prefix because it would expose the key to the browser.

## Validate

```sh
npm run lint
npm run format:check
npm run build
```

## Deploy to Vercel

1. Push the project to a **public** repository named `goit-react-hw-04`.
2. Import the repository into Vercel (framework: Vite; build: `npm run build`; output: `dist`). Vercel serves `api/search.js` as a serverless function.
3. Under Project → Settings → Environment Variables add `UNSPLASH_ACCESS_KEY` for Production and Preview (server-side), then **redeploy**. Do not use `VITE_`.
4. Submit GitHub repository URL and Vercel production URL to GoIT.

### Security and API use

The Unsplash **Access Key** is stored only in server-side environment variables, **never** committed or sent in the browser bundle. Do not share the **Secret Key** or commit `.env.local`.

Unsplash demo apps are limited to 50 API calls per hour. The app only requests images on search and Load More. A short CDN cache on Vercel reduces repeated requests.

This app hotlinks the photo URLs returned by Unsplash and shows photographer/Unsplash attribution links with UTM referral parameters. See https://unsplash.com/documentation and https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines.

## Architecture

```text
api/
  search.js                 # private Unsplash API proxy on Vercel
src/
  components/
    App/             App.jsx             App.module.css
    SearchBar/       SearchBar.jsx       SearchBar.module.css
    ImageGallery/    ImageGallery.jsx    ImageGallery.module.css
    ImageCard/       ImageCard.jsx       ImageCard.module.css
    Loader/          Loader.jsx          Loader.module.css
    ErrorMessage/    ErrorMessage.jsx    ErrorMessage.module.css
    LoadMoreBtn/     LoadMoreBtn.jsx     LoadMoreBtn.module.css
    ImageModal/      ImageModal.jsx      ImageModal.module.css
  services/unsplash.js      # axios client wrapper
  main.jsx
  index.css
```

Each React component uses a default export, as required by the assignment.
