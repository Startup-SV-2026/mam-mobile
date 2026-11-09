import React from "react";
import Svg, { Circle, Ellipse, Path, Rect, G, Line } from "react-native-svg";
// Code-native placeholder covers; no downloaded Wondering artwork.
export function CourseArt({ id, size = 150 }: { id: string; size?: number }) {
  const kind =
    id === "space"
      ? "space"
      : id === "mind"
        ? "mind"
        : id === "money"
          ? "money"
          : id === "ai"
            ? "ai"
            : "book";
  return (
    <Svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 200 144"
      accessible={false}
    >
      <Ellipse cx="105" cy="126" rx="63" ry="9" fill="#30251D" opacity={0.1} />
      <G stroke="#51483C" strokeWidth="1.5" strokeLinejoin="round">
        {kind === "space" ? (
          <>
            <Circle cx="102" cy="68" r="40" fill="#B1B8DD" />
            <Path
              d="M76 38c28 4 45 22 53 52M65 65c24-9 55 1 74 14"
              fill="none"
            />
            <Ellipse
              cx="102"
              cy="73"
              rx="75"
              ry="19"
              rotation="-23"
              origin="102,73"
              fill="none"
              stroke="#648FA1"
              strokeWidth="12"
            />
            <Circle cx="158" cy="27" r="7" fill="#E1B56C" />
            <Path d="m36 24 3 7 7 2-7 3-3 7-2-7-7-3 7-2Z" fill="#E7C68D" />
          </>
        ) : kind === "mind" ? (
          <>
            <Path
              d="M104 29c-30-21-66 15-50 37-26 21-5 50 20 48 13 27 41 9 36-8V39c0-10-4-13-6-10Z"
              fill="#A6CACA"
            />
            <Path
              d="M112 33c26-15 53 15 40 34 22 22 0 49-19 45-9 19-21 11-21-6Z"
              fill="#E6B5A2"
            />
            <Path
              d="M74 47c-12 13 0 22 12 21m-17 9c-10 21 7 25 16 18m47-45c14 14 2 20-4 21m7 9c13 12 2 21-7 19"
              fill="none"
            />
            <Circle cx="48" cy="34" r="9" fill="#D3D9A6" />
          </>
        ) : kind === "money" ? (
          <>
            <Path d="M40 114V78l28-15 28 15v36Z" fill="#A3CAC9" />
            <Path d="m46 91 16-15 13 7 13-21" fill="none" strokeWidth="4" />
            <Rect x="111" y="54" width="39" height="66" rx="5" fill="#E6B2A1" />
            <Ellipse cx="130" cy="53" rx="20" ry="7" fill="#F3C9B6" />
            <Circle cx="115" cy="97" r="22" fill="#E3C273" />
            <Path
              d="M115 83v28m7-22c-13-10-20 4-8 8 15 4 5 17-6 8"
              fill="none"
            />
          </>
        ) : kind === "ai" ? (
          <>
            <Rect x="56" y="34" width="91" height="78" rx="18" fill="#AEBBDA" />
            <Rect x="70" y="49" width="63" height="42" rx="12" fill="#F3EFE1" />
            <Circle cx="87" cy="69" r="5" fill="#51483C" />
            <Circle cx="117" cy="69" r="5" fill="#51483C" />
            <Path
              d="M91 83h22M101 34V19m-45 41H43v29h13m91-29h14v29h-14"
              fill="none"
            />
            <Circle cx="101" cy="16" r="6" fill="#D8B473" />
          </>
        ) : (
          <>
            <Path
              d="m43 53 60 13v59l-60-13Zm60 13 57-17v61l-57 15Z"
              fill="#ACC8B6"
            />
            <Path d="m48 47 55 13 51-16v58l-51 17-55-13Z" fill="#F2E9D1" />
            <Path
              d="M103 60v59M57 62l35 8m-35 5 35 8m-35 5 35 8m20-25 32-10m-32 23 32-10m-32 23 32-10"
              fill="none"
            />
          </>
        )}
      </G>
    </Svg>
  );
}
