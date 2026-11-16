import { FiArrowUpRight } from "react-icons/fi";
import { getUnsplashLink } from "../../services/unsplash.js";
import css from "./ImageCard.module.css";

export default function ImageCard({ image, onClick }) {
  const description =
    image.alt_description || image.description || "Unsplash photograph";
  const photographerName = image.user?.name || "Unknown photographer";
  const photographerUrl = getUnsplashLink(image.user?.links?.html);
  const unsplashUrl = getUnsplashLink(image.links?.html);

  return (
    <div className={css.card}>
      <button
        className={css.photoButton}
        type="button"
        onClick={onClick}
        aria-label={`Open photo: ${description}`}
      >
        <div className={css.photoWrapper}>
          <img
            className={css.image}
            src={image.urls.small}
            alt={description}
            loading="lazy"
            decoding="async"
          />
          <span className={css.openIcon} aria-hidden="true">
            <FiArrowUpRight />
          </span>
        </div>
      </button>
      <div className={css.cardCaption}>
        <span className={css.credit}>
          By{" "}
          <a href={photographerUrl} target="_blank" rel="noopener noreferrer">
            {photographerName}
          </a>{" "}
          on{" "}
          <a href={unsplashUrl} target="_blank" rel="noopener noreferrer">
            Unsplash
          </a>
        </span>
        <span className={css.viewText}>VIEW PHOTO</span>
      </div>
    </div>
  );
}
