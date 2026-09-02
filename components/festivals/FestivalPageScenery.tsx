export default function FestivalPageScenery() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden h-[620px] overflow-hidden sm:h-[700px] lg:h-[820px] min-[1500px]:block"
    >
      <svg
        viewBox="0 0 360 64"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
        className="absolute inset-x-0 top-[5.25rem] h-14 w-full sm:hidden"
      >
        <path
          d="M-10 12Q80 54 180 47t190-35"
          fill="none"
          stroke="#7a4a58"
          strokeOpacity="0.38"
          strokeWidth="2"
        />
        <g fillOpacity="0.9">
          <circle cx="27" cy="27" r="5" fill="#d99b6c" />
          <circle cx="73" cy="41" r="5" fill="#c46f78" />
          <circle cx="119" cy="47" r="5" fill="#f1c38f" />
          <circle cx="165" cy="44" r="5" fill="#d99b6c" />
          <circle cx="211" cy="38" r="5" fill="#c46f78" />
          <circle cx="257" cy="27" r="5" fill="#f1c38f" />
          <circle cx="303" cy="13" r="5" fill="#d99b6c" />
        </g>
      </svg>
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMin slice"
        focusable="false"
        className="hidden h-full w-full sm:block"
      >
        <defs>
          <linearGradient id="festivalSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8f2ee" />
            <stop offset="45%" stopColor="#f3e3df" />
            <stop offset="100%" stopColor="#f4eee9" />
          </linearGradient>
          <radialGradient id="eveningGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e4a078" stopOpacity="0.24" />
            <stop offset="55%" stopColor="#d89a91" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#d89a91" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="centralAtmosphere" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e7b7aa" stopOpacity="0.14" />
            <stop offset="55%" stopColor="#efdad4" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f7f2ee" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8f5f3" stopOpacity="0" />
            <stop offset="100%" stopColor="#f8f5f3" />
          </linearGradient>
        </defs>

        <rect width="1600" height="900" fill="url(#festivalSky)" />
        <ellipse cx="1330" cy="145" rx="380" ry="285" fill="url(#eveningGlow)" />
        <ellipse cx="800" cy="330" rx="620" ry="290" fill="url(#centralAtmosphere)" />

        <path d="M-80 590C180 540 360 570 560 535c200-35 370 10 560-15 200-25 360 15 560-20v400H-80Z" fill="#ead7d2" fillOpacity="0.68" />
        <path d="M-80 660c260-55 435-18 620-66 190-49 365 16 555-22 210-42 375 17 585-3v331H-80Z" fill="#d9bab1" fillOpacity="0.58" />
        <path d="M-80 726c245-39 430-4 625-47 205-45 363 12 560-9 210-22 362 22 575-14v244H-80Z" fill="#a6aa8d" fillOpacity="0.74" />

        <path d="M-40 120Q250 205 570 155" fill="none" stroke="#7a4a58" strokeOpacity="0.24" strokeWidth="2" />
        <g fillOpacity="0.62">
          <circle cx="58" cy="143" r="5" fill="#d99b6c" /><circle cx="146" cy="167" r="5" fill="#c46f78" /><circle cx="236" cy="182" r="5" fill="#f1c38f" /><circle cx="328" cy="188" r="5" fill="#d99b6c" /><circle cx="420" cy="183" r="5" fill="#c46f78" /><circle cx="510" cy="166" r="5" fill="#f1c38f" />
        </g>
        <path d="M1030 155q320 50 610-50" fill="none" stroke="#7a4a58" strokeOpacity="0.24" strokeWidth="2" />
        <g fillOpacity="0.62">
          <circle cx="1085" cy="166" r="5" fill="#f1c38f" /><circle cx="1178" cy="184" r="5" fill="#c46f78" /><circle cx="1270" cy="190" r="5" fill="#d99b6c" /><circle cx="1362" cy="183" r="5" fill="#f1c38f" /><circle cx="1453" cy="164" r="5" fill="#c46f78" /><circle cx="1540" cy="138" r="5" fill="#d99b6c" />
        </g>

        <g opacity="0.7">
          <path d="M1128 603l44-51 44 51Z" fill="#9f5367" /><path d="M1138 603h68v29h-68Z" fill="#f0d4bd" />
          <path d="M1288 630l33-39 33 39Z" fill="#c9846f" /><path d="M1295 630h52v22h-52Z" fill="#f0d4bd" />
          <path d="M266 641l28-33 28 33Z" fill="#9f5367" /><path d="M272 641h44v18h-44Z" fill="#f0d4bd" />
        </g>
        <g fill="#e9b173">
          <circle cx="1104" cy="636" r="4" fillOpacity="0.42" /><circle cx="1131" cy="646" r="3" fillOpacity="0.52" /><circle cx="1218" cy="633" r="4" fillOpacity="0.34" /><circle cx="1267" cy="655" r="3" fillOpacity="0.5" /><circle cx="1356" cy="654" r="4" fillOpacity="0.38" /><circle cx="335" cy="663" r="3" fillOpacity="0.35" />
        </g>

        <g fill="none" strokeLinecap="round">
          <path d="M0 900c22-95 35-163 95-216M34 900c34-74 63-129 132-172M1600 900c-29-91-52-157-116-209M1567 900c-38-70-72-121-143-162" stroke="#7f876c" strokeWidth="11" strokeOpacity="0.48" />
          <path d="M13 900c10-82 11-143 43-205M72 900c18-66 40-117 85-160M1588 900c-11-77-18-134-51-194M1522 900c-24-61-51-107-98-150" stroke="#b2b49a" strokeWidth="7" strokeOpacity="0.56" />
          <path d="M110 900c5-56-2-104-23-147M1490 900c-4-57 3-105 25-148" stroke="#969b7d" strokeWidth="6" strokeOpacity="0.5" />
        </g>
        <rect x="0" y="690" width="1600" height="210" fill="url(#bottomFade)" />
      </svg>
    </div>
  );
}
