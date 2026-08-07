/** One fixed, decorative golden-hour landscape for the year calendar hero. */
export function YearCalendarEndlessDutchSunsetBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f8e7d7_0%,#f7d2b4_52%,#dccda9_100%)]" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 640"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="endless-sky" x1="720" y1="0" x2="720" y2="438" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8E6D8" />
            <stop offset=".45" stopColor="#F6D2B7" />
            <stop offset=".78" stopColor="#F2C799" />
            <stop offset="1" stopColor="#DCCAA4" />
          </linearGradient>
          <radialGradient id="endless-halo" cx="0" cy="0" r="1" gradientTransform="translate(1005 292) rotate(90) scale(214 270)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF7D1" stopOpacity=".92" />
            <stop offset=".42" stopColor="#FFE7B2" stopOpacity=".48" />
            <stop offset="1" stopColor="#F8D4AF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="endless-far" x1="780" y1="358" x2="780" y2="474" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D7D3B4" />
            <stop offset="1" stopColor="#BCC19A" />
          </linearGradient>
          <linearGradient id="endless-middle" x1="760" y1="405" x2="760" y2="587" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B6BD83" />
            <stop offset="1" stopColor="#929D71" />
          </linearGradient>
          <linearGradient id="endless-front" x1="724" y1="501" x2="790" y2="651" gradientUnits="userSpaceOnUse">
            <stop stopColor="#82906A" />
            <stop offset="1" stopColor="#637461" />
          </linearGradient>
        </defs>

        <rect width="1440" height="640" fill="url(#endless-sky)" />
        <rect width="1440" height="640" fill="url(#endless-halo)" />

        {/* Quiet, broad atmosphere. The cloud band remains clear of the heading. */}
        <path d="M772 141C838 111 906 113 965 137C1016 158 1066 164 1123 148C1192 127 1271 132 1342 162C1376 177 1408 179 1440 176V211C1390 213 1346 202 1301 185C1237 160 1175 159 1116 180C1056 202 1003 197 951 177C890 153 830 160 790 181C779 169 767 158 751 151C758 148 765 144 772 141Z" fill="#FCEDE0" opacity=".58" />
        <path d="M948 246C977 226 1014 224 1040 240C1020 247 1004 258 987 273C968 268 950 261 931 258C936 253 941 249 948 246Z" fill="#F6C5AC" opacity=".42" />

        {/* A single large, softened sun just right of centre. */}
        <circle cx="1005" cy="300" r="76" fill="#FFF0B7" />
        <circle cx="1005" cy="300" r="76" fill="#FFF9D6" opacity=".28" />

        {/* The Dutch landscape is reduced to three wide, low organic ridges. */}
        <path d="M0 403C139 377 274 384 397 409C513 432 628 412 742 379C843 350 941 358 1039 385C1146 414 1246 393 1354 362C1385 353 1414 350 1440 351V486H0V403Z" fill="url(#endless-far)" opacity=".72" />
        <path d="M0 462C125 420 244 429 360 471C468 510 570 494 680 452C782 413 875 420 965 464C1067 514 1172 499 1279 446C1344 414 1402 419 1440 440V579H0V462Z" fill="url(#endless-middle)" />
        <path d="M0 548C110 509 222 518 329 561C437 604 539 594 645 555C760 514 859 530 949 573C1055 624 1172 600 1276 555C1347 525 1408 530 1440 549V640H0V548Z" fill="url(#endless-front)" />
        <path d="M0 607C93 576 190 585 280 620C319 636 355 644 392 640H0V607Z" fill="#52685B" opacity=".48" />
        <path d="M1155 640C1234 610 1319 602 1390 622C1411 628 1428 635 1440 640H1155Z" fill="#53665A" opacity=".52" />

        {/* Mobile intentionally has a separate, quieter composition beneath the copy. */}
        <g className="md:hidden">
          <circle cx="294" cy="404" r="47" fill="#FFF0B7" />
          <path d="M0 468C77 445 149 452 220 476C285 497 340 478 390 459V565H0V468Z" fill="#C6C69E" />
          <path d="M0 545C84 516 164 526 234 560C291 587 345 580 390 559V640H0V545Z" fill="#8D9A70" />
          <path d="M0 599C77 572 149 580 218 610C278 636 335 632 390 607V640H0V599Z" fill="#687963" />
        </g>

        {/* The desktop scene gets only a hint of wild grass and distant birds. */}
        <g className="hidden md:block" stroke="#596A58" strokeLinecap="round" fill="none">
          <path d="M144 595C151 572 160 559 175 549M155 601C165 576 177 562 193 553M1265 585C1275 562 1291 549 1310 540M1285 593C1297 567 1314 554 1336 546M1361 600C1371 579 1384 566 1402 558" strokeWidth="2.4" opacity=".72" />
          <path d="M1115 267C1122 260 1129 260 1136 267C1143 260 1150 260 1157 267M1169 281C1174 276 1179 276 1184 281C1189 276 1194 276 1199 281" strokeWidth="2.1" opacity=".52" />
        </g>
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,rgba(248,245,243,0)_0%,#f8f5f3_96%)]" />
    </div>
  );
}
