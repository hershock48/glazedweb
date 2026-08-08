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

/* Chism Chicken Ranch — hand-drawn hen for the work card */
export function ChismChicken({ size = 96, className, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 110"
      width={size}
      height={(size * 110) / 120}
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* ground shadow (fades when she takes off) */}
      <g className="hen-shadow">
        <ellipse cx="58" cy="101" rx="32" ry="5" fill="#5E2812" opacity="0.45" />
      </g>
      {/* the egg — laid on scroll (.boking); drawn behind her body so it pops out of her rear.
          Lives OUTSIDE .hen-body so it stays behind when she flies away. */}
      <g className="chism-egg-shadow">
        <ellipse cx="18" cy="103.5" rx="6.4" ry="1.9" fill="#5E2812" opacity="0.4" />
      </g>
      <g className="chism-egg">
        <ellipse cx="18" cy="96" rx="7.2" ry="9.2" fill="#FFFDF8" />
        <ellipse cx="15.5" cy="92.5" rx="2.3" ry="3.1" fill="#FFFFFF" opacity="0.85" />
      </g>
      {/* the hen herself — this whole group waddles, lays, and flies away */}
      <g className="hen-body">
      {/* legs */}
      <g stroke="#E8A33D" strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M 48 84 L 48 97 M 48 97 L 42 101 M 48 97 L 53 101" />
        <path d="M 66 84 L 66 97 M 66 97 L 60 101 M 66 97 L 71 101" />
      </g>
      {/* tail feathers */}
      <path d="M 30 52 C 16 44, 10 32, 18 20 C 22 30, 28 38, 36 44 Z" fill="#3B4A3A" />
      <path d="M 34 56 C 22 52, 14 44, 16 34 C 22 42, 30 48, 40 51 Z" fill="#55694F" />
      {/* body + head */}
      <path
        d="M 27 52 C 14 58, 12 75, 25 84 C 36 91, 58 93, 71 87 C 84 81, 88 70, 87 59 L 87 40 C 87 28, 74 23, 67 31 L 62 38 C 50 34, 37 42, 27 52 Z"
        fill="#FFF7EA"
      />
      {/* wing */}
      <path d="M 40 60 C 51 53, 64 56, 65 64 C 62 74, 47 77, 39 70 C 37 66, 37 62, 40 60 Z" fill="#F0DFC8" />
      {/* comb */}
      <path
        d="M 68 27 C 68 21, 74 19, 76 24 C 78 18, 85 19, 85 25 C 89 22, 93 26, 90 31 L 71 32 Z"
        fill="#D64541"
      />
      {/* beak */}
      <path d="M 87 43 L 100 47 L 87 52 Z" fill="#E8A33D" />
      {/* wattle */}
      <path d="M 82 52 C 84 60, 76 62, 75 55 C 75 51, 80 49, 82 52 Z" fill="#D64541" />
      {/* eye */}
      <circle cx="79" cy="41" r="2.6" fill="#2B1E16" />
      <circle cx="80" cy="40.2" r="0.9" fill="#FFF7EA" />
      </g>
      {/* hatch stage — plays after she flies off and you keep scrolling */}
      <g className="chism-baby">
        <circle cx="18" cy="93" r="6" fill="#FFD75E" />
        <ellipse cx="14" cy="94.6" rx="2" ry="2.6" fill="#F5C93F" />
        <circle cx="20.2" cy="91.2" r="1.1" fill="#2B1E16" />
        <path d="M 23.6 92.6 L 26.6 93.6 L 23.6 94.8 Z" fill="#E8A33D" />
        <path d="M 17 87.4 C 17.4 86 18.6 86 19 87.3" stroke="#E8A33D" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
      <g className="chism-shell-bottom">
        <path
          d="M 10.8 96 C 10.8 101.2, 14 105.2, 18 105.2 C 22 105.2, 25.2 101.2, 25.2 96 L 23 93.5 L 21.4 96.5 L 19.2 92.9 L 17 96.3 L 14.8 93.3 L 12.8 96.6 Z"
          fill="#FFFDF8"
        />
      </g>
      <g className="chism-shell-top">
        <path
          d="M 11.9 94 C 12.3 88, 14.6 86.9, 18 86.9 C 21.4 86.9, 23.7 88, 24.1 94 L 22 91.5 L 20 94.5 L 18 91 L 16 94.4 L 13.9 91.6 Z"
          fill="#FFFDF8"
        />
      </g>
    </svg>
  );
}

/* Chism Chicken Ranch v2 — one big sleek glazed egg. Scroll steps (data-egg on
   the card, 0-5) crack it open frame by frame until a chick pops out. */
