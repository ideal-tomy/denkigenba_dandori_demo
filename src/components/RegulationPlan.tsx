type Props = {
  locname: string;
  isNight: boolean;
  mainStreet: string;
  crossStreet: string;
};

/** 提出用の交通規制図。交差点の作業範囲と誘導位置を示すサンプル。 */
export function RegulationPlan({ locname, isNight, mainStreet, crossStreet }: Props) {
  return (
    <div className="reg-plan">
      <div className="reg-plan-hd">
        <div>
          <div className="reg-plan-kicker">添付図面 1／1</div>
          <h4>{locname} 交通規制図</h4>
        </div>
        <div className={`reg-plan-badge${isNight ? " is-night" : ""}`}>
          {isNight ? "夜間規制 22:00〜翌5:00" : "日中規制 9:00〜17:00"}
        </div>
      </div>
      <svg viewBox="0 0 920 620" className="reg-svg" role="img" aria-label={`${locname}の交通規制図`}>
        <rect width="920" height="620" fill="#e7efd8" />
        <rect x="0" y="0" width="920" height="46" fill="#16243f" />
        <text x="20" y="30" fill="#f5a300" fontSize="13" fontFamily="Noto Sans JP, sans-serif" fontWeight="700">
          電気工事 交通規制図（提出用サンプル）
        </text>
        <text x="900" y="30" fill="#c7d0e0" fontSize="12" fontFamily="Noto Sans JP, sans-serif" textAnchor="end">
          縮尺 1:500　{isNight ? "夜間" : "日中"}
        </text>

        {/* parks */}
        <rect x="20" y="70" width="250" height="170" fill="#9ec27a" />
        <rect x="650" y="70" width="250" height="170" fill="#9ec27a" />
        <rect x="20" y="390" width="250" height="190" fill="#9ec27a" />
        <rect x="650" y="390" width="250" height="190" fill="#8fb56c" />

        {/* roads */}
        <rect x="270" y="70" width="380" height="510" fill="#cfcfc8" />
        <rect x="20" y="240" width="880" height="150" fill="#cfcfc8" />
        <line x1="460" y1="70" x2="460" y2="240" stroke="#fff" strokeWidth="3" strokeDasharray="14 12" />
        <line x1="460" y1="390" x2="460" y2="580" stroke="#fff" strokeWidth="3" strokeDasharray="14 12" />
        <line x1="20" y1="315" x2="270" y2="315" stroke="#fff" strokeWidth="3" strokeDasharray="14 12" />
        <line x1="650" y1="315" x2="900" y2="315" stroke="#fff" strokeWidth="3" strokeDasharray="14 12" />

        {/* crosswalks */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={`cw-n-${i}`} x={290 + i * 22} y="228" width="12" height="18" fill="#fff" />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={`cw-s-${i}`} x={500 + i * 22} y="384" width="12" height="18" fill="#fff" />
        ))}

        {/* work zone */}
        <rect x="500" y="255" width="140" height="125" fill="#f5d76e" stroke="#c0392b" strokeWidth="2" />
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#c0392b" strokeWidth="2" />
        </pattern>
        <rect x="508" y="263" width="124" height="109" fill="url(#hatch)" opacity="0.35" />
        <text x="570" y="325" textAnchor="middle" fill="#7a1f16" fontSize="13" fontWeight="700" fontFamily="Noto Sans JP, sans-serif">
          作業範囲
        </text>
        <text x="570" y="344" textAnchor="middle" fill="#7a1f16" fontSize="11" fontFamily="Noto Sans JP, sans-serif">
          18.0m × 4.5m
        </text>

        {/* cones */}
        {[
          [490, 250],
          [490, 290],
          [490, 330],
          [490, 370],
          [640, 250],
          [640, 370],
          [530, 248],
          [580, 248],
        ].map(([x, y], i) => (
          <polygon key={`cone-${i}`} points={`${x},${y} ${x + 8},${y + 16} ${x - 8},${y + 16}`} fill="#e67e22" stroke="#9a4b00" />
        ))}

        {/* vehicles */}
        <rect x="545" y="275" width="54" height="22" rx="3" fill="#c0392b" />
        <rect x="552" y="272" width="18" height="8" fill="#7a1f16" />
        <rect x="545" y="335" width="40" height="18" rx="3" fill="#1f4e79" />
        <rect x="400" y="268" width="36" height="16" rx="2" fill="#5d6d7e" />
        <rect x="360" y="348" width="36" height="16" rx="2" fill="#5d6d7e" />
        <rect x="700" y="278" width="36" height="16" rx="2" fill="#5d6d7e" />

        {/* guards */}
        <circle cx="478" cy="300" r="7" fill="#f5a300" stroke="#16243f" strokeWidth="1.5" />
        <circle cx="478" cy="350" r="7" fill="#f5a300" stroke="#16243f" strokeWidth="1.5" />
        <circle cx="655" cy="315" r="7" fill="#f5a300" stroke="#16243f" strokeWidth="1.5" />
        <text x="478" y="304" textAnchor="middle" fontSize="8" fontWeight="700" fill="#16243f">
          G
        </text>
        <text x="478" y="354" textAnchor="middle" fontSize="8" fontWeight="700" fill="#16243f">
          G
        </text>
        <text x="655" y="319" textAnchor="middle" fontSize="8" fontWeight="700" fill="#16243f">
          G
        </text>

        {/* dimension */}
        <line x1="500" y1="232" x2="640" y2="232" stroke="#16243f" strokeWidth="1.2" />
        <line x1="500" y1="226" x2="500" y2="238" stroke="#16243f" />
        <line x1="640" y1="226" x2="640" y2="238" stroke="#16243f" />
        <text x="570" y="226" textAnchor="middle" fontSize="11" fill="#16243f" fontFamily="Roboto Mono, monospace">
          15.0m
        </text>
        <line x1="668" y1="255" x2="668" y2="380" stroke="#16243f" strokeWidth="1.2" />
        <text x="686" y="320" fontSize="11" fill="#16243f" fontFamily="Roboto Mono, monospace">
          11.5m
        </text>

        {/* street labels */}
        <text x="460" y="100" textAnchor="middle" fontSize="13" fill="#16243f" fontWeight="700" fontFamily="Noto Sans JP, sans-serif">
          {mainStreet}
        </text>
        <text x="80" y="308" fontSize="13" fill="#16243f" fontWeight="700" fontFamily="Noto Sans JP, sans-serif">
          {crossStreet}
        </text>
        <text x="840" y="308" textAnchor="end" fontSize="13" fill="#16243f" fontWeight="700" fontFamily="Noto Sans JP, sans-serif">
          {crossStreet}
        </text>

        {/* compass */}
        <g transform="translate(70 120)">
          <circle r="28" fill="#fff" stroke="#16243f" strokeWidth="1.5" />
          <polygon points="0,-20 6,4 0,0 -6,4" fill="#c0392b" />
          <text y="-24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#16243f">
            N
          </text>
        </g>

        {/* legend */}
        <g transform="translate(40 430)">
          <rect width="210" height="130" fill="#fff" stroke="#16243f" strokeWidth="1.2" />
          <text x="12" y="22" fontSize="12" fontWeight="700" fill="#16243f" fontFamily="Noto Sans JP, sans-serif">
            凡例
          </text>
          <rect x="12" y="36" width="22" height="12" fill="#f5d76e" stroke="#c0392b" />
          <text x="42" y="46" fontSize="11" fill="#16243f" fontFamily="Noto Sans JP, sans-serif">
            作業範囲
          </text>
          <rect x="12" y="56" width="22" height="10" fill="#c0392b" />
          <text x="42" y="65" fontSize="11" fill="#16243f" fontFamily="Noto Sans JP, sans-serif">
            作業車両
          </text>
          <polygon points="23,80 27,92 19,92" fill="#e67e22" />
          <text x="42" y="90" fontSize="11" fill="#16243f" fontFamily="Noto Sans JP, sans-serif">
            カラーコーン
          </text>
          <circle cx="23" cy="108" r="6" fill="#f5a300" stroke="#16243f" />
          <text x="42" y="112" fontSize="11" fill="#16243f" fontFamily="Noto Sans JP, sans-serif">
            交通誘導員
          </text>
        </g>
      </svg>
    </div>
  );
}
