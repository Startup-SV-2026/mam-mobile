import React from "react";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
import { theme } from "../theme";

export type IconName =
  | "headphones"
  | "play"
  | "pause"
  | "previous"
  | "next"
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
  | "sidebar"
  | "brain"
  | "settings"
  | "trend"
  | "download"
  | "more";

// Bộ Icon độc bản của Mầm: Phong cách Botanical Minimalist hiện đại, thanh thoát
export function Icon({
  name,
  size = 24,
  color = theme.ink,
  filled = false,
}: {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
}) {
  const strokeW = 1.5;

  switch (name) {
    case "headphones":
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
        >
          <Path d="M4 14v-3a8 8 0 0 1 16 0v3" />
          <Rect x="3" y="12" width="4" height="9" rx="2" />
          <Rect x="17" y="12" width="4" height="9" rx="2" />
        </Svg>
      );
    case "play":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M7 4 21 12 7 20Z" fill={color} />
        </Svg>
      );
    case "pause":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="5" y="4" width="5" height="16" rx="1" fill={color} />
          <Rect x="14" y="4" width="5" height="16" rx="1" fill={color} />
        </Svg>
      );
    case "previous":
    case "next":
      return (
        <Svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={1.7}
        >
          <Path
            d={
              name === "previous"
                ? "M6 5v14M20 5 8 12l12 7Z"
                : "M18 5v14M4 5l12 7-12 7Z"
            }
          />
        </Svg>
      );
    case "home":
      // Ngôi nhà mầm tri thức thanh thoát, mái vòm hữu cơ
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 10.5L12 3.5L21 10.5V19.5C21 20.3284 20.3284 21 19.5 21H15V15C15 14.4477 14.5523 14 14 14H10C9.44772 14 9 14.4477 9 15V21H4.5C3.67157 21 3 20.3284 3 19.5V10.5Z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? color : "none"}
          />
        </Svg>
      );

    case "library":
      // Cuốn sách tri thức mở với đường cong mềm mại (thay thế 4 vạch Wondering)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20V4H6.5C5.11929 4 4 5.11929 4 6.5V19.5Z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? color : "none"}
          />
          <Path
            d="M4 17C4 18.3807 5.11929 19.5 6.5 19.5H20"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          <Path
            d="M9 8H15M9 11H13"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        </Svg>
      );

    case "review":
      // Chiếc lá tư duy & Vườn trí tuệ (thay thế hình não nhăn nheo)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? color : "none"}
          />
          <Path
            d="M12 7V12L15 15"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M9 3.5C7 5 5 8 5 12"
            stroke={color}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        </Svg>
      );

    case "sparkle":
    case "explore":
      // Chồi sáng tạo / Hạt mầm tinh vân (thay thế sao 4 cánh nhọn)
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 3C12 7.5 15.5 11 20 11C15.5 11 12 14.5 12 19C12 14.5 8.5 11 4 11C8.5 11 12 7.5 12 3Z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? color : "none"}
          />
          <Circle cx="18.5" cy="5.5" r="1.5" fill={color} />
        </Svg>
      );

    case "profile":
      // Người học Mầm tinh giản, hiện đại
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle
            cx="12"
            cy="8"
            r="4.5"
            stroke={color}
            strokeWidth={strokeW}
            fill={filled ? color : "none"}
          />
          <Path
            d="M4 20C4 16.5 7.5 14.5 12 14.5C16.5 14.5 20 16.5 20 20"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        </Svg>
      );

    case "sprout":
      // Biểu tượng mầm sống đặc trưng
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 21V11"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          <Path
            d="M12 13C12 8 8 5 4 6C4 11 7 14 12 13Z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? color : "none"}
          />
          <Path
            d="M12 11C12 6.5 15.5 4 19.5 5C19.5 9.5 16.5 12 12 11Z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? color : "none"}
          />
        </Svg>
      );

    case "flame":
      // Giọt năng lượng / Ngọn lửa tri thức
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 3C12 7 16 9 16 13.5C16 16.5376 13.5376 19 10.5 19C7.46243 19 5 16.5376 5 13.5C5 9.5 8 7 9 4.5C9.5 7.5 11.5 8.5 12 3Z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? color : "none"}
          />
        </Svg>
      );

    case "star":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 3.5L14.4 8.7L20 9.4L15.8 13.2L17 18.7L12 15.8L7 18.7L8.2 13.2L4 9.4L9.6 8.7L12 3.5Z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? color : "none"}
          />
        </Svg>
      );

    case "search":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={strokeW} />
          <Path
            d="M16.5 16.5L21 21"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        </Svg>
      );

    case "check":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 12.5L9.5 17L19 7"
            stroke={color}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "lock":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="5"
            y="10"
            width="14"
            height="11"
            rx="3"
            stroke={color}
            strokeWidth={strokeW}
          />
          <Path
            d="M8 10V6.5C8 4.567 9.79086 3 12 3C14.2091 3 16 4.567 16 6.5V10"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        </Svg>
      );

    case "bookmark":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 4C6 3.44772 6.44772 3 7 3H17C17.5523 3 18 3.44772 18 4V21L12 17.5L6 21V4Z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? color : "none"}
          />
        </Svg>
      );

    case "notes":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="4"
            y="3"
            width="16"
            height="18"
            rx="3"
            stroke={color}
            strokeWidth={strokeW}
          />
          <Path
            d="M8 8H16M8 12H16M8 16H12"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        </Svg>
      );

    case "chevron":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M7 10L12 15L17 10"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "back":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M15 19L8 12L15 5"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "arrow":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M7 17L17 7M17 7H8M17 7V16"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "close":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 6L18 18M6 18L18 6"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        </Svg>
      );

    case "chat":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20 12C20 16.4183 16.4183 20 12 20C10.5 20 9.1 19.6 7.9 18.9L4 20L5.3 16.4C4.5 15.1 4 13.6 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? color : "none"}
          />
        </Svg>
      );

    case "sidebar":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="3"
            stroke={color}
            strokeWidth={strokeW}
          />
          <Path
            d="M9 4V20"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        </Svg>
      );

    case "brain":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9.5 4C8.11929 4 7 5.11929 7 6.5C7 6.84 7.068 7.16 7.19 7.45C6.47 7.9 6 8.69 6 9.6C6 10.4 6.35 11.11 6.9 11.58C6.35 12.05 6 12.78 6 13.6C6 14.54 6.52 15.36 7.28 15.78C7.1 16.14 7 16.55 7 17C7 18.66 8.34 20 10 20C10.64 20 11.23 19.8 11.72 19.45C11.9 19.32 12 19.11 12 18.89V5.11C12 4.89 11.9 4.68 11.72 4.55C11.1 4.19 10.33 4 9.5 4Z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? color : "none"}
          />
          <Path
            d="M14.5 4C15.8807 4 17 5.11929 17 6.5C17 6.84 16.932 7.16 16.81 7.45C17.53 7.9 18 8.69 18 9.6C18 10.4 17.65 11.11 17.1 11.58C17.65 12.05 18 12.78 18 13.6C18 14.54 17.48 15.36 16.72 15.78C16.9 16.14 17 16.55 17 17C17 18.66 15.66 20 14 20C13.36 20 12.77 19.8 12.28 19.45C12.1 19.32 12 19.11 12 18.89V5.11C12 4.89 12.1 4.68 12.28 4.55C12.9 4.19 13.67 4 14.5 4Z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={filled ? color : "none"}
          />
        </Svg>
      );

    case "settings":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeW} />
          <Path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
        </Svg>
      );

    case "trend":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 17L9 11L13 15L21 7M21 7H15M21 7V13"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "download":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 4V15M12 15L7.5 10.5M12 15L16.5 10.5M5 19H19"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "more":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="5.5" r="1.6" fill={color} />
          <Circle cx="12" cy="12" r="1.6" fill={color} />
          <Circle cx="12" cy="18.5" r="1.6" fill={color} />
        </Svg>
      );

    default:
      return null;
  }
}
