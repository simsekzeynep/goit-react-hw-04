import axios from "axios";

/**
 * Server-side Unsplash API route.
 * GET /api/search?query=nature&page=1
 * Keep the access key in server-side environment variables only.
 */
const PER_PAGE = 12;
const MAX_QUERY_LENGTH = 100;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey || accessKey === "your_unsplash_access_key_here") {
    return res.status(503).json({ error: "Unsplash API is not configured" });
  }

  const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
  const page = Number(req.query.page ?? 1);

  if (
    !query ||
    query.length > MAX_QUERY_LENGTH ||
    !Number.isSafeInteger(page) ||
    page < 1
  ) {
    return res.status(400).json({ error: "Invalid search query or page" });
  }

  try {
    const { data } = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query,
        page,
        per_page: PER_PAGE,
        content_filter: "high",
      },
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      timeout: 14000,
    });

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({
      results: data.results,
      total_pages: data.total_pages,
    });
  } catch (error) {
    if (error.response?.status) {
      return res.status(error.response.status).json({
        error: "Unable to retrieve Unsplash images",
      });
    }

    return res.status(502).json({ error: "Image service is temporarily unavailable" });
  }
}
