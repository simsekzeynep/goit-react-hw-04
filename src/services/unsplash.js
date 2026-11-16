import axios from "axios";

/**
 * The access key lives on the server. The browser requests our own API route.
 * This keeps the Unsplash credentials out of the client bundle.
 */
export async function searchPhotos({ query, page = 1, signal }) {
  const { data } = await axios.get("/api/search", {
    params: { query, page },
    signal,
    timeout: 20000,
  });

  return { images: data.results, totalPages: data.total_pages };
}

export function getErrorMessage(error) {
  const status = error?.response?.status;

  if (status === 401) {
    return "Unsplash authentication failed. Please check the configured Access Key.";
  }
  if (status === 403 || status === 429) {
    return "The Unsplash request limit has been reached. Please try again later.";
  }
  if (status === 503) {
    return "Unsplash is not configured yet. Add UNSPLASH_ACCESS_KEY in your environment settings.";
  }
  return "We couldn't fetch your photos right now. Check your connection and try again.";
}

/** Add mandatory Unsplash UTM attribution to a photo or photographer link. */
export function getUnsplashLink(url) {
  const link = new URL(url || "https://unsplash.com");
  link.searchParams.set("utm_source", "luma_image_gallery");
  link.searchParams.set("utm_medium", "referral");
  return link.toString();
}
