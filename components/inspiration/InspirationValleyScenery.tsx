export function InspirationValleyScenery() {
  return (
    <div
      aria-hidden="true"
      className="inspiration-valley pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div className="inspiration-valley__sky absolute inset-0" />
      <div className="inspiration-valley__sun absolute right-[12%] top-24 h-20 w-20 rounded-full bg-[#f3d38b]/45 blur-[1px] sm:right-[17%] sm:top-20 sm:h-24 sm:w-24" />
      <div className="inspiration-valley__cloud inspiration-valley__cloud--one absolute right-[27%] top-40 h-5 w-24 rounded-full bg-white/35 blur-[1px] sm:top-36 sm:w-32" />
      <div className="inspiration-valley__cloud inspiration-valley__cloud--two absolute right-[7%] top-60 hidden h-4 w-20 rounded-full bg-white/26 blur-[1px] md:block" />

      <svg
        className="inspiration-valley__landscape absolute left-1/2 top-[16rem] h-auto min-h-[25rem] w-[175vw] max-w-none -translate-x-1/2 min-[520px]:top-[17rem] min-[520px]:min-h-[28rem] min-[520px]:w-[155vw] md:bottom-[-1rem] md:left-auto md:right-0 md:top-auto md:min-h-[44rem] md:w-[max(1850px,122vw)] md:translate-x-0"
        viewBox="0 0 1600 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax slice"
      >
        <path d="M0 478C194 416 358 422 529 475C692 526 873 513 1041 443C1216 370 1400 381 1600 457V900H0V478Z" fill="#e3ead5" opacity=".76" />
        <path d="M0 568C179 495 378 511 551 573C707 629 894 611 1057 535C1225 456 1433 482 1600 549V900H0V568Z" fill="#cdddb8" opacity=".88" />
        <path d="M0 657C207 587 386 612 556 675C733 741 886 709 1062 638C1239 567 1440 592 1600 661V900H0V657Z" fill="#a9c28e" />

        <path d="M1088 900C1095 820 1080 756 1110 697C1138 642 1192 610 1190 557C1189 512 1162 481 1172 442" stroke="#eee2c5" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" opacity=".82" />

        <g className="inspiration-valley__trees" fill="#66845c">
          <path d="M1198 582c0-25 18-45 41-45s41 20 41 45h-82Z" opacity=".8" />
          <path d="M1234 577h11v45h-11z" opacity=".7" />
          <path d="M1270 609c0-18 14-33 31-33s31 15 31 33h-62Z" opacity=".7" />
          <path d="M1297 605h9v35h-9z" opacity=".65" />
          <path d="M276 686c0-14 11-26 25-26s25 12 25 26h-50Z" opacity=".35" />
        </g>
        <g className="inspiration-valley__grass" stroke="#66845c" strokeWidth="2" strokeLinecap="round" opacity=".56">
          <path d="M1120 718c0-18 3-31 9-40m0 40c5-13 12-23 21-29m-21 29c-8-10-15-17-24-21" />
          <path d="M340 745c0-15 2-27 7-35m0 35c4-12 10-20 18-25m-18 25c-7-8-13-14-20-17" />
          <path d="M1370 755c0-17 3-29 8-37m0 37c6-12 13-19 21-24" />
        </g>
        <g className="inspiration-valley__birds" stroke="#66845c" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".55">
          <path d="M1176 214c6-7 12-7 18 0 6-7 12-7 18 0" />
          <path d="M1222 235c5-6 10-6 15 0 5-6 10-6 15 0" />
        </g>
      </svg>

      <div className="inspiration-valley__wash absolute inset-y-0 left-0 w-full md:w-[76%]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(248,247,239,0.88))]" />
    </div>
  );
}
