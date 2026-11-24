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
import { MamMascot } from "../mascot/MamMascot";

const detail = { fontSize: 14, lineHeight: 22, color: t.muted };
const label = {
  fontSize: 16,
  lineHeight: 23,
  fontWeight: "600" as const,
  color: t.ink,
};

function ComparisonTabs({
  items,
  visualTitle,
}: {
  items: { label: string; detail: string }[];
  visualTitle: string;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const activeItem = items[activeTab] || items[0];

  const bullets = activeItem.detail
    .split(/[;\n•]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <View style={{ gap: 12 }}>
      {visualTitle ? (
        <Text style={{ fontSize: 14, color: t.muted, fontWeight: "600" }}>
          {visualTitle}
        </Text>
      ) : null}

      {/* Segmented Pill Tabs */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#EBE5D8",
          borderRadius: 16,
          padding: 4,
          gap: 4,
        }}
      >
        {items.map((item, idx) => {
          const isSelected = activeTab === idx;
          return (
            <Pressable
              key={idx}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setActiveTab(idx)}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 8,
                borderRadius: 12,
                backgroundColor: isSelected ? "#FFFFFF" : "transparent",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: isSelected ? "#000" : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isSelected ? 0.08 : 0,
                shadowRadius: 3,
                elevation: isSelected ? 1 : 0,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 13.5,
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected ? t.ink : t.muted,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Card showing the selected view */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "rgba(35, 27, 21, 0.09)",
          padding: 18,
          minHeight: 120,
          position: "relative",
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", color: t.ink }}>
          {activeItem.label}
        </Text>

        <View style={{ gap: 8, paddingRight: 40 }}>
          {bullets.map((bullet, bIdx) => (
            <View key={bIdx} style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
              <Text style={{ color: t.accent, fontSize: 15, lineHeight: 21, fontWeight: "700" }}>•</Text>
              <Text style={{ flex: 1, fontSize: 14.5, lineHeight: 22, color: t.ink }}>
                {bullet}
              </Text>
            </View>
          ))}
        </View>

        {/* Mascot watermark peek */}
        <View style={{ position: "absolute", right: 12, bottom: 8, opacity: 0.9 }}>
          <MamMascot size={36} mood="thinking" />
        </View>
      </View>
    </View>
  );
}

function StepperList({
  items,
  visualTitle,
}: {
  items: { label: string; detail: string }[];
  visualTitle: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "rgba(35, 27, 21, 0.09)",
        padding: 20,
        position: "relative",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: t.ink }}>
            {visualTitle}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "600", color: t.muted }}>
            {items.length} bước
          </Text>
        </View>
        <Icon name="bookmark" size={18} color="rgba(35, 27, 21, 0.35)" />
      </View>

      <View style={{ gap: 0 }}>
        {items.map((item, i) => (
          <View key={i} style={{ flexDirection: "row", gap: 14 }}>
            {/* Stepper number + connecting line */}
            <View style={{ alignItems: "center", width: 28 }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: "#5CB9F2", // sky blue step pill
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#FFFFFF" }}>
                  {i + 1}
                </Text>
              </View>
              {i < items.length - 1 && (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    backgroundColor: "#E2D9CC",
                    marginVertical: 4,
                  }}
                />
              )}
            </View>

            {/* Content column */}
            <View
              style={{
                flex: 1,
                paddingBottom: i === items.length - 1 ? 6 : 18,
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "700", color: t.ink }}>
                {item.label.replace(/^\d+\s*[·.\-]\s*/, "")}
              </Text>
              <Text style={{ fontSize: 13.5, lineHeight: 21, color: "#5C564E" }}>
                {item.detail}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Mascot watermark peek */}
      <View style={{ position: "absolute", right: 12, bottom: 8, opacity: 0.9 }}>
        <MamMascot size={36} mood="idle" />
      </View>
    </View>
  );
}

function VisualContent({ visual }: { visual: LessonVisual }) {
  const [selected, setSelected] = useState(0),
    [width, setWidth] = useState(300);
  const p = visualPalette(visual),
    items = visual.items;
  const swatches = [p, visualPalettes.sand, visualPalettes.lavender];

  if (visual.kind === "comparison") {
    return <ComparisonTabs items={items} visualTitle={visual.title} />;
  }

  if (visual.kind === "steps") {
    return <StepperList items={items} visualTitle={visual.title} />;
  }

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
      {visual.kind === "cycle" ? (
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
          marginVertical: 20,
          backgroundColor: "#FAF7EE",
          padding: 18,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "rgba(35, 27, 21, 0.08)",
          gap: 8,
          borderLeftWidth: 4,
          borderLeftColor: t.primary,
        }}
      >
        <View style={ui.row}>
          <Icon name="sprout" size={18} color={t.accent} />
          <Text style={[ui.label, { fontSize: 11, color: t.accent, letterSpacing: 1 }]}>
            ĐIỂM THEN CHỐT
          </Text>
        </View>
        <Text style={{ fontSize: 15, lineHeight: 24, color: t.ink, fontWeight: "500" }}>
          {page.takeaway}
        </Text>
      </View>
    );

  if (visual.kind === "steps" || visual.kind === "comparison") {
    return (
      <View style={{ marginVertical: 20 }}>
        <VisualContent key={JSON.stringify(visual)} visual={visual} />
      </View>
    );
  }

  const p = visualPalette(visual);
  return (
    <View
      style={{
        marginVertical: 22,
        borderWidth: 1,
        borderColor: "rgba(35, 27, 21, 0.09)",
        borderRadius: 22,
        backgroundColor: "#FFFFFF",
        padding: 18,
        gap: 16,
        position: "relative",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 1.4,
            color: p.strong,
            textTransform: "uppercase",
          }}
        >
          {visualNames[visual.kind]}
        </Text>
        <Icon name="bookmark" size={18} color="rgba(35, 27, 21, 0.35)" />
      </View>

      {visual.kind !== "concept-map" && (
        <Text
          style={{
            fontSize: 18,
            lineHeight: 25,
            fontWeight: "700",
            color: t.ink,
          }}
        >
          {visual.title}
        </Text>
      )}

      <VisualContent key={JSON.stringify(visual)} visual={visual} />

      {page.takeaway ? (
        <View style={{ paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(35, 27, 21, 0.08)" }}>
          <Text style={{ fontSize: 13.5, lineHeight: 21, color: t.muted }}>
            {page.takeaway}
          </Text>
        </View>
      ) : null}

      {/* Mascot watermark peek */}
      <View style={{ position: "absolute", right: 14, bottom: 10, opacity: 0.85 }}>
        <MamMascot size={32} mood="idle" />
      </View>
    </View>
  );
}
