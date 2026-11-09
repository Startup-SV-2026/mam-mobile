import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Path, G, Text as SvgText } from "react-native-svg";
import type { Lesson, LessonPage } from "../types/course";
import { theme as t, ui } from "./ui";
import { Icon } from "./Icon";
const colors = ["#DDEEF3", "#E3E5C8", "#FBDACC"];
export function LessonFigure({
  page,
}: {
  page: LessonPage;
  lesson: Lesson;
  index: number;
}) {
  const visual = page.visual;
  // Older courses don't contain a visual plan. Show the takeaway, not repeated chapter titles.
  if (!visual)
    return (
      <View
        style={[
          ui.row,
          {
            backgroundColor: t.soft,
            padding: 17,
            borderRadius: 16,
            marginVertical: 23,
            alignItems: "flex-start",
          },
        ]}
      >
        <Icon name="sprout" size={23} color="#6D8B57" />
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={[ui.label, { fontSize: 10 }]}>MỘT ĐIỀU ĐỂ NHỚ</Text>
          <Text style={{ fontSize: 15, lineHeight: 24, color: t.ink }}>
            {page.takeaway}
          </Text>
        </View>
      </View>
    );
  const items = visual.items;
  return (
    <View
      style={[
        ui.card,
        { padding: 18, gap: 18, marginVertical: 23, borderBottomWidth: 3 },
      ]}
    >
      <Text
        style={{
          fontSize: 18,
          lineHeight: 26,
          fontWeight: "700",
          textAlign: "center",
          color: t.ink,
        }}
      >
        {visual.title}
      </Text>
      {visual.kind === "cycle" ? (
        <>
          <Svg
            width="100%"
            height={190}
            viewBox="0 0 300 190"
            accessible={false}
          >
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
          <View style={{ gap: 12 }}>
            {items.map((item, i) => (
              <View key={i} style={[ui.row, { alignItems: "flex-start" }]}>
                <View
                  style={{
                    width: 27,
                    height: 27,
                    borderRadius: 15,
                    backgroundColor: colors[i],
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: t.ink,
                  }}
                >
                  <Text style={{ color: t.ink }}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 15, fontWeight: "700", color: t.ink }}
                  >
                    {item.label}
                  </Text>
                  <Text style={[ui.body, { fontSize: 13, marginTop: 4 }]}>
                    {item.detail}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : visual.kind === "timeline" || visual.kind === "steps" ? (
        <View>
          {items.map((item, i) => (
            <View
              key={i}
              style={{ flexDirection: "row", gap: 14, minHeight: 95 }}
            >
              <View style={{ width: 32, alignItems: "center" }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 16,
                    backgroundColor: colors[i],
                    borderWidth: 1,
                    borderColor: t.ink,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 12, fontWeight: "700", color: t.ink }}
                  >
                    {i + 1}
                  </Text>
                </View>
                {i < items.length - 1 && (
                  <View
                    style={{
                      flex: 1,
                      width: 2,
                      backgroundColor: t.line,
                      marginVertical: 5,
                    }}
                  />
                )}
              </View>
              <View style={{ flex: 1, paddingBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    fontWeight: "700",
                    color: t.ink,
                  }}
                >
                  {item.label}
                </Text>
                <Text style={[ui.body, { fontSize: 14, marginTop: 6 }]}>
                  {item.detail}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {items.map((item, i) => (
            <View
              key={i}
              style={{
                padding: 16,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: t.ink,
                backgroundColor: colors[i],
              }}
            >
              <Text
                style={{
                  fontSize: 21,
                  fontWeight: "700",
                  lineHeight: 29,
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
                  marginTop: 6,
                }}
              >
                {item.detail}
              </Text>
            </View>
          ))}
        </View>
      )}
      <View style={{ height: 1, backgroundColor: t.line }} />
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
