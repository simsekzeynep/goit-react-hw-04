import Modal from "react-modal";
import { FiArrowUpRight, FiHeart, FiX } from "react-icons/fi";
import css from "./ImageModal.module.css";
import { getUnsplashLink } from "../../services/unsplash.js";

Modal.setAppElement("#root");

export default function ImageModal({ image, onClose }) {
  const description =
    image?.alt_description || image?.description || "Unsplash photograph";
  const photoUrl = image?.links?.html ? getUnsplashLink(image.links.html) : null;
  const photographerUrl = image?.user?.links?.html
    ? getUnsplashLink(image.user.links.html)
    : null;

  return (
    <Modal
      isOpen={Boolean(image)}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      closeTimeoutMS={160}
      className={css.dialog}
      overlayClassName={css.overlay}
      contentLabel={description}
      bodyOpenClassName="ReactModal__Body--open"
    >
      {image && (
        <div className={css.layout}>
          <button
            className={css.closeButton}
            type="button"
            onClick={onClose}
            aria-label="Close photo"
          >
            <FiX aria-hidden="true" />
          </button>
          <div className={css.imagePanel}>
            <img className={css.image} src={image.urls.regular} alt={description} />
          </div>
          <div className={css.details}>
            <div>
              <span className={css.eyebrow}>THE STORY BEHIND THE SHOT</span>
              <h2>
                {image.description ||
                  image.alt_description ||
                  "A moment worth keeping."}
              </h2>
            </div>
            <div className={css.creditRow}>
              {image.user?.profile_image?.medium && (
                <img
                  src={image.user.profile_image.medium}
                  alt=""
                  className={css.avatar}
                />
              )}
              <div className={css.creditText}>
                <span>PHOTOGRAPHED BY</span>
                {photographerUrl ? (
                  <a href={photographerUrl} target="_blank" rel="noopener noreferrer">
                    {image.user.name} <FiArrowUpRight aria-hidden="true" />
                  </a>
                ) : (
                  <strong>{image.user?.name || "Unknown"}</strong>
                )}
              </div>
            </div>
            <div className={css.meta}>
              <span>
                <FiHeart aria-hidden="true" /> {image.likes?.toLocaleString() ?? 0}{" "}
                likes
              </span>
              {image.width && image.height && (
                <span>
                  {image.width} × {image.height}
                </span>
              )}
            </div>
            {photoUrl && (
              <a
                className={css.unsplashLink}
                href={photoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Unsplash <FiArrowUpRight aria-hidden="true" />
              </a>
            )}
            <p className={css.hint}>Press ESC or click outside to close.</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
