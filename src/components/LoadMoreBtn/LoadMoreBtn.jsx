import { FiArrowDown } from "react-icons/fi";
import css from "./LoadMoreBtn.module.css";

export default function LoadMoreBtn({ onClick }) {
  return (
    <div className={css.container}>
      <button className={css.button} type="button" onClick={onClick}>
        Load more <FiArrowDown aria-hidden="true" />
      </button>
    </div>
  );
}
