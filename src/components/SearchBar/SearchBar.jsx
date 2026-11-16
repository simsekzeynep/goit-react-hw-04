import { useRef } from "react";
import { FiAperture, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import css from "./SearchBar.module.css";

export default function SearchBar({ onSubmit }) {
  const inputRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    const searchTerm = inputRef.current?.value.trim() ?? "";

    if (!searchTerm) {
      toast.error("Please enter a keyword to search for photos.");
      inputRef.current?.focus();
      return;
    }

    onSubmit(searchTerm);
  }

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a className={css.brand} href="/" aria-label="Luma, back to home">
          <span className={css.brandIcon}>
            <FiAperture aria-hidden="true" />
          </span>
          <span>
            Luma<span className={css.brandPeriod}>.</span>
          </span>
        </a>

        <form className={css.searchForm} onSubmit={handleSubmit} role="search">
          <FiSearch className={css.searchIcon} aria-hidden="true" />
          <input
            ref={inputRef}
            className={css.searchInput}
            type="search"
            name="search"
            aria-label="Search photos"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos..."
          />
          <button className={css.searchButton} type="submit">
            <FiSearch aria-hidden="true" />
            <span>Search</span>
          </button>
        </form>
        <div className={css.headerAside}>Visual inspiration, daily.</div>
      </div>
    </header>
  );
}
