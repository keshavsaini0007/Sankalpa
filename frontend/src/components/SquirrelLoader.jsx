import React from "react";

const styles = `
  .squirrel-scene {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: transparent;
  }

  .squirrel-wrap {
    animation: walkBounce 0.45s ease-in-out infinite;
    transform-origin: bottom center;
  }

  @keyframes walkBounce {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-5px); }
  }

  .ground-track {
    width: 260px;
    height: 18px;
    position: relative;
    overflow: hidden;
    margin-top: -4px;
  }

  .ground-dashes {
    display: flex;
    gap: 14px;
    position: absolute;
    white-space: nowrap;
    animation: moveDashes 1.4s linear infinite;
  }

  .sq-dash {
    width: 28px;
    height: 3px;
    background: #C4874A;
    border-radius: 2px;
    opacity: 0.55;
    flex-shrink: 0;
  }

  @keyframes moveDashes {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-42px); }
  }

  #sq-fl1 { animation: frontLeg1 0.45s linear infinite; transform-origin: 158px 108px; }
  #sq-fl2 { animation: frontLeg2 0.45s linear infinite; transform-origin: 152px 112px; }
  #sq-bl1 { animation: backLeg1 0.45s linear infinite; transform-origin: 98px 116px; }
  #sq-bl2 { animation: backLeg2 0.45s linear infinite; transform-origin: 104px 112px; }
  #sq-tail { animation: tailWave 0.9s ease-in-out infinite; transform-origin: 90px 100px; }

  @keyframes frontLeg1 {
    0%,100% { transform: rotate(-22deg); }
    50%     { transform: rotate(22deg); }
  }
  @keyframes frontLeg2 {
    0%,100% { transform: rotate(22deg); }
    50%     { transform: rotate(-22deg); }
  }
  @keyframes backLeg1 {
    0%,100% { transform: rotate(18deg); }
    50%     { transform: rotate(-18deg); }
  }
  @keyframes backLeg2 {
    0%,100% { transform: rotate(-18deg); }
    50%     { transform: rotate(18deg); }
  }
  @keyframes tailWave {
    0%,100% { transform: rotate(-6deg) scaleY(1); }
    50%     { transform: rotate(6deg) scaleY(1.04); }
  }
`;

