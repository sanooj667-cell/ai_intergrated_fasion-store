const GENDER_OPTIONS = ["", "male", "female", "unisex"];

function CategoryFilter({ categories, filters, onFilterChange, onReset }) {
  const pillClass = (active) =>
    `w-full rounded-xl px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide transition ${
      active ? "bg-[#ef5f67] text-white" : "bg-[#fff0f1] text-[#e6535c] hover:bg-[#ffe2e5]"
    }`;

  return (
    <aside className="glass-panel flex w-full flex-col gap-5 p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#e6535c]">Filters</p>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Category</p>
        <div className="flex max-h-52 flex-col gap-2 overflow-y-auto pr-1 lg:max-h-64">
          <button type="button" onClick={() => onFilterChange("category", "")} className={pillClass(!filters.category)}>
            All Categories
          </button>

          {categories.map((category) => {
            const isActive = filters.category === String(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onFilterChange("category", String(category.id))}
                className={pillClass(isActive)}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 border-t border-[#ffd5d9]/60 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Gender</p>
        <select
          value={filters.gender}
          onChange={(event) => onFilterChange("gender", event.target.value)}
          className="w-full rounded-xl border border-[#ffd5d9] bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#f08d96]"
        >
          {GENDER_OPTIONS.map((gender) => (
            <option key={gender || "all"} value={gender} className="bg-white text-slate-700">
              {gender ? gender.toUpperCase() : "ALL GENDERS"}
            </option>
          ))}
        </select>

        <p className="pt-1 text-xs font-medium uppercase tracking-wide text-slate-500">Brand</p>
        <input
          type="text"
          value={filters.brand}
          onChange={(event) => onFilterChange("brand", event.target.value)}
          placeholder="e.g. Nike"
          className="w-full rounded-xl border border-[#ffd5d9] bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#f08d96]"
        />

        <p className="pt-1 text-xs font-medium uppercase tracking-wide text-slate-500">Sizes</p>
        <input
          type="text"
          value={filters.sizes}
          onChange={(event) => onFilterChange("sizes", event.target.value)}
          placeholder="e.g. M, XL"
          className="w-full rounded-xl border border-[#ffd5d9] bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#f08d96]"
        />

        <p className="pt-1 text-xs font-medium uppercase tracking-wide text-slate-500">Colors</p>
        <input
          type="text"
          value={filters.colors}
          onChange={(event) => onFilterChange("colors", event.target.value)}
          placeholder="e.g. black"
          className="w-full rounded-xl border border-[#ffd5d9] bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#f08d96]"
        />
      </div>

      <button type="button" onClick={onReset} className="btn-ghost mt-1 w-full rounded-xl px-3 py-2.5 text-sm">
        Reset Filters
      </button>
    </aside>
  );
}

export default CategoryFilter;
