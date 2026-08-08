/* The glazedweb mark (v9): pink donut, green slime drip with rounded tips,
   thin glaze lip creeping over the donut's bottom edge. */

export function LogoDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <radialGradient id="pinkGrad" cx="40%" cy="34%" r="75%">
          <stop offset="0%" stopColor="#F887B2" />
          <stop offset="55%" stopColor="#E84D8A" />
          <stop offset="100%" stopColor="#CE3672" />
        </radialGradient>
        <linearGradient id="lgGrad" x1="0" y1="92" x2="0" y2="215" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D9EDA0" />
          <stop offset="55%" stopColor="#BFE07A" />
          <stop offset="100%" stopColor="#A3CE55" />
        </linearGradient>
        <linearGradient id="creepGrad" x1="0" y1="90" x2="0" y2="124" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E3F2B0" />
          <stop offset="100%" stopColor="#C3E181" />
        </linearGradient>
        <linearGradient id="dgGrad" x1="0" y1="92" x2="0" y2="165" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5FA850" />
          <stop offset="100%" stopColor="#43813A" />
        </linearGradient>
      </defs>
      <symbol id="mark" viewBox="0 0 200 250" overflow="visible">
        <g fill="url(#dgGrad)">
          <ellipse cx="100" cy="110" rx="38" ry="15" />
          <path d="M 86 100 C 86 116, 87 130, 88 142 C 88 148, 91 149, 92 142 C 93 130, 92 114, 92 100 Z" />
          <path d="M 114 100 C 114 112, 115 124, 116 134 C 116 140, 119 141, 120 134 C 121 124, 120 110, 120 100 Z" />
        </g>
        <g fill="url(#lgGrad)">
          <path d="M 64 100 C 63 120, 65 138, 66 152 C 66 164, 68 172, 74 173 C 80 172, 83 165, 82 154 C 84 136, 85 116, 86 100 Z" />
          <path d="M 92 100 C 91 128, 93 152, 94 172 C 94 188, 97 199, 104 200 C 111 199, 114 190, 112 174 C 113 150, 114 124, 114 100 Z" />
          <path d="M 120 100 C 119 116, 120 130, 121 142 C 121 152, 123 159, 129 160 C 134 159, 137 153, 135 144 C 136 130, 137 114, 137 100 Z" />
        </g>
        <circle cx="100" cy="70" r="52" fill="url(#pinkGrad)" />
        <path
          d="M 56 98 A 52 52 0 0 0 144 98 C 142 94, 138 92, 134 94 C 130 97, 129 102, 125 104 C 119 106, 116 98, 110 96 C 104 94, 103 102, 98 105 C 93 107, 90 100, 84 97 C 78 95, 76 100, 71 102 C 66 103, 62 100, 56 98 Z"
          fill="url(#creepGrad)"
        />
        <path d="M 68 106 A 42 42 0 0 0 84 116" fill="none" stroke="#F1F8DC" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
        <path d="M 97 144 Q 103 151 109 144" fill="none" stroke="#55974A" strokeWidth="4" strokeLinecap="round" />
        <g stroke="#F1F8DC" fill="none" strokeLinecap="round">
          <path d="M 97 128 C 96 148, 97 166, 100 182" strokeWidth="4.5" opacity="0.85" />
          <path d="M 69 118 C 68 132, 70 146, 71 156" strokeWidth="3.5" opacity="0.8" />
          <path d="M 124 114 C 123 124, 125 138, 126 148" strokeWidth="3.5" opacity="0.8" />
        </g>
        <circle cx="100" cy="192" r="2.5" fill="#F1F8DC" opacity="0.9" />
        <circle cx="100" cy="72" r="13" fill="var(--hole, #FDF6EC)" />
        <circle cx="100" cy="72" r="13" fill="none" stroke="#C22F6B" strokeWidth="3" opacity="0.3" />
        <path d="M 62 46 A 44 44 0 0 1 82 28" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" opacity="0.75" />
        <circle cx="92" cy="26" r="3.5" fill="#FFFFFF" opacity="0.75" />
      </symbol>
      <symbol id="dripEdge" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,0 H1440 V16 C1408 16 1400 44 1378 44 C1356 44 1362 16 1332 16 H1180 C1160 16 1156 52 1132 52 C1110 52 1116 16 1088 16 H880 C862 16 860 38 842 38 C824 38 828 16 802 16 H590 C574 16 572 48 550 48 C528 48 532 16 506 16 H300 C284 16 282 36 264 36 C246 36 250 16 224 16 H0 Z" />
      </symbol>
    </svg>
  );
}

export function Mark({ width = 24, height = 31, hole = "#FDF6EC" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 250" overflow="visible" style={{ "--hole": hole }}>
      <use href="#mark" />
    </svg>
  );
}

