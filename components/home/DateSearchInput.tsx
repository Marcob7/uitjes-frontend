type DateSearchInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  errorMessage?: string | null;
  isSearching?: boolean;
};

export default function DateSearchInput({
  value = "",
  onChange,
  onSearch,
  placeholder = "Zoek op stad, festival of activiteit",
  errorMessage,
  isSearching = false,
}: DateSearchInputProps) {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full flex-col items-center">
        <div className="mb-2 rounded-full bg-white/55 px-4 py-1 shadow-sm backdrop-blur-sm">
          <span className="text-[18px] font-extrabold uppercase leading-none tracking-[-0.02em] text-[#202020]">
       VIND DINGEN OM TE DOEN
          </span>
        </div>

        <div className="flex h-[56px] w-[min(400px,calc(100vw-2rem))] items-center rounded-full border-[4px] border-white bg-[#dedede] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <input
            type="search"
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSearch?.();
              }
            }}
            placeholder={placeholder}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? "home-search-error" : undefined}
            enterKeyHint="search"
            inputMode="search"
            autoComplete="off"
            spellCheck={false}
            className="h-full min-w-0 flex-1 rounded-l-full bg-transparent px-6 text-center text-[16px] font-semibold text-[#202020] outline-none placeholder:text-[#202020] sm:px-8 sm:text-[17px]"
          />

          <button
            type="button"
            onClick={onSearch}
            aria-label="Search"
            disabled={isSearching}
            className="mr-[4px] flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#00652c] text-white transition-transform duration-150 hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </div>

        {errorMessage ? (
          <p
            id="home-search-error"
            role="status"
            aria-live="polite"
            className="mt-2 w-[min(400px,calc(100vw-2rem))] rounded-2xl bg-white/90 px-4 py-2 text-center text-sm font-semibold leading-5 text-[#202020] shadow-sm backdrop-blur-sm"
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
