function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="glass-panel flex w-full items-center gap-3 p-3">
      <div className="rounded-xl bg-[#fff0f1] p-2 text-[#e55d66]">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="7" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by product title..."
        className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg px-2 py-1 text-xs uppercase tracking-wide text-slate-600 transition hover:bg-[#fff0f1] hover:text-[#e6535c]"
          aria-label="Clear search"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}

export default SearchBar;