export function ChismEgg({ size = 116, className, style }) {
  const h = (size * 150) / 140;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 140 150"
      width={size}
      height={h}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="chismEggGrad" cx="38%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#FFF8EC" />
          <stop offset="100%" stopColor="#EFDCC2" />
        </radialGradient>
        <linearGradient id="chismGlazeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9EDA0" />
          <stop offset="100%" stopColor="#A9D65C" />
        </linearGradient>
      </defs>
      {/* ground shadow */}
      <ellipse cx="70" cy="140" rx="42" ry="6" fill="#5E2812" opacity="0.45" />
      {/* chick peeking (step 4) — drawn under the open shell */}
      <g className="chick-peek">
        <circle cx="70" cy="88" r="15" fill="#FFD75E" />
        <circle cx="64.5" cy="85" r="2.2" fill="#2B1E16" />
        <circle cx="75.5" cy="85" r="2.2" fill="#2B1E16" />
        <path d="M 66.5 90 L 70 94.5 L 73.5 90 Z" fill="#E8A33D" />
        <path d="M 66 74.5 C 67 72 69 72 69.5 74 M 70.5 74 C 71.5 71.5 73.5 71.8 74 74" stroke="#E8A33D" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
      {/* chick fully out (step 5) */}
      <g className="chick-up">
        <ellipse cx="49" cy="84" rx="7" ry="12" fill="#F5C93F" transform="rotate(24 49 84)" />
        <ellipse cx="91" cy="84" rx="7" ry="12" fill="#F5C93F" transform="rotate(-24 91 84)" />
        <circle cx="70" cy="72" r="21" fill="#FFD75E" />
        <circle cx="62.5" cy="68" r="2.6" fill="#2B1E16" />
        <circle cx="77.5" cy="68" r="2.6" fill="#2B1E16" />
        <circle cx="63.3" cy="67.2" r="0.9" fill="#FFF7EA" />
        <circle cx="78.3" cy="67.2" r="0.9" fill="#FFF7EA" />
        <path d="M 65.5 74 L 70 79.5 L 74.5 74 Z" fill="#E8A33D" />
        {/* shell-piece hat */}
        <g transform="rotate(-14 70 50)">
          <path d="M 58 52 C 59 44 64 40 70 40 C 76 40 81 44 82 52 L 77 48 L 73 53 L 69 47 L 64 52 L 60 48 Z" fill="url(#chismEggGrad)" />
          <path d="M 61 43 C 64 39.5 76 39.5 79 43 C 80 46 77 47 75 45 C 73 43 74 47 70 47 C 66 47 68 43 65 45 C 63 47 60 46 61 43 Z" fill="url(#chismGlazeGrad)" />
        </g>
      </g>
      {/* open bottom shell (steps 4-5) — jagged rim, covers the chick's lower body */}
      <g className="egg-open">
        <path
          d="M 30 92 C 30 122 47 140 70 140 C 93 140 110 122 110 92 L 104 86 L 98 95 L 90 84 L 82 95 L 72 83 L 62 94 L 54 85 L 46 95 L 38 86 L 32 93 Z"
          fill="url(#chismEggGrad)"
        />
        <path d="M 36 95 C 46 102 94 102 105 94 C 100 108 88 118 70 118 C 52 118 41 108 36 95 Z" fill="#D9C0A0" opacity="0.5" />
      </g>
      {/* the whole egg (steps 0-3) */}
      <g className="egg-whole">
        <path
          d="M 70 20 C 95 20 112 52 112 90 C 112 120 93 140 70 140 C 47 140 28 120 28 90 C 28 52 45 20 70 20 Z"
          fill="url(#chismEggGrad)"
        />
        {/* slime glaze cap, dripping — it ships glazed */}
        <path
          d="M 46 42 C 50 27 59 19 70 19 C 82 19 91 27 95 42 C 97 50 92 53 89 48 C 86 43 88 56 82 57 C 77 57 79 46 74 47 C 70 48 72 60 66 60 C 61 60 63 47 58 46 C 54 45 55 52 51 51 C 46 50 44 47 46 42 Z"
          fill="url(#chismGlazeGrad)"
        />
        <circle cx="66" cy="60" r="2.4" fill="#A9D65C" className="egg-drip" />
        {/* sheen */}
        <path d="M 45 52 A 34 40 0 0 1 58 33" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.75" className="sheen" />
        <circle cx="64" cy="29" r="2.6" fill="#FFFFFF" opacity="0.75" className="sheen" />
      </g>
      {/* cracks — cumulative, steps 1-3 */}
      <g stroke="#B99F82" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path className="crack-1" d="M 88 62 L 81 69 L 86 76" />
        <path className="crack-2" d="M 81 69 L 72 72 L 74 81 M 86 76 L 92 84" />
        <path className="crack-3" d="M 72 72 L 62 69 L 58 76 M 52 60 L 59 65 M 96 68 L 90 60 M 74 81 L 66 88" />
      </g>
      {/* frozen shell fragments — step 4 burst */}
      <g className="frags-4">
        <path d="M 46 60 L 56 52 L 58 64 Z" fill="url(#chismEggGrad)" transform="rotate(-18 51 58)" />
        <path d="M 78 48 L 90 44 L 86 58 Z" fill="url(#chismEggGrad)" transform="rotate(14 84 51)" />
        <path d="M 60 40 C 63 34 71 33 75 38 L 72 44 L 66 41 Z" fill="url(#chismGlazeGrad)" transform="rotate(-8 67 39)" />
        <path d="M 96 60 L 104 56 L 102 66 Z" fill="url(#chismEggGrad)" transform="rotate(22 100 61)" />
      </g>
      {/* fragments flung further — step 5 */}
      <g className="frags-5">
        <path d="M 36 46 L 46 38 L 48 50 Z" fill="url(#chismEggGrad)" transform="rotate(-40 41 44)" />
        <path d="M 88 34 L 100 30 L 96 44 Z" fill="url(#chismEggGrad)" transform="rotate(30 94 37)" />
        <path d="M 52 26 C 55 20 63 19 67 24 L 64 30 L 58 27 Z" fill="url(#chismGlazeGrad)" transform="rotate(-22 59 25)" />
        <path d="M 106 48 L 114 44 L 112 54 Z" fill="url(#chismEggGrad)" transform="rotate(45 110 49)" />
        <circle cx="44" cy="30" r="2" fill="#EFDCC2" />
        <circle cx="99" cy="22" r="2.4" fill="#EFDCC2" />
      </g>
    </svg>
  );
}

