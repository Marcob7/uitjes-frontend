/** Warm, indirect sunlight and a barely visible planner edge. */
export function YearCalendarSunlightBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
      {/* 1. Warm paper-like base. */}
      <div className="absolute inset-0 bg-[linear-gradient(122deg,#fff9e8_0%,#f9f2dc_52%,#e8f2ee_100%)]" />

      {/* 2. Broad daylight from the upper right. */}
      <svg className="absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 1440 640" fill="none" preserveAspectRatio="xMidYMax slice">
        <path d="M1048 -10L1344 -10L895 640H700L1048 -10Z" fill="#fff7d6" opacity="0.56" />
        <path d="M1268 -10H1450L1123 640H939L1268 -10Z" fill="#ffeeb5" opacity="0.3" />

        {/* 3. One language of soft leaf shadows, held to the far right. */}
        <g fill="#8aa687" opacity="0.12" transform="rotate(-18 1230 220)">
          <ellipse cx="1210" cy="118" rx="34" ry="88" /><ellipse cx="1274" cy="149" rx="28" ry="75" /><ellipse cx="1160" cy="206" rx="27" ry="74" />
          <ellipse cx="1328" cy="252" rx="30" ry="89" /><ellipse cx="1220" cy="316" rx="34" ry="92" /><ellipse cx="1372" cy="364" rx="26" ry="73" />
        </g>

        {/* 4. A planner sheet is mostly outside the frame, with only its rhythm showing. */}
        <g transform="rotate(5 1320 545)">
          <rect x="1114" y="468" width="474" height="272" rx="22" fill="#fbfaf2" opacity="0.8" />
          <rect x="1115" y="469" width="472" height="270" rx="22" stroke="#b9ccc1" strokeWidth="1" opacity="0.7" />
          <path d="M1150 524H1542M1150 574H1542M1150 624H1542M1208 500V700M1264 500V700M1320 500V700M1376 500V700M1432 500V700M1488 500V700" stroke="#91ad9e" strokeWidth="0.8" strokeOpacity="0.34" />
          <circle cx="1376" cy="574" r="15" fill="#d6c36f" fillOpacity="0.23" /><circle cx="1376" cy="574" r="5" fill="#77996b" fillOpacity="0.72" />
          <path d="M1540 664L1588 618V719C1588 731 1579 740 1567 740H1519L1540 664Z" fill="#e5eee3" opacity="0.78" />
        </g>

        {/* 5. A single cropped sunglasses rim suggests leisure without becoming an illustration. */}
        <path d="M1388 552C1410 526 1443 527 1464 552M1388 552C1410 577 1443 577 1464 552" stroke="#6c8d8b" strokeWidth="8" strokeLinecap="round" opacity="0.46" />
      </svg>

      {/* Mobile: one soft ray and only the very corner of the planner below the CTA area. */}
      <svg className="absolute inset-x-0 bottom-0 h-[16rem] w-full md:hidden" viewBox="0 0 390 256" fill="none" preserveAspectRatio="xMidYMax slice">
        <path d="M278 -12H392L262 256H156L278 -12Z" fill="#fff2bd" opacity="0.34" />
        <g transform="rotate(4 345 208)">
          <rect x="241" y="162" width="205" height="125" rx="14" fill="#fbfaf2" opacity="0.76" />
          <path d="M258 200H432M258 230H432M284 181V271M310 181V271M336 181V271M362 181V271M388 181V271" stroke="#94ad9f" strokeWidth="0.65" strokeOpacity="0.35" />
          <circle cx="336" cy="230" r="7" fill="#76996d" fillOpacity="0.62" />
        </g>
        <path d="M348 151C359 138 378 139 390 152" stroke="#6c8d8b" strokeWidth="5" strokeLinecap="round" opacity="0.4" />
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(248,245,243,0)_0%,#f8f5f3_94%)]" />
    </div>
  );
}
