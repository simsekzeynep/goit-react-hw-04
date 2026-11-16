import { TailSpin } from "react-loader-spinner";
import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div
      className={css.loader}
      role="status"
      aria-live="polite"
      aria-label="Loading images"
    >
      <TailSpin visible height="35" width="35" color="#4e5cce" ariaLabel="Loading" />
      <span>Finding beautiful moments...</span>
    </div>
  );
}
