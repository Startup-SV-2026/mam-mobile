import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Path, G, Text as SvgText } from "react-native-svg";
import type { Lesson, LessonPage } from "../types/course";
import { theme as t, ui } from "./ui";
const colors = ["#DDEEF3", "#E3E5C8", "#FBDACC"];
export function LessonFigure({
  page,
  lesson,
  index,
}: {
  page: LessonPage;
  lesson: Lesson;
  index: number;
}) {
  const visual = page.visual;
  const items =
    visual?.items ??
    lesson.pages.map((p, i) => ({
      label: String(i + 1).padStart(2, "0"),
      detail: p.title,
    }));
  return (
    <View
      style={[
        ui.card,
        {
          padding: 18,
          gap: 17,
          marginVertical: 23,
          borderRadius: 20,
          borderBottomWidth: 3,
        },
      ]}
    >
      <Text
        style={{
          fontSize: 18,
          lineHeight: 25,
          fontWeight: "700",
          textAlign: "center",
          color: t.ink,
        }}
      >
        {visual?.title ?? "Một góc nhìn để ghi nhớ"}
      </Text>
      {visual?.kind === "cycle" && (
        <Svg width="100%" height={190} viewBox="0 0 300 190" accessible={false}>
          <G stroke={t.ink} strokeWidth={2} fill="none">
            <Path d="M166 32c81 7 116 63 80 99m-1-13 1 14 14-6M221 151c-71 40-145 14-160-22m-2 14 2-15 14 4M53 106C39 58 83 28 128 30m-11-8 13 8-12 7" />
            {[
              [148, 29],
              [243, 143],
              [55, 122],
            ].map(([x, y], i) => (
              <Circle key={i} cx={x} cy={y} r={19} fill={colors[i]} />
            ))}
          </G>
          {[
            [148, 35],
            [243, 149],
            [55, 128],
          ].map(([x, y], i) => (
            <SvgText
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize={18}
              fontWeight="700"
              fill={t.ink}
            >
              {i + 1}
            </SvgText>
          ))}
        </Svg>
      )}
      {items.map((item, i) => (
        <View
          key={i}
          style={{
            padding: 16,
            borderRadius: 12,
            borderWidth: visual ? 1.5 : 1,
            borderColor: visual ? t.ink : t.line,
            backgroundColor: colors[i % 3],
            opacity: visual || index === i ? 1 : 0.65,
          }}
        >
          <Text
            style={{
              fontSize: visual?.kind === "comparison" ? 24 : 16,
              fontWeight: "700",
              lineHeight: 30,
              color: t.ink,
            }}
          >
            {item.label}
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              color: "#5E574D",
              marginTop: 3,
            }}
          >
            {item.detail}
          </Text>
        </View>
      ))}
      <Text
        style={{
          fontSize: 14,
          lineHeight: 22,
          textAlign: "center",
          color: t.ink,
        }}
      >
        {page.takeaway}
      </Text>
    </View>
  );
}