export function DripDivider({ fill, bg }) {
  return (
    <svg className="drip-divider" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ background: bg }} aria-hidden="true">
      <use href="#dripEdge" fill={fill} />
    </svg>
  );
}

export function AnimatedMark({ width = 230, height = 290 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 250" overflow="visible">
      <g className="goo">
        <g fill="url(#dgGrad)">
          <ellipse cx="100" cy="110" rx="38" ry="15" />
          <path
            className="wobB"
            d="M 86 100 C 86 116, 87 130, 88 142 C 88 148, 91 149, 92 142 C 93 130, 92 114, 92 100 Z"
          />
          <path d="M 114 100 C 114 112, 115 124, 116 134 C 116 140, 119 141, 120 134 C 121 124, 120 110, 120 100 Z" />
        </g>
        <g fill="url(#lgGrad)">
          <path
            className="wob1"
            d="M 64 100 C 63 120, 65 138, 66 152 C 66 164, 68 172, 74 173 C 80 172, 83 165, 82 154 C 84 136, 85 116, 86 100 Z"
          />
          <path
            className="wob2"
            d="M 92 100 C 91 128, 93 152, 94 172 C 94 188, 97 199, 104 200 C 111 199, 114 190, 112 174 C 113 150, 114 124, 114 100 Z"
          />
          <path
            className="wob3"
            d="M 120 100 C 119 116, 120 130, 121 142 C 121 152, 123 159, 129 160 C 134 159, 137 153, 135 144 C 136 130, 137 114, 137 100 Z"
          />
        </g>
      </g>
      <path className="string" d="M 104 199 L 104 209" stroke="#BFE07A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <g className="droplet">
        <circle cx="104" cy="213" r="7" fill="#BFE07A" />
        <circle cx="102" cy="211" r="2" fill="#F1F8DC" opacity="0.9" />
      </g>
      <circle className="droplet2" cx="74" cy="186" r="4.5" fill="#BFE07A" />
      <circle cx="100" cy="70" r="52" fill="url(#pinkGrad)" />
      <path
        d="M 56 98 A 52 52 0 0 0 144 98 C 142 94, 138 92, 134 94 C 130 97, 129 102, 125 104 C 119 106, 116 98, 110 96 C 104 94, 103 102, 98 105 C 93 107, 90 100, 84 97 C 78 95, 76 100, 71 102 C 66 103, 62 100, 56 98 Z"
        fill="url(#creepGrad)"
      />
      <path d="M 68 106 A 42 42 0 0 0 84 116" fill="none" stroke="#F1F8DC" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M 97 144 Q 103 151 109 144" fill="none" stroke="#55974A" strokeWidth="4" strokeLinecap="round" />
      <g stroke="#F1F8DC" fill="none" strokeLinecap="round">
        <path d="M 97 128 C 96 148, 97 166, 100 182" strokeWidth="4.5" opacity="0.85" />
        <path d="M 69 118 C 68 132, 70 146, 71 156" strokeWidth="3.5" opacity="0.8" />
        <path d="M 124 114 C 123 124, 125 138, 126 148" strokeWidth="3.5" opacity="0.8" />
      </g>
      <circle cx="100" cy="192" r="2.5" fill="#F1F8DC" opacity="0.9" />
      <circle cx="100" cy="72" r="13" fill="#FDF6EC" />
      <circle cx="100" cy="72" r="13" fill="none" stroke="#C22F6B" strokeWidth="3" opacity="0.3" />
      <path className="sheen" d="M 62 46 A 44 44 0 0 1 82 28" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
      <circle className="sheen" cx="92" cy="26" r="3.5" fill="#FFFFFF" />
    </svg>
  );
}

/* Be A Number International mark — © Be A Number, used with permission on the work card */
export function BeANumberMark({ size = 56, style, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 92 92"
      fill="none"
      width={size}
      height={size}
      style={style}
      className={className}
      aria-label="Be A Number logo"
    >
      <rect x="19" y="0" width="16" height="16" rx="1" fill="currentColor" />
      <rect x="57" y="0" width="16" height="16" rx="1" fill="currentColor" />
      <rect x="0" y="19" width="16" height="16" rx="1" fill="currentColor" />
      <rect x="76" y="19" width="16" height="16" rx="1" fill="currentColor" />
      <path
        d="M 19 38 L 35 38 L 35 57 L 57 57 L 57 38 L 73 38 L 73 57 L 92 57 L 92 73 L 73 73 L 73 92 L 57 92 L 57 73 L 35 73 L 35 92 L 19 92 L 19 73 L 0 73 L 0 57 L 19 57 Z"
        fill="currentColor"
      />
    </svg>
  );
}
