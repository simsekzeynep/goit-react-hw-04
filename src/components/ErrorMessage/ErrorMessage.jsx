import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import css from "./ErrorMessage.module.css";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className={css.error} role="alert">
      <div className={css.icon}>
        <FiAlertCircle aria-hidden="true" />
      </div>
      <h3>We hit a little roadblock.</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className={css.retry} onClick={onRetry}>
          <FiRefreshCw aria-hidden="true" /> Try again
        </button>
      )}
    </div>
  );
}
