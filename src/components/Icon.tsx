import React from "react";
import Svg, { Path, Circle, Rect } from "react-native-svg";
export type IconName =
  | "home"
  | "explore"
  | "review"
  | "profile"
  | "sparkle"
  | "arrow"
  | "sprout"
  | "chat"
  | "library"
  | "lock"
  | "check"
  | "close"
  | "bookmark"
  | "notes"
  | "search"
  | "chevron"
  | "flame"
  | "star"
  | "back"
  | "settings";
// Temporary vector icons: one place to replace them with the final Mầm icon set.
export function Icon({
  name,
  size = 24,
  color = "#2B1C18",
  filled = false,
}: {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
}) {
  const paths: Partial<Record<IconName, string>> = {
    home: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
    explore: "M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z",
    sparkle: "M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z",
    review:
      "M9 4C5 2 3 6 4 9c-3 3-2 7 1 8-1 4 5 6 7 2V5c0-3-4-3-4 0m7-1c4-2 6 2 5 5 3 3 2 7-1 8 1 4-5 6-7 2m-5-9 3 2m5 2 3-2",
    profile: "M5 21v-3a7 7 0 0 1 14 0v3M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    arrow: "M5 19 19 5M6 5h13v13",
    back: "M15 5 8 12l7 7",
    chevron: "m8 10 4 4 4-4",
    library: "M4 4v16m5-16v16m5-16v16m3-15 4 14",
    lock: "M6 10h12v11H6Zm3 0V6a3 3 0 0 1 6 0v4",
    check: "m5 12 4 4L19 6",
    close: "m5 5 14 14M19 5 5 19",
    bookmark: "M6 3h12v19l-6-4-6 4Z",
    notes: "M6 3h14v18H6ZM3 7h5M3 12h5M3 17h5M16 3v18",
    search: "M16 16 21 21M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    flame:
      "M13 2c0 6 6 6 6 12a7 7 0 1 1-14 0c0-3 2-5 3-7 0 4 2 5 3 5 2-2 2-6 2-10Z",
    star: "m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",
    chat: "M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z",
    sprout:
      "M12 22V11M12 14C4 15 2 9 3 5c6 0 10 2 9 9Zm0-5c0-6 5-8 9-7 1 5-3 9-9 9",
    settings: "M9 3h6l1 3 3 1 2 5-2 2v4l-5 3-2-2-3 1-5-3 1-3-2-3 3-4 3 1Z",
  };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessible={false}
    >
      <Path d={paths[name]} fill={filled ? color : "none"} />
      {name === "settings" && <Circle cx="12" cy="12" r="3" />}
    </Svg>
  );
}
