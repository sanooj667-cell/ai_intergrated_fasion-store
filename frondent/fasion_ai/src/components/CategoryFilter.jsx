const GENDER_OPTIONS = ["", "male", "female", "unisex"];

function CategoryFilter({ categories, filters, onFilterChange, onReset }) {
  return (
    <div className="glass-panel space-y-4 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onFilterChange("category", "")}
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
            !filters.category ? "bg-[#ef5f67] text-white" : "bg-[#fff0f1] text-[#e6535c] hover:bg-[#ffe2e5]"
          }`}
        >
          All Categories
        </button>

        {categories.map((category) => {
          const isActive = filters.category === String(category.id);
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onFilterChange("category", String(category.id))}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                isActive ? "bg-[#ef5f67] text-white" : "bg-[#fff0f1] text-[#e6535c] hover:bg-[#ffe2e5]"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <select
          value={filters.gender}
          onChange={(event) => onFilterChange("gender", event.target.value)}
          className="rounded-xl border border-[#ffd5d9] bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#f08d96]"
        >
          {GENDER_OPTIONS.map((gender) => (
            <option key={gender || "all"} value={gender} className="bg-white text-slate-700">
              {gender ? gender.toUpperCase() : "ALL GENDERS"}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={filters.brand}
          onChange={(event) => onFilterChange("brand", event.target.value)}
          placeholder="Brand (e.g. Nike)"
          className="rounded-xl border border-[#ffd5d9] bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#f08d96]"
        />

        <input
          type="text"
          value={filters.sizes}
          onChange={(event) => onFilterChange("sizes", event.target.value)}
          placeholder="Sizes (e.g. M,XL)"
          className="rounded-xl border border-[#ffd5d9] bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#f08d96]"
        />

        <input
          type="text"
          value={filters.colors}
          onChange={(event) => onFilterChange("colors", event.target.value)}
          placeholder="Colors (e.g. black)"
          className="rounded-xl border border-[#ffd5d9] bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#f08d96]"
        />

        <button type="button" onClick={onReset} className="btn-ghost rounded-xl px-3 py-2 text-sm">
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default CategoryFilter;
