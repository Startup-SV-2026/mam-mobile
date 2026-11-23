import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  AppState,
  Easing,
  Platform,
  Pressable,
  View,
} from "react-native";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";
export type MascotMood = "idle" | "thinking" | "happy";
// Vector artwork stays crisp at button and hero sizes. No image/animation service required.
export function MamMascot({
  size = 88,
  mood = "idle",
  interactive = false,
}: {
  size?: number;
  mood?: MascotMood;
  interactive?: boolean;
}) {
  const [reduced, setReduced] = useState(true),
    [foreground, setForeground] = useState(
      AppState.currentState !== "background",
    ),
    [greeting, setGreeting] = useState(false);
  const bob = useRef(new Animated.Value(0)).current,
    sway = useRef(new Animated.Value(0)).current,
    blink = useRef(new Animated.Value(1)).current;
  const greetingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expression = greeting ? "happy" : mood;
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setReduced(value);
      })
      .catch(() => {});
    const motion = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    const state = AppState.addEventListener("change", (value) =>
      setForeground(value === "active"),
    );
    return () => {
      mounted = false;
      motion.remove();
      state.remove();
      if (greetingTimer.current) clearTimeout(greetingTimer.current);
    };
  }, []);
  useEffect(() => {
    bob.setValue(0);
    sway.setValue(0);
    blink.setValue(1);
    if (reduced || !foreground) return;
    const native = Platform.OS !== "web";
    const timing = (value: Animated.Value, toValue: number, duration: number) =>
      Animated.timing(value, {
        toValue,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: native,
        isInteraction: false,
      });
    const bounce = Animated.loop(
      Animated.sequence(
        expression === "happy"
          ? [timing(bob, 1, 230), timing(bob, 0, 320), Animated.delay(850)]
          : [timing(bob, 1, 1500), timing(bob, 0, 1500)],
      ),
    );
    const tilt = Animated.loop(
      Animated.sequence([
        timing(sway, 1, expression === "thinking" ? 650 : 1400),
        timing(sway, -1, expression === "thinking" ? 1100 : 2200),
        timing(sway, 0, 850),
      ]),
    );
    const eyes = Animated.loop(
      Animated.sequence([
        Animated.delay(expression === "thinking" ? 1800 : 3000),
        timing(blink, 0.1, 85),
        timing(blink, 1, 105),
        Animated.delay(1300),
      ]),
    );
    bounce.start();
    tilt.start();
    eyes.start();
    return () => {
      bounce.stop();
      tilt.stop();
      eyes.stop();
      bob.stopAnimation();
      sway.stopAnimation();
      blink.stopAnimation();
    };
  }, [expression, reduced, foreground, bob, sway, blink]);
  function greet() {
    setGreeting(true);
    if (greetingTimer.current) clearTimeout(greetingTimer.current);
    greetingTimer.current = setTimeout(() => setGreeting(false), 1400);
  }
  const artwork = (
    <View
      pointerEvents="none"
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{ width: 120, height: 140, transform: [{ scale: size / 140 }] }}
      >
        <Svg
          width={120}
          height={140}
          viewBox="0 0 120 140"
          style={{ position: "absolute" }}
          accessible={false}
        >
          <Ellipse
            cx={60}
            cy={129}
            rx={29}
            ry={4.5}
            fill="#203D28"
            opacity={0.1}
          />
        </Svg>
        <Animated.View
          style={{
            width: 120,
            height: 140,
            transform: [
              {
                translateY: bob.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, expression === "happy" ? -12 : -3],
                }),
              },
              {
                rotate: sway.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange:
                    expression === "thinking"
                      ? ["-7deg", "0deg", "7deg"]
                      : ["-3deg", "0deg", "3deg"],
                }),
              },
            ],
          }}
        >
          <Svg
            width={120}
            height={140}
            viewBox="0 0 120 140"
            accessible={false}
          >
            <Path
              d="M42 110 Q34 121 39 124 Q47 127 53 115 M70 114 Q72 126 82 124 Q87 122 79 110"
              fill="#896549"
            />
            <Path
              d={
                expression === "happy"
                  ? "M29 84 Q17 79 18 68 M91 78 Q105 69 100 56"
                  : "M28 80 Q17 83 20 93 M92 80 Q104 83 100 93"
              }
              fill="none"
              stroke="#216E33"
              strokeWidth={6}
              strokeLinecap="round"
            />
            <Path
              d="M60 54 Q56 36 70 20"
              fill="none"
              stroke="#216E33"
              strokeWidth={5}
              strokeLinecap="round"
            />
            <Path
              d="M59 40 C44 45 25 35 25 18 C43 15 57 24 59 40Z"
              fill="#86BC64"
            />
            <Path
              d="M31 23 Q43 27 54 36"
              stroke="#5B9B49"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M62 31 C59 17 72 7 90 10 C90 27 77 35 62 31Z"
              fill="#27843D"
            />
            <Path
              d="M68 27 L83 16"
              stroke="#76B45D"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <Path
              d="M60 43 C83 43 96 59 95 81 C95 103 82 116 60 116 C38 116 25 103 25 81 C24 59 38 43 60 43Z"
              fill="#27843D"
              stroke="#216E33"
              strokeWidth={1.4}
            />
            <Ellipse
              cx={39}
              cy={68}
              rx={6}
              ry={12}
              fill="#FFFFFF"
              opacity={0.11}
              transform="rotate(20 39 68)"
            />
            <Ellipse
              cx={41}
              cy={88}
              rx={5}
              ry={3}
              fill="#A8D38A"
              opacity={0.75}
            />
            <Ellipse
              cx={79}
              cy={88}
              rx={5}
              ry={3}
              fill="#A8D38A"
              opacity={0.75}
            />
            {expression === "happy" ? (
              <Path d="M50 89 Q60 105 70 89 Q60 94 50 89Z" fill="#143D24" />
            ) : expression === "thinking" ? (
              <Ellipse cx={62} cy={94} rx={3.5} ry={2.8} fill="#F7FAEE" />
            ) : (
              <Path
                d="M53 91 Q60 97 67 91"
                fill="none"
                stroke="#F7FAEE"
                strokeWidth={2.6}
                strokeLinecap="round"
              />
            )}
            {expression === "happy" && (
              <Path
                d="M56 97 Q60 94 65 97"
                stroke="#DFA08B"
                strokeWidth={2.4}
                strokeLinecap="round"
              />
            )}
          </Svg>
          <Animated.View
            style={{
              position: "absolute",
              left: 40,
              top: 71,
              width: 40,
              height: 15,
              transform: [
                { scaleY: blink },
                { translateX: expression === "thinking" ? 2 : 0 },
              ],
            }}
          >
            <Svg width={40} height={15} viewBox="0 0 40 15" accessible={false}>
              {expression === "happy" ? (
                <>
                  <Path
                    d="M4 9 Q9 1 14 9 M26 9 Q31 1 36 9"
                    stroke="#F7FAEE"
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                <>
                  <Ellipse cx={9} cy={7} rx={3.6} ry={5.1} fill="#F7FAEE" />
                  <Ellipse cx={31} cy={7} rx={3.6} ry={5.1} fill="#F7FAEE" />
                </>
              )}
            </Svg>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
  return interactive ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Chào Mầm"
      onPress={greet}
      hitSlop={8}
    >
      {artwork}
    </Pressable>
  ) : (
    <View accessible={false}>{artwork}</View>
  );
}
