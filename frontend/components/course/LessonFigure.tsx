import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import type { Lesson, LessonPage, LessonVisual } from "../../types/course";
import {
  visualNames,
  visualPalette,
  visualPalettes,
} from "../../lib/visual-design";
import { theme as t, ui } from "../ui/ui";
import { Icon } from "../ui/Icon";
const detail = { fontSize: 14, lineHeight: 22, color: t.muted };
const label = {
  fontSize: 16,
  lineHeight: 23,
  fontWeight: "600" as const,
  color: t.ink,
};
function VisualContent({ visual }: { visual: LessonVisual }) {
  const [selected, setSelected] = useState(0),
    [width, setWidth] = useState(300);
  const p = visualPalette(visual),
    items = visual.items;
  const swatches = [p, visualPalettes.sand, visualPalettes.lavender];
  const badge = (n: number) => (
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 11,
        backgroundColor: p.light,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: p.ink, fontWeight: "700", fontSize: 12 }}>
        {String(n + 1).padStart(2, "0")}
      </Text>
    </View>
  );
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {visual.kind === "comparison" ? (
        <View
          style={{
            flexDirection:
              items.length === 2 && width >= 285 ? "row" : "column",
            gap: 10,
          }}
        >
          {items.map((item, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                gap: 12,
                padding: 16,
                borderRadius: 18,
                backgroundColor: swatches[i].paper,
                borderTopWidth: 3,
                borderTopColor: swatches[i].strong,
              }}
            >
              <Text
                style={{
                  color: swatches[i].strong,
                  fontSize: 11,
                  fontWeight: "700",
                  letterSpacing: 1,
                }}
              >
                {String.fromCharCode(65 + i)}
              </Text>
              <Text style={label}>{item.label}</Text>
              <Text style={detail}>{item.detail}</Text>
            </View>
          ))}
        </View>
      ) : visual.kind === "cycle" ? (
        <>
          <View style={{ height: 230, marginHorizontal: -5 }}>
            <Svg
              width="100%"
              height={225}
              viewBox="0 0 300 225"
              accessible={false}
            >
              <Circle cx={150} cy={112} r={83} fill={p.paper} />
              <Path
                d="M178 40 Q260 65 238 130 M239 118 L238 132 L250 125 M217 172 Q150 218 82 171 M94 171 L81 170 L86 184 M60 132 Q38 60 120 39 M109 37 L122 38 L116 50"
                fill="none"
                stroke={p.strong}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <View style={{ position: "absolute", left: "43%", top: 100 }}>
              <Icon name="review" size={35} color={p.strong} />
            </View>
            {items.map((item, i) => (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={`Bước ${i + 1}: ${item.label}`}
                accessibilityState={{ selected: selected === i }}
                onPress={() => setSelected(i)}
                style={{
                  position: "absolute",
                  top: [7, 136, 136][i],
                  left: `${[50, 80, 20][i]}%`,
                  marginLeft: -46,
                  width: 92,
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: selected === i ? p.strong : t.surface,
                    borderWidth: 1.5,
                    borderColor: p.strong,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: selected === i ? t.onPrimary : p.strong,
                    }}
                  >
                    {i + 1}
                  </Text>
                </View>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 12,
                    lineHeight: 17,
                    fontWeight: "600",
                    textAlign: "center",
                    color: p.ink,
                  }}
                >
                  {item.label.replace(/^\d+\s*[·.\-]\s*/, "")}
                </Text>
              </Pressable>
            ))}
          </View>
          <View
            style={{
              borderRadius: 17,
              padding: 16,
              backgroundColor: p.paper,
              gap: 6,
            }}
          >
            <Text style={[label, { color: p.ink }]}>
              {items[selected]?.label}
            </Text>
            <Text style={detail}>{items[selected]?.detail}</Text>
          </View>
        </>
      ) : visual.kind === "concept-map" ? (
        <>
          <View
            style={{
              alignSelf: "center",
              maxWidth: "90%",
              padding: 16,
              borderRadius: 17,
              backgroundColor: p.strong,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                lineHeight: 25,
                fontWeight: "600",
                color: t.onPrimary,
                textAlign: "center",
              }}
            >
              {visual.title}
            </Text>
          </View>
          <Svg
            width="100%"
            height={38}
            viewBox="0 0 300 38"
            preserveAspectRatio="none"
            accessible={false}
          >
            <Path
              d={
                items.length === 2
                  ? "M150 0 V16 M75 38 V16 H225 V38"
                  : "M150 0 V16 M50 38 V16 H250 V38 M150 16 V38"
              }
              stroke={p.strong}
              strokeWidth={1.5}
              fill="none"
            />
          </Svg>
          <View style={{ flexDirection: "row", gap: 7 }}>
            {items.map((item, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 5,
                  borderRadius: 12,
                  backgroundColor: swatches[i].light,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 18,
                    fontWeight: "600",
                    color: swatches[i].ink,
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ gap: 13, marginTop: 20 }}>
            {items.map((item, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: swatches[i].strong,
                    marginTop: 7,
                  }}
                />
                <Text style={[detail, { flex: 1 }]}>
                  <Text style={{ fontWeight: "600", color: t.ink }}>
                    {item.label}.{" "}
                  </Text>
                  {item.detail}
                </Text>
              </View>
            ))}
          </View>
        </>
      ) : visual.kind === "layers" ? (
        <View style={{ gap: 9 }}>
          {items.map((item, i) => (
            <View
              key={i}
              style={{
                marginLeft: i * 14,
                padding: 17,
                borderRadius: 17,
                backgroundColor: swatches[i].paper,
                borderLeftWidth: 4,
                borderLeftColor: swatches[i].strong,
                gap: 7,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: swatches[i].strong,
                  letterSpacing: 1.2,
                }}
              >
                LỚP {i + 1}
              </Text>
              <Text style={label}>{item.label}</Text>
              <Text style={detail}>{item.detail}</Text>
            </View>
          ))}
        </View>
      ) : visual.kind === "formula" ? (
        <>
          <View
            style={{
              backgroundColor: p.paper,
              borderRadius: 20,
              paddingVertical: 25,
              paddingHorizontal: 14,
              borderWidth: 1,
              borderColor: p.light,
            }}
          >
            <Text
              selectable
              style={{
                fontSize: width < 300 ? 21 : 24,
                lineHeight: 36,
                fontWeight: "600",
                color: p.ink,
                textAlign: "center",
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
              }}
            >
              {visual.expression}
            </Text>
          </View>
          <View style={{ gap: 13, marginTop: 19 }}>
            {items.map((item, i) => (
              <View key={i} style={[ui.row, { alignItems: "flex-start" }]}>
                {badge(i)}
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={label}>{item.label}</Text>
                  <Text style={detail}>{item.detail}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : visual.kind === "metrics" ? (
        <View style={{ gap: 11 }}>
          {items.map((item, i) => (
            <View
              key={i}
              style={{
                padding: 19,
                borderRadius: 19,
                backgroundColor: swatches[i].paper,
                gap: 7,
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  lineHeight: 43,
                  fontWeight: "700",
                  letterSpacing: -1,
                  color: swatches[i].strong,
                }}
              >
                {item.value}
              </Text>
              <Text style={label}>{item.label}</Text>
              <Text style={detail}>{item.detail}</Text>
            </View>
          ))}
        </View>
      ) : visual.kind === "timeline" ? (
        <View>
          {items.map((item, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 16 }}>
              <View style={{ width: 18, alignItems: "center" }}>
                <View
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: 7,
                    backgroundColor: swatches[i].strong,
                    marginTop: 6,
                    borderWidth: 3,
                    borderColor: swatches[i].light,
                  }}
                />
                {i < items.length - 1 && (
                  <View
                    style={{
                      width: 1,
                      flex: 1,
                      backgroundColor: p.light,
                      marginVertical: 6,
                    }}
                  />
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  gap: 9,
                  paddingBottom: i === items.length - 1 ? 0 : 23,
                }}
              >
                <View
                  style={{
                    alignSelf: "flex-start",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: swatches[i].paper,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: swatches[i].ink,
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
                <Text style={detail}>{item.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View>
          {items.map((item, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 14 }}>
              <View style={{ alignItems: "center", width: 32 }}>
                {badge(i)}
                {i < items.length - 1 && (
                  <View
                    style={{
                      flex: 1,
                      width: 1,
                      backgroundColor: p.light,
                      marginVertical: 7,
                    }}
                  />
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  paddingBottom: i === items.length - 1 ? 0 : 22,
                  gap: 7,
                }}
              >
                <Text style={label}>
                  {item.label.replace(/^\d+\s*[·.\-]\s*/, "")}
                </Text>
                <Text style={detail}>{item.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
export function LessonFigure({
  page,
}: {
  page: LessonPage;
  lesson: Lesson;
  index: number;
}) {
  const visual = page.visual;
  if (!visual)
    return (
      <View
        style={{
          marginVertical: 23,
          backgroundColor: "#F0F5E9",
          padding: 20,
          borderRadius: 20,
          gap: 10,
          borderLeftWidth: 3,
          borderLeftColor: t.primary,
        }}
      >
        <View style={ui.row}>
          <Icon name="sprout" size={19} color={t.accent} />
          <Text style={[ui.label, { fontSize: 10, color: t.accent }]}>
            MỘT ĐIỀU ĐỂ NHỚ
          </Text>
        </View>
        <Text style={{ fontSize: 16, lineHeight: 26, color: t.ink }}>
          {page.takeaway}
        </Text>
      </View>
    );
  const p = visualPalette(visual);
  return (
    <View
      style={{
        marginVertical: 25,
        borderWidth: 1,
        borderColor: t.line,
        borderRadius: 25,
        backgroundColor: t.surface,
        overflow: "hidden",
      }}
    >
      <View style={{ height: 4, backgroundColor: p.light }} />
      <View style={{ padding: 19, gap: 19 }}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "600",
            letterSpacing: 1.6,
            color: p.strong,
          }}
        >
          {visualNames[visual.kind].toLocaleUpperCase("vi")}
        </Text>
        {visual.kind !== "concept-map" && (
          <Text
            style={{
              fontSize: 20,
              lineHeight: 28,
              fontWeight: "600",
              letterSpacing: -0.3,
              color: t.ink,
            }}
          >
            {visual.title}
          </Text>
        )}
        <VisualContent key={JSON.stringify(visual)} visual={visual} />
        <View
          style={{ paddingTop: 15, borderTopWidth: 1, borderTopColor: t.line }}
        >
          <Text style={{ fontSize: 13, lineHeight: 21, color: t.muted }}>
            {page.takeaway}
          </Text>
        </View>
      </View>
    </View>
  );
}