export default function SquirrelLoader() {
  return (
    <>
      <style>{styles}</style>
      <div className="squirrel-scene">
        <div className="squirrel-wrap">
          <svg width="220" height="160" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="sq-furGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FF8C42" />
                <stop offset="60%" stopColor="#E85D04" />
                <stop offset="100%" stopColor="#C04A00" />
              </radialGradient>
              <radialGradient id="sq-bellyGrad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#FFF0D0" />
                <stop offset="100%" stopColor="#F5D6A0" />
              </radialGradient>
              <linearGradient id="sq-tailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E85D04" />
                <stop offset="45%" stopColor="#FF8C42" />
                <stop offset="100%" stopColor="#FFF0D0" />
              </linearGradient>
              <linearGradient id="sq-tailInner" x1="0%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFF0D0" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FF8C42" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="sq-earInner" cx="50%" cy="70%" r="60%">
                <stop offset="0%" stopColor="#8B3A00" />
                <stop offset="100%" stopColor="#C04A00" />
              </radialGradient>
              <linearGradient id="sq-legGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E85D04" />
                <stop offset="100%" stopColor="#9A3B00" />
              </linearGradient>
              <filter id="sq-furTexture">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            {/* Tail */}
            <g id="sq-tail">
              <path
                d="M 90 105 C 55 95, 20 75, 15 45 C 10 20, 30 8, 50 12 C 70 16, 80 35, 75 55 C 70 72, 60 80, 70 90 C 78 98, 88 102, 90 105 Z"
                fill="url(#sq-tailGrad)"
                filter="url(#sq-furTexture)"
              />
              <path
                d="M 85 102 C 65 90, 38 72, 35 50 C 32 30, 45 18, 55 20 C 65 22, 70 38, 67 55 C 64 70, 60 80, 68 90 C 74 97, 83 100, 85 102 Z"
                fill="url(#sq-tailInner)"
                opacity="0.9"
              />
              <ellipse cx="33" cy="28" rx="14" ry="10" fill="#FFF0D0" opacity="0.8" transform="rotate(-20, 33, 28)" />
              <ellipse cx="30" cy="30" rx="10" ry="7" fill="white" opacity="0.5" transform="rotate(-25, 30, 30)" />
            </g>

            {/* Back legs */}
            <g id="sq-bl2">
              <ellipse cx="104" cy="130" rx="8" ry="18" fill="#C04A00" opacity="0.6" />
              <ellipse cx="108" cy="146" rx="12" ry="5" fill="#9A3B00" />
            </g>
            <g id="sq-bl1">
              <ellipse cx="98" cy="128" rx="9" ry="18" fill="url(#sq-legGrad)" />
              <ellipse cx="95" cy="143" rx="13" ry="5.5" fill="#C04A00" />
              <ellipse cx="88" cy="143" rx="3" ry="2.5" fill="#8B3A00" />
              <ellipse cx="94" cy="145" rx="3" ry="2.5" fill="#8B3A00" />
              <ellipse cx="100" cy="145" rx="3" ry="2.5" fill="#8B3A00" />
            </g>

            {/* Body */}
            <ellipse cx="128" cy="108" rx="34" ry="30" fill="url(#sq-furGrad)" filter="url(#sq-furTexture)" />
            <ellipse cx="136" cy="112" rx="16" ry="22" fill="url(#sq-bellyGrad)" />
            <ellipse cx="145" cy="108" rx="18" ry="24" fill="#C04A00" opacity="0.25" />

            {/* Front legs */}
            <g id="sq-fl2">
              <rect x="146" y="116" width="12" height="22" rx="6" fill="#C04A00" opacity="0.7" />
              <ellipse cx="152" cy="140" rx="9" ry="4" fill="#9A3B00" opacity="0.8" />
            </g>
            <g id="sq-fl1">
              <rect x="152" y="114" width="13" height="24" rx="6" fill="url(#sq-legGrad)" />
              <ellipse cx="158" cy="139" rx="10" ry="5" fill="#C04A00" />
              <ellipse cx="152" cy="140" rx="2.5" ry="2" fill="#8B3A00" />
              <ellipse cx="158" cy="142" rx="2.5" ry="2" fill="#8B3A00" />
              <ellipse cx="164" cy="141" rx="2.5" ry="2" fill="#8B3A00" />
            </g>

            {/* Neck */}
            <ellipse cx="148" cy="88" rx="16" ry="12" fill="url(#sq-furGrad)" />

            {/* Head */}
            <ellipse cx="158" cy="72" rx="26" ry="24" fill="url(#sq-furGrad)" filter="url(#sq-furTexture)" />
            <ellipse cx="168" cy="75" rx="14" ry="16" fill="#C04A00" opacity="0.2" />

            {/* Ears */}
            <ellipse cx="142" cy="50" rx="9" ry="13" fill="#C04A00" transform="rotate(-15, 142, 50)" />
            <ellipse cx="152" cy="48" rx="10" ry="14" fill="url(#sq-furGrad)" transform="rotate(-10, 152, 48)" />
            <ellipse cx="152" cy="52" rx="6" ry="8" fill="url(#sq-earInner)" opacity="0.7" transform="rotate(-10, 152, 52)" />
            <ellipse cx="152" cy="44" rx="5" ry="4" fill="#FF8C42" transform="rotate(-10, 152, 44)" />

            {/* Face */}
            <ellipse cx="174" cy="76" rx="12" ry="10" fill="url(#sq-bellyGrad)" opacity="0.85" />
            <circle cx="164" cy="66" r="5.5" fill="white" />
            <circle cx="165" cy="66" r="4" fill="#1a0a00" />
            <circle cx="163" cy="64" r="1.8" fill="white" />
            <circle cx="166" cy="68" r="0.8" fill="white" opacity="0.6" />
            <path d="M 159 63 Q 165 59 170 62" stroke="#8B3A00" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 174 74 Q 180 78 176 83" stroke="#C04A00" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />

            {/* Snout */}
            <ellipse cx="181" cy="77" rx="11" ry="8" fill="url(#sq-bellyGrad)" />
            <ellipse cx="189" cy="77" rx="5" ry="5" fill="#F5D6A0" />
            <ellipse cx="190" cy="74" rx="4" ry="3.5" fill="#3D1A00" />
            <ellipse cx="189" cy="73" rx="1.5" ry="1" fill="white" opacity="0.5" />
            <path d="M 188 77 Q 191 80 186 82" stroke="#6B2D00" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Whiskers */}
            <line x1="191" y1="75" x2="210" y2="70" stroke="#5a3a1a" strokeWidth="0.8" opacity="0.6" />
            <line x1="191" y1="77" x2="212" y2="76" stroke="#5a3a1a" strokeWidth="0.8" opacity="0.6" />
            <line x1="191" y1="79" x2="210" y2="82" stroke="#5a3a1a" strokeWidth="0.8" opacity="0.6" />

            {/* Head hair tufts */}
            <path d="M 148 48 Q 150 40 154 46" stroke="#C04A00" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 153 46 Q 156 37 159 45" stroke="#E85D04" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 158 45 Q 161 38 163 46" stroke="#C04A00" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Ground dashes */}
        <div className="ground-track">
          <div className="ground-dashes">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="sq-dash" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