/* Chism Chicken Ranch v3 — fresh eggs, delivered by scroll. Three eggs (one
   big glazed, two smaller) drop from the top of the card as you scroll; JS
   drives per-egg transforms, so the fall scrubs forward and backward. */
export function ChismEggs({ className }) {
  return (
    <svg className={className} viewBox="0 0 300 190" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <radialGradient id="ceGrad" cx="38%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#FFF8EC" />
          <stop offset="100%" stopColor="#EFDCC2" />
        </radialGradient>
        <linearGradient id="ceGlaze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9EDA0" />
          <stop offset="100%" stopColor="#A9D65C" />
        </linearGradient>
      </defs>
      {/* landing shadows — deepen as each egg approaches */}
      <ellipse className="shadow sh-a" cx="150" cy="176" rx="34" ry="5" fill="#5E2812" />
      <ellipse className="shadow sh-b" cx="84" cy="177" rx="22" ry="4" fill="#5E2812" />
      <ellipse className="shadow sh-c" cx="222" cy="177" rx="16" ry="3.2" fill="#5E2812" />
      {/* the big glazed one */}
      <g className="egg egg-a">
        <path
          d="M 150 76 C 168 76 182 100 182 127 C 182 149 168 172 150 172 C 132 172 118 149 118 127 C 118 100 132 76 150 76 Z"
          fill="url(#ceGrad)"
        />
        <path
          d="M 133 103 C 135 87 141 76 150 76 C 159 76 165 87 167 103 C 168 109 164 111 162 107 C 160 103 161 113 157 113 C 153 113 155 105 151 106 C 148 107 149 116 145 116 C 141 116 143 106 139 106 C 136 106 137 111 134 110 C 131 109 132 106 133 103 Z"
          fill="url(#ceGlaze)"
        />
        <path d="M 132 110 A 26 34 0 0 1 141 90" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.75" className="sheen" />
        <circle cx="146" cy="85" r="2" fill="#FFFFFF" opacity="0.75" className="sheen" />
      </g>
      {/* medium */}
      <g className="egg egg-b">
        <path
          d="M 84 114 C 96 114 105 130 105 148 C 105 163 96 174 84 174 C 72 174 63 163 63 148 C 63 130 72 114 84 114 Z"
          fill="url(#ceGrad)"
        />
        <path d="M 71 146 A 17 22 0 0 1 77 132" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" opacity="0.7" className="sheen" />
      </g>
      {/* small */}
      <g className="egg egg-c">
        <path
          d="M 222 131 C 231 131 238 143 238 156 C 238 167 231 175 222 175 C 213 175 206 167 206 156 C 206 143 213 131 222 131 Z"
          fill="url(#ceGrad)"
        />
        <path d="M 212 155 A 12 16 0 0 1 216 145" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" opacity="0.7" className="sheen" />
      </g>
    </svg>
  );
}
