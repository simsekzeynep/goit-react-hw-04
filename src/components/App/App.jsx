import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiCamera, FiImage, FiSearch } from "react-icons/fi";
import { searchPhotos, getErrorMessage } from "../../services/unsplash.js";
import SearchBar from "../SearchBar/SearchBar.jsx";
import ImageGallery from "../ImageGallery/ImageGallery.jsx";
import Loader from "../Loader/Loader.jsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn.jsx";
import ImageModal from "../ImageModal/ImageModal.jsx";
import css from "./App.module.css";

const SUGGESTED_SEARCHES = ["Architecture", "Nature", "Minimalism", "Travel"];

export default function App() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const activeRequest = useRef(null);

  useEffect(() => {
    const requestRef = activeRequest;
    return () => requestRef.current?.abort();
  }, []);

  async function fetchImages(searchTerm, requestedPage) {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;

    setLoading(true);
    setError("");

    try {
      const result = await searchPhotos({
        query: searchTerm,
        page: requestedPage,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      setImages((previous) => {
        if (requestedPage === 1) return result.images;
        const existingIds = new Set(previous.map((item) => item.id));
        return [
          ...previous,
          ...result.images.filter((item) => !existingIds.has(item.id)),
        ];
      });
      setCurrentPage(requestedPage);
      setTotalPages(result.totalPages);
    } catch (requestError) {
      if (!controller.signal.aborted) setError(getErrorMessage(requestError));
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setLoading(false);
      }
    }
  }

  function handleSearch(searchTerm) {
    const normalizedTerm = searchTerm.trim();
    if (!normalizedTerm) return;

    setQuery(normalizedTerm);
    setImages([]);
    setCurrentPage(0);
    setTotalPages(0);
    setHasSearched(true);
    setSelectedImage(null);
    fetchImages(normalizedTerm, 1);
  }

  function handleLoadMore() {
    if (activeRequest.current || loading || !query || currentPage >= totalPages) return;
    fetchImages(query, currentPage + 1);
  }

  const showGallery = images.length > 0 && !error;
  const showLoadMore = showGallery && !loading && currentPage < totalPages;
  const showEmptyResults = hasSearched && !loading && !error && images.length === 0;

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      <main className={css.main}>
        <section className={css.hero} aria-labelledby="hero-title">
          <div className={css.eyebrow}>
            <span className={css.eyebrowDot} />
            THE IMAGE DISCOVERY STUDIO
          </div>
          <h1 id="hero-title" className={css.title}>
            Every image tells <span>a story.</span>
          </h1>
          <p className={css.subtitle}>
            Discover extraordinary moments, beautiful places, and fresh ideas — all
            through the lens of talented photographers.
          </p>

          {!hasSearched && (
            <div className={css.suggestions} aria-label="Popular searches">
              <span className={css.suggestLabel}>Explore:</span>
              {SUGGESTED_SEARCHES.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className={css.suggestion}
                  onClick={() => handleSearch(suggestion)}
                >
                  {suggestion} <FiArrowUpRight aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </section>

        {hasSearched && (
          <section className={css.resultsSection} aria-label="Search results">
            <div className={css.resultsHeader}>
              <div>
                <span className={css.sectionEyebrow}>CURATED FOR YOU</span>
                <h2 className={css.resultsTitle}>
                  {error ? "Something went wrong" : `Results for “${query}”`}
                </h2>
              </div>
              {!error && images.length > 0 && (
                <div className={css.photoCount}>
                  <FiImage aria-hidden="true" />
                  {images.length} photos loaded
                </div>
              )}
            </div>

            {error ? (
              <ErrorMessage
                message={error}
                onRetry={() =>
                  fetchImages(query, images.length > 0 ? currentPage + 1 : 1)
                }
              />
            ) : (
              <>
                {showGallery && (
                  <ImageGallery images={images} onImageClick={setSelectedImage} />
                )}
                {loading && <Loader />}
                {showEmptyResults && (
                  <div className={css.emptyState} role="status">
                    <div className={css.emptyIcon}>
                      <FiSearch aria-hidden="true" />
                    </div>
                    <h3>No photos found</h3>
                    <p>
                      Try a different keyword. There are endless moments to discover.
                    </p>
                  </div>
                )}
                {showLoadMore && <LoadMoreBtn onClick={handleLoadMore} />}
              </>
            )}
          </section>
        )}

        {!hasSearched && (
          <div className={css.startState} aria-hidden="true">
            <FiCamera />
            <span>A universe of imagery is one search away</span>
          </div>
        )}
      </main>

      <footer className={css.footer}>
        <span>
          <strong>Luma.</strong> Made for the curious.
        </span>
        <span>
          Photos powered by{" "}
          <a
            href="https://unsplash.com/?utm_source=luma_image_gallery&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash <FiArrowUpRight aria-hidden="true" />
          </a>
        </span>
      </footer>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}
