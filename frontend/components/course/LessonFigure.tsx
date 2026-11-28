import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import Svg, {
  Circle,
  Line,
  Path,
  Polygon,
  Text as SvgText,
} from "react-native-svg";
import type { Lesson, LessonPage, LessonVisual } from "../../types/course";
import { visualPalette, visualPalettes, localizeVisual, getNestedLayerRenderOrder } from "../../lib/visual-design";
import { theme as t, ui } from "../ui/ui";
import { Icon } from "../ui/Icon";
import { triggerHaptic, playSound } from "../../lib/feedback";

const INK = "#231B15";
const CARD_BG = "#FDFBF5";
const CARD_BORDER = "rgba(35, 27, 21, 0.13)";

// Bảng màu phẳng viền mực 1.5px đồng bộ tinh thần editorial hiện đại
const POP_FILLS = [
  { solid: "#72C3FA", soft: "#E2F2FE", ink: INK }, // Sky Blue
  { solid: "#869E45", soft: "#E6EDCF", ink: INK }, // Olive Moss
  { solid: "#F0735E", soft: "#FCE1DA", ink: INK }, // Coral Terracotta
  { solid: "#DFB23B", soft: "#F9EED0", ink: INK }, // Warm Ochre
  { solid: "#58B8A5", soft: "#DCF2EE", ink: INK }, // Sage Teal
];

const detailStyle = { fontSize: 13.5, lineHeight: 20, color: "#574F46" };
const labelStyle = {
  fontSize: 15,
  lineHeight: 21,
  fontWeight: "700" as const,
  color: INK,
};

/* 1. Minimal 2-Column Comparison (Ảnh 5 & 10) */
function ComparisonCards({
  items,
  visualTitle,
  takeaway,
}: {
  items: LessonVisual["items"];
  visualTitle: string;
  takeaway?: string;
}) {
  const isShortComparison =
    items.length === 2 &&
    items.every((it) => it.detail.length < 50 && !it.detail.includes(";"));

  return (
    <View style={{ marginVertical: 18, gap: 10 }}>
      {visualTitle ? (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#6D5F4D",
            marginBottom: 2,
            letterSpacing: 0.3,
          }}
        >
          {visualTitle}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: isShortComparison ? "row" : "column",
          gap: 12,
        }}
      >
        {items.map((item, idx) => {
          const accent = POP_FILLS[idx % POP_FILLS.length];
          const bullets = item.detail
            .split(/[;\n•]/)
            .map((s) => s.trim())
            .filter(Boolean);

          return (
            <View
              key={idx}
              style={{
                flex: isShortComparison ? 1 : undefined,
                backgroundColor: CARD_BG,
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: CARD_BORDER,
                borderLeftWidth: 4,
                borderLeftColor: accent.solid,
                padding: 16,
                gap: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: accent.soft,
                    borderWidth: 1,
                    borderColor: accent.solid,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: "700", color: INK }}>
                    {String.fromCharCode(65 + idx)}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: INK,
                    flex: 1,
                  }}
                >
                  {item.label}
                </Text>
              </View>

              <View style={{ gap: 8 }}>
                {bullets.map((b, bIdx) => {
                  const parts = b.split(/:\s*(.*)/);
                  const hasPrefix = parts.length > 1 && parts[0].length < 30;
                  return (
                    <View
                      key={bIdx}
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          color: accent.solid,
                          fontSize: 14,
                          lineHeight: 20,
                          fontWeight: "800",
                        }}
                      >
                        •
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 13.5,
                          lineHeight: 20,
                          color: "#3D352E",
                        }}
                      >
                        {hasPrefix ? (
                          <>
                            <Text style={{ fontWeight: "700", color: INK }}>
                              {parts[0]}:{" "}
                            </Text>
                            {parts[1]}
                          </>
                        ) : (
                          b
                        )}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

      {takeaway ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginTop: 4,
            paddingHorizontal: 4,
          }}
        >
          <Text style={{ fontSize: 13, color: "#8E806D" }}>💡</Text>
          <Text
            style={{
              fontSize: 13,
              lineHeight: 19,
              color: "#6D5F4D",
              fontStyle: "italic",
              flex: 1,
            }}
          >
            {takeaway}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/* 2. Clean Vertical Stepper (Ảnh 7) */
function StepperCard({
  items,
  visualTitle,
}: {
  items: LessonVisual["items"];
  visualTitle: string;
}) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <View
      style={{
        marginVertical: 18,
        backgroundColor: CARD_BG,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: CARD_BORDER,
        padding: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#7C7367" }}>
          {visualTitle}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: "600", color: "#7C7367" }}>
          {items.length} bước
        </Text>
      </View>

      <View>
        {items.map((item, i) => {
          const isSelected = activeStep === i;
          return (
            <Pressable
              key={i}
              onPress={() => {
                triggerHaptic("selection");
                playSound("tap");
                setActiveStep(isSelected ? null : i);
              }}
              style={{
                flexDirection: "row",
                gap: 14,
                backgroundColor: isSelected ? "rgba(114, 195, 250, 0.12)" : "transparent",
                borderRadius: 12,
                padding: isSelected ? 8 : 0,
                marginHorizontal: isSelected ? -8 : 0,
                marginBottom: isSelected ? 8 : 0,
              }}
            >
              <View style={{ alignItems: "center", width: 26, paddingTop: isSelected ? 2 : 0 }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: isSelected ? "#DFB23B" : "#72C3FA",
                    borderWidth: 1.2,
                    borderColor: INK,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 11.5, fontWeight: "700", color: INK }}>
                    {i + 1}
                  </Text>
                </View>
                {i < items.length - 1 && (
                  <View
                    style={{
                      width: 1.2,
                      flex: 1,
                      backgroundColor: "#DCD4C6",
                      marginVertical: 4,
                    }}
                  />
                )}
              </View>

              <View
                style={{
                  flex: 1,
                  paddingBottom: i === items.length - 1 ? 2 : 16,
                  gap: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: isSelected ? "#0D5F9A" : INK,
                  }}
                >
                  {item.label.replace(/^\d+\s*[·.\-]\s*/, "")}
                </Text>
                <Text style={detailStyle}>{item.detail}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/* 3. Thought-Experiment / Scenario Callout Box (Ảnh 8) */
function CalloutBox({
  visual,
}: {
  visual: LessonVisual;
}) {
  const paragraph = visual.items
    .map((it) => `${it.label.trim()}: ${it.detail.trim()}`)
    .join(" ");

  return (
    <View
      style={{
        marginVertical: 18,
        backgroundColor: "#F1ECE1",
        borderRadius: 18,
        padding: 22,
        gap: 10,
      }}
    >
      <Text
        style={{
          fontSize: 18.5,
          lineHeight: 26,
          fontWeight: "700",
          color: INK,
        }}
      >
        {visual.title}
      </Text>
      <Text
        style={{
          fontSize: 15,
          lineHeight: 23.5,
          color: "#2C251E",
        }}
      >
        {paragraph}
      </Text>
    </View>
  );
}

/* 4. Bento Metric Cards (Ảnh 2) */
function BentoMetrics({
  items,
}: {
  items: LessonVisual["items"];
}) {
  // Kiểm tra cặp phần trăm cộng lại ~100% cho Donut Chart
  const isComplementaryDonut =
    items.length === 2 &&
    (() => {
      const m0 = items[0].value?.match(/^\s*~?\s*(\d+(?:[.,]\d+)?)\s*%\s*$/);
      const m1 = items[1].value?.match(/^\s*~?\s*(\d+(?:[.,]\d+)?)\s*%\s*$/);
      if (!m0 || !m1) return false;
      const n0 = parseFloat(m0[1].replace(",", "."));
      const n1 = parseFloat(m1[1].replace(",", "."));
      return n0 > 0 && n1 > 0 && Math.abs(n0 + n1 - 100) <= 5;
    })();

  if (isComplementaryDonut) {
    const val1 = parseFloat(
      items[0].value!.match(/(\d+(?:[.,]\d+)?)/)![1].replace(",", "."),
    );
    const val2 = parseFloat(
      items[1].value!.match(/(\d+(?:[.,]\d+)?)/)![1].replace(",", "."),
    );
    const total = val1 + val2 || 100;
    const pct1 = Math.round((val1 / total) * 100);
    const pct2 = 100 - pct1;
    const circum = 289;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          paddingVertical: 6,
        }}
      >
        <View
          style={{
            width: 116,
            height: 116,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Svg width={116} height={116} viewBox="0 0 120 120">
            <Circle
              cx={60}
              cy={60}
              r={46}
              stroke="#EBE5D8"
              strokeWidth={14}
              fill="none"
            />
            <Circle
              cx={60}
              cy={60}
              r={46}
              stroke={POP_FILLS[0].solid}
              strokeWidth={14}
              fill="none"
              strokeDasharray={`${(pct1 / 100) * circum} ${circum}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <Circle
              cx={60}
              cy={60}
              r={46}
              stroke={POP_FILLS[2].solid}
              strokeWidth={14}
              fill="none"
              strokeDasharray={`${(pct2 / 100) * circum} ${circum}`}
              strokeDashoffset={-((pct1 / 100) * circum)}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </Svg>
          <View style={{ position: "absolute", alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: INK }}>
              {pct1}%
            </Text>
          </View>
        </View>

        <View style={{ flex: 1, gap: 10 }}>
          {items.map((item, idx) => (
            <View key={idx} style={{ gap: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 5,
                    backgroundColor: idx === 0 ? POP_FILLS[0].solid : POP_FILLS[2].solid,
                    borderWidth: 1,
                    borderColor: INK,
                  }}
                />
                <Text style={{ fontSize: 14.5, fontWeight: "700", color: INK }}>
                  {item.value} · {item.label}
                </Text>
              </View>
              <Text style={[detailStyle, { fontSize: 12.5, marginLeft: 15 }]}>
                {item.detail}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  const renderTile = (item: LessonVisual["items"][number], idx: number, flex = false) => {
    const sw = POP_FILLS[idx % POP_FILLS.length];
    return (
      <View
        key={idx}
        style={{
          flex: flex ? 1 : undefined,
          padding: 15,
          borderRadius: 11,
          backgroundColor: sw.soft,
          borderWidth: 1.5,
          borderColor: INK,
          gap: 3,
        }}
      >
        <Text
          style={{
            fontSize: 27,
            lineHeight: 33,
            fontWeight: "700",
            letterSpacing: -0.6,
            color: INK,
          }}
        >
          {item.value || `${idx + 1}`}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#3A322A" }}>
          {item.label}
        </Text>
        <Text style={{ fontSize: 12.5, lineHeight: 17.5, color: "#5B5349" }}>
          {item.detail}
        </Text>
      </View>
    );
  };

  if (items.length === 3) {
    return (
      <View style={{ gap: 10 }}>
        {renderTile(items[0], 0)}
        <View style={{ flexDirection: "row", gap: 10 }}>
          {renderTile(items[1], 1, true)}
          {renderTile(items[2], 2, true)}
        </View>
      </View>
    );
  }

  if (items.length === 2) {
    return (
      <View style={{ flexDirection: "row", gap: 10 }}>
        {renderTile(items[0], 0, true)}
        {renderTile(items[1], 2, true)}
      </View>
    );
  }

  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {renderTile(items[0], 0, true)}
        {renderTile(items[1], 1, true)}
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {items.slice(2, 4).map((it, i) => renderTile(it, i + 2, true))}
      </View>
    </View>
  );
}

/* 5. Pill Cycle Diagram (Ảnh 3) */
function PillCycle({
  visual,
}: {
  visual: LessonVisual;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const items = visual.items.slice(0, 3);
  const pillColors = ["#68BFF9", "#839B43", "#F0715E"];

  const handleSelect = (idx: number) => {
    triggerHaptic("selection");
    playSound("tap");
    setSelected(selected === idx ? null : idx);
  };

  return (
    <View style={{ gap: 10 }}>
      <View style={{ height: 224, justifyContent: "center" }}>
        <Svg
          width="100%"
          height={224}
          viewBox="0 0 320 224"
          accessible={false}
        >
          {/* Top-right arc */}
          <Path
            d="M 206 34 C 258 50, 274 102, 252 145"
            fill="none"
            stroke={INK}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          <Polygon points="248,149 250,138 259,144" fill={INK} />

          {/* Bottom arc */}
          <Path
            d="M 218 184 C 176 212, 144 212, 102 184"
            fill="none"
            stroke={INK}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          <Polygon points="97,181 108,181 103,190" fill={INK} />

          {/* Top-left arc */}
          <Path
            d="M 68 145 C 46 102, 62 50, 114 34"
            fill="none"
            stroke={INK}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          <Polygon points="119,33 109,30 112,40" fill={INK} />
        </Svg>

        {/* Center motif */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 85,
            right: 85,
            top: 92,
            alignItems: "center",
            gap: 2,
          }}
        >
          <Text style={{ fontSize: 15, color: "#6E655A" }}>↻</Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 11.5,
              fontWeight: "600",
              color: "#6E655A",
              textAlign: "center",
            }}
          >
            {visual.expression || "Tích lũy liên tục"}
          </Text>
        </View>

        {/* Top Pill */}
        {items[0] && (
          <Pressable
            onPress={() => handleSelect(0)}
            style={{
              position: "absolute",
              top: 12,
              alignSelf: "center",
              maxWidth: 160,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 9,
              backgroundColor: pillColors[0],
              borderWidth: 1.5,
              borderColor: INK,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12.5,
                fontWeight: "700",
                color: INK,
                textAlign: "center",
              }}
            >
              {items[0].label.replace(/^\d+\s*[·.\-]\s*/, "")}
            </Text>
          </Pressable>
        )}

        {/* Bottom-Right Pill */}
        {items[1] && (
          <Pressable
            onPress={() => handleSelect(1)}
            style={{
              position: "absolute",
              bottom: 34,
              right: 8,
              maxWidth: 138,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 9,
              backgroundColor: pillColors[1],
              borderWidth: 1.5,
              borderColor: INK,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12.5,
                fontWeight: "700",
                color: INK,
                textAlign: "center",
              }}
            >
              {items[1].label.replace(/^\d+\s*[·.\-]\s*/, "")}
            </Text>
          </Pressable>
        )}

        {/* Bottom-Left Pill */}
        {items[2] && (
          <Pressable
            onPress={() => handleSelect(2)}
            style={{
              position: "absolute",
              bottom: 34,
              left: 8,
              maxWidth: 138,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 9,
              backgroundColor: pillColors[2],
              borderWidth: 1.5,
              borderColor: INK,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12.5,
                fontWeight: "700",
                color: INK,
                textAlign: "center",
              }}
            >
              {items[2].label.replace(/^\d+\s*[·.\-]\s*/, "")}
            </Text>
          </Pressable>
        )}
      </View>

      {selected !== null && items[selected] ? (
        <View
          style={{
            padding: 13,
            borderRadius: 12,
            backgroundColor: "#F4EFE4",
            gap: 3,
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: "700", color: INK }}>
            {items[selected].label}
          </Text>
          <Text style={detailStyle}>{items[selected].detail}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* 6. Line / Trajectory Chart (Ảnh 4) */
function TrajectoryLineChart({
  items,
}: {
  items: LessonVisual["items"];
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const rawNums = items.map((it, idx) => {
    const m = it.value?.match(/-?\d+(?:[.,]\d+)?/);
    return m ? parseFloat(m[0].replace(",", ".")) : (idx + 1) * 10;
  });
  const minVal = Math.min(0, ...rawNums);
  const maxRaw = Math.max(...rawNums, 1);
  // Làm tròn mốc đỉnh trục tung đẹp mắt
  const magnitude = 10 ** Math.floor(Math.log10(maxRaw || 1));
  const niceMax = Math.ceil(maxRaw / magnitude) * magnitude || 10;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((r) =>
    Math.round((minVal + (niceMax - minVal) * r) * 10) / 10,
  );

  const leftPad = 38;
  const rightPad = 20;
  const topPad = 26;
  const bottomPad = 34;
  const chartW = 310 - leftPad - rightPad;
  const chartH = 196 - topPad - bottomPad;

  const points = items.map((it, i) => {
    const x =
      items.length === 1
        ? leftPad + chartW / 2
        : leftPad + (i / (items.length - 1)) * chartW;
    const ratio = (rawNums[i] - minVal) / (niceMax - minVal || 1);
    const y = topPad + chartH - ratio * chartH;
    return { x, y, val: it.value || String(rawNums[i]), label: it.label };
  });

  const pathD = points
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(" ");

  return (
    <View style={{ gap: 10 }}>
      <Svg width="100%" height={204} viewBox="0 0 310 204">
        {ticks.map((tk, idx) => {
          const y = topPad + chartH - (idx / (ticks.length - 1)) * chartH;
          return (
            <React.Fragment key={idx}>
              <Line
                x1={leftPad}
                y1={y}
                x2={310 - rightPad}
                y2={y}
                stroke="#DFD8CA"
                strokeWidth={1.1}
                strokeDasharray="4 4"
              />
              <SvgText
                x={leftPad - 8}
                y={y + 4}
                fontSize={11}
                fill="#766D61"
                textAnchor="end"
              >
                {tk}
              </SvgText>
            </React.Fragment>
          );
        })}

        <Path
          d={pathD}
          fill="none"
          stroke="#63BAF7"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((pt, i) => (
          <React.Fragment key={i}>
            <Circle
              cx={pt.x}
              cy={pt.y}
              r={6}
              fill="#63BAF7"
              stroke={INK}
              strokeWidth={2.2}
              onPress={() => setSelected(selected === i ? null : i)}
            />
            <SvgText
              x={pt.x}
              y={pt.y - 11}
              fontSize={12}
              fontWeight="bold"
              fill={INK}
              textAnchor="middle"
            >
              {pt.val}
            </SvgText>
            <SvgText
              x={pt.x}
              y={topPad + chartH + 20}
              fontSize={11}
              fill="#6D6458"
              textAnchor="middle"
            >
              {pt.label.length > 10 ? pt.label.slice(0, 9) + "…" : pt.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>

      {selected !== null && items[selected] ? (
        <View
          style={{
            padding: 12,
            borderRadius: 12,
            backgroundColor: "#F4EFE4",
            gap: 2,
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: "700", color: INK }}>
            {items[selected].label} ({items[selected].value || rawNums[selected]})
          </Text>
          <Text style={detailStyle}>{items[selected].detail}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* 7. Nested Concentric Layers (Ảnh 9) */
function NestedLayers({
  items,
}: {
  items: LessonVisual["items"];
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const layerColors = ["#CBE8FB", "#9FD8DC", "#93B496", "#E6EDCF"];
  const renderIndices = getNestedLayerRenderOrder(items);

  const renderNested = (step: number): React.ReactNode => {
    if (step >= renderIndices.length) return null;
    const actualIdx = renderIndices[step];
    const item = items[actualIdx];
    if (!item) return null;
    const isInnermost = step === renderIndices.length - 1;
    const bg = layerColors[step % layerColors.length];

    return (
      <Pressable
        key={actualIdx}
        onPress={(e) => {
          (e as unknown as { stopPropagation?: () => void })?.stopPropagation?.();
          triggerHaptic("selection");
          playSound("tap");
          setSelected(selected === actualIdx ? null : actualIdx);
        }}
        style={{
          backgroundColor: bg,
          borderWidth: 1.5,
          borderColor: INK,
          borderRadius: 14,
          paddingTop: 11,
          paddingBottom: isInnermost ? 13 : 10,
          paddingHorizontal: 11,
          gap: 9,
        }}
      >
        {isInnermost ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: INK,
              }}
            />
            <Text
              style={{
                fontSize: 13.5,
                fontWeight: "700",
                color: INK,
                textAlign: "center",
              }}
            >
              {item.label}
            </Text>
          </View>
        ) : (
          <Text
            style={{
              fontSize: 13.5,
              fontWeight: "700",
              color: INK,
              textAlign: "center",
            }}
          >
            {item.label}
          </Text>
        )}
        {!isInnermost ? renderNested(step + 1) : null}
      </Pressable>
    );
  };

  return (
    <View style={{ gap: 12 }}>
      {renderNested(0)}

      {selected !== null && items[selected] ? (
        <View
          style={{
            padding: 13,
            borderRadius: 12,
            backgroundColor: "#F4EFE4",
            gap: 3,
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: "700", color: INK }}>
            {items[selected].label}
          </Text>
          <Text style={detailStyle}>{items[selected].detail}</Text>
        </View>
      ) : (
        <View style={{ gap: 6, marginTop: 2 }}>
          {items.map((it, idx) => (
            <Text key={idx} style={{ fontSize: 13, lineHeight: 19, color: "#574F46" }}>
              <Text style={{ fontWeight: "700", color: INK }}>{it.label}: </Text>
              {it.detail}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

/* 8. Branching Decision Flowchart Yes/No (Ảnh 11 & 12) */
function DecisionFlowchart({
  items,
}: {
  items: LessonVisual["items"];
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    triggerHaptic("selection");
    playSound("tap");
    setSelected(idx);
  };

  // Tối thiểu 2 mục (dành cho test cơ bản)
  if (items.length === 2) {
    return (
      <View style={{ alignItems: "center", gap: 6 }}>
        <View
          style={{
            paddingVertical: 11,
            paddingHorizontal: 22,
            borderRadius: 999,
            backgroundColor: "#72C3FA",
            borderWidth: 1.5,
            borderColor: INK,
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: "700", color: INK }}>
            {items[0].label}
          </Text>
        </View>
        <Svg width={24} height={26} viewBox="0 0 24 26">
          <Line x1={12} y1={0} x2={12} y2={20} stroke={INK} strokeWidth={1.6} />
          <Polygon points="12,25 7,18 17,18" fill={INK} />
        </Svg>
        <View
          style={{
            paddingVertical: 11,
            paddingHorizontal: 22,
            borderRadius: 999,
            backgroundColor: "#58B8A5",
            borderWidth: 1.5,
            borderColor: INK,
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: "700", color: INK }}>
            {items[1].label}
          </Text>
        </View>
      </View>
    );
  }

  // Với 3 items: [0]=Câu hỏi?, [1]=Nhánh Không, [2]=Nhánh Có
  // Với 4–5 items (chuẩn Ảnh 11): [0]=Điểm bắt đầu, [1]=Câu hỏi?, [2]=Nhánh Không, [3]=Nhánh Có, [4]=Bước tiếp theo của Nhánh Không
  const hasStartNode = items.length >= 4;
  const startNode = hasStartNode ? items[0] : null;
  const questionNode = hasStartNode ? items[1] : items[0];
  const noNode = hasStartNode ? items[2] : items[1];
  const yesNode = hasStartNode ? items[3] : items[2];
  const followNode = items.length >= 5 ? items[4] : null;

  return (
    <View style={{ alignItems: "center", gap: 0 }}>
      {startNode ? (
        <>
          <Pressable
            onPress={() => handleSelect(0)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 22,
              borderRadius: 999,
              backgroundColor: "#72C3FA",
              borderWidth: 1.5,
              borderColor: INK,
              maxWidth: "82%",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: INK,
                textAlign: "center",
              }}
            >
              {startNode.label}
            </Text>
          </Pressable>
          <Svg width={24} height={28} viewBox="0 0 24 28">
            <Line x1={12} y1={0} x2={12} y2={22} stroke={INK} strokeWidth={1.6} />
            <Polygon points="12,27 7,20 17,20" fill={INK} />
          </Svg>
        </>
      ) : null}

      {/* Hộp câu hỏi màu vàng đất */}
      <Pressable
        onPress={() => handleSelect(hasStartNode ? 1 : 0)}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 9,
          backgroundColor: "#DFB23B",
          borderWidth: 1.5,
          borderColor: INK,
          minWidth: "58%",
          maxWidth: "86%",
        }}
      >
        <Text
          style={{
            fontSize: 13.5,
            fontWeight: "700",
            color: INK,
            textAlign: "center",
          }}
        >
          {questionNode.label}
        </Text>
      </Pressable>

      {/* Nhánh rẽ vuông góc Không / Có */}
      <Svg width="100%" height={52} viewBox="0 0 300 52">
        <Path
          d="M 150 0 V 16 H 75 V 45 M 150 16 H 225 V 45"
          fill="none"
          stroke={INK}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        <Polygon points="75,51 70,43 80,43" fill={INK} />
        <Polygon points="225,51 220,43 230,43" fill={INK} />
        <SvgText
          x={63}
          y={33}
          fontSize={11}
          fontWeight="bold"
          fill={INK}
          textAnchor="end"
        >
          {noNode.value || "Không"}
        </SvgText>
        <SvgText
          x={237}
          y={33}
          fontSize={11}
          fontWeight="bold"
          fill={INK}
          textAnchor="start"
        >
          {yesNode.value || "Có"}
        </SvgText>
      </Svg>

      {/* Hai nhánh Trái (Không) & Phải (Có) */}
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Pressable
            onPress={() => handleSelect(hasStartNode ? 2 : 1)}
            style={{
              width: "100%",
              paddingVertical: 11,
              paddingHorizontal: 10,
              borderRadius: followNode ? 9 : 999,
              backgroundColor: followNode ? "#72C3FA" : "#F0735E",
              borderWidth: 1.5,
              borderColor: INK,
            }}
          >
            <Text
              style={{
                fontSize: 12.5,
                fontWeight: "700",
                color: INK,
                textAlign: "center",
              }}
            >
              {noNode.label}
            </Text>
          </Pressable>

          {followNode ? (
            <>
              <Svg width={24} height={26} viewBox="0 0 24 26">
                <Line
                  x1={12}
                  y1={0}
                  x2={12}
                  y2={20}
                  stroke={INK}
                  strokeWidth={1.6}
                />
                <Polygon points="12,25 7,18 17,18" fill={INK} />
              </Svg>
              <Pressable
                onPress={() => handleSelect(4)}
                style={{
                  width: "100%",
                  paddingVertical: 11,
                  paddingHorizontal: 10,
                  borderRadius: 999,
                  backgroundColor: "#58B8A5",
                  borderWidth: 1.5,
                  borderColor: INK,
                }}
              >
                <Text
                  style={{
                    fontSize: 12.5,
                    fontWeight: "700",
                    color: INK,
                    textAlign: "center",
                  }}
                >
                  {followNode.label}
                </Text>
              </Pressable>
            </>
          ) : null}
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Pressable
            onPress={() => handleSelect(hasStartNode ? 3 : 2)}
            style={{
              width: "100%",
              paddingVertical: 11,
              paddingHorizontal: 10,
              borderRadius: 999,
              backgroundColor: "#58B8A5",
              borderWidth: 1.5,
              borderColor: INK,
            }}
          >
            <Text
              style={{
                fontSize: 12.5,
                fontWeight: "700",
                color: INK,
                textAlign: "center",
              }}
            >
              {yesNode.label}
            </Text>
          </Pressable>
        </View>
      </View>

      {selected !== null && items[selected] ? (
        <View
          style={{
            width: "100%",
            marginTop: 14,
            padding: 13,
            borderRadius: 12,
            backgroundColor: "#F4EFE4",
            gap: 3,
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: "700", color: INK }}>
            {items[selected].label}
          </Text>
          <Text style={detailStyle}>{items[selected].detail}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* 9. Horizontal Alternating Timeline (Ảnh 13) */
function AlternatingTimeline({
  items,
}: {
  items: LessonVisual["items"];
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const boxColors = ["#72C3FA", "#869E45", "#F0735E", "#F39A2D", "#58B8A5"];

  return (
    <View style={{ gap: 12 }}>
      <View style={{ paddingVertical: 6 }}>
        {/* Hàng trên (chỉ số chẵn 0, 2, 4) */}
        <View style={{ flexDirection: "row", alignItems: "flex-end", minHeight: 82 }}>
          {items.map((item, i) => (
            <View key={i} style={{ flex: 1, alignItems: "center", paddingHorizontal: 2 }}>
              {i % 2 === 0 ? (
                <>
                  {item.value ? (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 10.5,
                        fontWeight: "700",
                        color: INK,
                        marginBottom: 4,
                        textAlign: "center",
                      }}
                    >
                      {item.value}
                    </Text>
                  ) : null}
                  <Pressable
                    onPress={() => setSelected(selected === i ? null : i)}
                    style={{
                      width: "100%",
                      paddingVertical: 8,
                      paddingHorizontal: 6,
                      borderRadius: 8,
                      backgroundColor: boxColors[i % boxColors.length],
                      borderWidth: 1.5,
                      borderColor: INK,
                    }}
                  >
                    <Text
                      numberOfLines={3}
                      style={{
                        fontSize: 11.5,
                        lineHeight: 15,
                        fontWeight: "700",
                        color: INK,
                        textAlign: "center",
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                  <View style={{ width: 1.6, height: 12, backgroundColor: INK }} />
                </>
              ) : null}
            </View>
          ))}
        </View>

        {/* Trục ngang xuyên tâm + các chấm màu viền đen */}
        <View style={{ justifyContent: "center", height: 16 }}>
          <View
            style={{
              position: "absolute",
              left: 4,
              right: 4,
              height: 1.8,
              backgroundColor: INK,
            }}
          />
          <View style={{ flexDirection: "row" }}>
            {items.map((_, i) => (
              <View key={i} style={{ flex: 1, alignItems: "center" }}>
                <Pressable
                  onPress={() => setSelected(selected === i ? null : i)}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: boxColors[i % boxColors.length],
                    borderWidth: 1.6,
                    borderColor: INK,
                  }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Hàng dưới (chỉ số lẻ 1, 3) */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", minHeight: 82 }}>
          {items.map((item, i) => (
            <View key={i} style={{ flex: 1, alignItems: "center", paddingHorizontal: 2 }}>
              {i % 2 === 1 ? (
                <>
                  <View style={{ width: 1.6, height: 12, backgroundColor: INK }} />
                  <Pressable
                    onPress={() => setSelected(selected === i ? null : i)}
                    style={{
                      width: "100%",
                      paddingVertical: 8,
                      paddingHorizontal: 6,
                      borderRadius: 8,
                      backgroundColor: boxColors[i % boxColors.length],
                      borderWidth: 1.5,
                      borderColor: INK,
                    }}
                  >
                    <Text
                      numberOfLines={3}
                      style={{
                        fontSize: 11.5,
                        lineHeight: 15,
                        fontWeight: "700",
                        color: INK,
                        textAlign: "center",
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                  {item.value ? (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 10.5,
                        fontWeight: "700",
                        color: INK,
                        marginTop: 4,
                        textAlign: "center",
                      }}
                    >
                      {item.value}
                    </Text>
                  ) : null}
                </>
              ) : null}
            </View>
          ))}
        </View>
      </View>

      {selected !== null && items[selected] ? (
        <View
          style={{
            padding: 13,
            borderRadius: 12,
            backgroundColor: "#F4EFE4",
            gap: 3,
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: "700", color: INK }}>
            {items[selected].value ? `${items[selected].value} · ` : ""}
            {items[selected].label}
          </Text>
          <Text style={detailStyle}>{items[selected].detail}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* 10. Cause & Effect Domino Chain */
function CauseEffectFlow({
  items,
}: {
  items: LessonVisual["items"];
}) {
  return (
    <View style={{ gap: 2 }}>
      {items.map((item, i) => {
        const sw = POP_FILLS[i % POP_FILLS.length];
        return (
          <React.Fragment key={i}>
            <View
              style={{
                padding: 14,
                borderRadius: 11,
                backgroundColor: sw.soft,
                borderWidth: 1.5,
                borderColor: INK,
                gap: 4,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={labelStyle}>{item.label}</Text>
                {item.value ? (
                  <Text style={{ fontSize: 12, fontWeight: "700", color: INK }}>
                    {item.value}
                  </Text>
                ) : null}
              </View>
              <Text style={detailStyle}>{item.detail}</Text>
            </View>
            {i < items.length - 1 && (
              <View style={{ alignItems: "center", height: 24, justifyContent: "center" }}>
                <Svg width={24} height={24} viewBox="0 0 24 24">
                  <Line x1={12} y1={2} x2={12} y2={17} stroke={INK} strokeWidth={1.6} />
                  <Polygon points="12,22 7,15 17,15" fill={INK} />
                </Svg>
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

/* 11. Tapered Funnel */
function FunnelDiagram({
  items,
}: {
  items: LessonVisual["items"];
}) {
  const [selected, setSelected] = useState(0);
  const widths: `${number}%`[] = ["100%", "84%", "68%", "54%", "44%"];

  return (
    <View style={{ gap: 12 }}>
      <View style={{ alignItems: "center", gap: 6 }}>
        {items.map((item, i) => {
          const sw = POP_FILLS[i % POP_FILLS.length];
          const active = selected === i;
          return (
            <Pressable
              key={i}
              onPress={() => setSelected(i)}
              style={{
                width: widths[i] || "50%",
                paddingVertical: 11,
                paddingHorizontal: 14,
                borderRadius: 10,
                backgroundColor: active ? sw.solid : sw.soft,
                borderWidth: 1.5,
                borderColor: INK,
                alignItems: "center",
                gap: 1,
              }}
            >
              {item.value ? (
                <Text style={{ fontSize: 11.5, fontWeight: "700", color: INK }}>
                  {item.value}
                </Text>
              ) : null}
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 13.5,
                  fontWeight: "700",
                  textAlign: "center",
                  color: INK,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {items[selected] ? (
        <View
          style={{
            borderRadius: 12,
            padding: 13,
            backgroundColor: "#F4EFE4",
            gap: 3,
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: "700", color: INK }}>
            {items[selected].label}
          </Text>
          <Text style={detailStyle}>{items[selected].detail}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* 12. Horizontal Spectrum Scale */
function SpectrumScale({
  items,
}: {
  items: LessonVisual["items"];
}) {
  const [selected, setSelected] = useState(0);
  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 2,
        }}
      >
        <Text style={{ fontSize: 11.5, fontWeight: "700", color: "#574F46" }}>
          ← {items[0]?.label}
        </Text>
        <Text style={{ fontSize: 11.5, fontWeight: "700", color: "#574F46" }}>
          {items[items.length - 1]?.label} →
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 6 }}>
        {items.map((item, i) => {
          const sw = POP_FILLS[i % POP_FILLS.length];
          const active = selected === i;
          return (
            <Pressable
              key={i}
              onPress={() => {
                triggerHaptic("selection");
                playSound("tap");
                setSelected(i);
              }}
              style={{
                flex: 1,
                paddingVertical: 11,
                paddingHorizontal: 6,
                borderRadius: 10,
                backgroundColor: active ? sw.solid : sw.soft,
                borderWidth: 1.5,
                borderColor: INK,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontWeight: "700",
                  textAlign: "center",
                  color: INK,
                }}
              >
                {item.value || item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {items[selected] ? (
        <View
          style={{
            borderRadius: 12,
            padding: 13,
            backgroundColor: "#F4EFE4",
            gap: 3,
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: "700", color: INK }}>
            {items[selected].label}
          </Text>
          <Text style={detailStyle}>{items[selected].detail}</Text>
        </View>
      ) : null}
    </View>
  );
}

/* 13. Horizontal Bar Comparison */
function HorizontalBars({
  items,
}: {
  items: LessonVisual["items"];
}) {
  const parsed = items.map((item) => {
    const m = item.value?.match(/(\d+(?:[.,]\d+)?)/);
    return m ? parseFloat(m[1].replace(",", ".")) : NaN;
  });
  const hasNumbers = parsed.every((n) => Number.isFinite(n) && n > 0);
  const maxVal = hasNumbers ? Math.max(...parsed, 1) : 100;
  const fallbackPcts = [100, 74, 52, 36, 24];

  return (
    <View style={{ gap: 13 }}>
      {items.map((item, i) => {
        const sw = POP_FILLS[i % POP_FILLS.length];
        const pct = hasNumbers
          ? Math.max(14, Math.min(100, Math.round((parsed[i] / maxVal) * 100)))
          : fallbackPcts[i % fallbackPcts.length];
        return (
          <View key={i} style={{ gap: 5 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 8,
              }}
            >
              <Text style={[labelStyle, { flex: 1, fontSize: 14.5 }]}>
                {item.label}
              </Text>
              {item.value ? (
                <Text style={{ fontSize: 13.5, fontWeight: "700", color: INK }}>
                  {item.value}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                height: 14,
                borderRadius: 7,
                backgroundColor: "#EFEAE0",
                borderWidth: 1.2,
                borderColor: INK,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  backgroundColor: sw.solid,
                }}
              />
            </View>
            <Text style={[detailStyle, { fontSize: 12.5 }]}>{item.detail}</Text>
          </View>
        );
      })}
    </View>
  );
}

/* 14. Concept Map & 15. Formula */
function VisualContent({ visual }: { visual: LessonVisual }) {
  const p = visualPalette(visual);
  const items = visual.items;

  if (visual.kind === "metrics") return <BentoMetrics items={items} />;
  if (visual.kind === "cycle") return <PillCycle visual={visual} />;
  if (visual.kind === "line-chart") return <TrajectoryLineChart items={items} />;
  if (visual.kind === "layers") return <NestedLayers items={items} />;
  if (visual.kind === "flowchart") return <DecisionFlowchart items={items} />;
  if (visual.kind === "timeline") return <AlternatingTimeline items={items} />;
  if (visual.kind === "cause-effect") return <CauseEffectFlow items={items} />;
  if (visual.kind === "funnel") return <FunnelDiagram items={items} />;
  if (visual.kind === "spectrum") return <SpectrumScale items={items} />;
  if (visual.kind === "bars") return <HorizontalBars items={items} />;

  if (visual.kind === "concept-map") {
    return (
      <View style={{ gap: 0 }}>
        <View
          style={{
            alignSelf: "center",
            maxWidth: "86%",
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 999,
            backgroundColor: POP_FILLS[0].solid,
            borderWidth: 1.5,
            borderColor: INK,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: INK,
              textAlign: "center",
            }}
          >
            {visual.title}
          </Text>
        </View>
        <Svg
          width="100%"
          height={34}
          viewBox="0 0 300 34"
          preserveAspectRatio="none"
        >
          <Path
            d={
              items.length === 2
                ? "M150 0 V15 M75 34 V15 H225 V34"
                : items.length >= 4
                  ? "M150 0 V15 M38 34 V15 H262 V34 M112 15 V34 M188 15 V34"
                  : "M150 0 V15 M50 34 V15 H250 V34 M150 15 V34"
            }
            stroke={INK}
            strokeWidth={1.6}
            fill="none"
          />
        </Svg>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {items.slice(0, 4).map((item, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 6,
                borderRadius: 9,
                backgroundColor: POP_FILLS[(i + 1) % POP_FILLS.length].soft,
                borderWidth: 1.5,
                borderColor: INK,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontWeight: "700",
                  color: INK,
                  textAlign: "center",
                }}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ gap: 8, marginTop: 14 }}>
          {items.map((item, i) => (
            <Text key={i} style={detailStyle}>
              <Text style={{ fontWeight: "700", color: INK }}>
                {item.label}:{" "}
              </Text>
              {item.detail}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  // Formula
  return (
    <View style={{ gap: 14 }}>
      <View
        style={{
          backgroundColor: p.paper,
          borderRadius: 12,
          paddingVertical: 20,
          paddingHorizontal: 14,
          borderWidth: 1.5,
          borderColor: INK,
        }}
      >
        <Text
          selectable
          style={{
            fontSize: 22,
            lineHeight: 32,
            fontWeight: "700",
            color: INK,
            textAlign: "center",
            fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
          }}
        >
          {visual.expression}
        </Text>
      </View>
      <View style={{ gap: 10 }}>
        {items.map((item, i) => (
          <View key={i} style={[ui.row, { alignItems: "flex-start", gap: 10 }]}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: POP_FILLS[i % POP_FILLS.length].soft,
                borderWidth: 1.2,
                borderColor: INK,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 1,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "700", color: INK }}>
                {i + 1}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={labelStyle}>{item.label}</Text>
              <Text style={detailStyle}>{item.detail}</Text>
            </View>
          </View>
        ))}
      </View>
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
  const visual = page.visual ? localizeVisual(page.visual) : undefined;
  if (!visual) return null;

  // Các loại tự có bố cục khung tối giản riêng (Ảnh 5, 7, 8, 10)
  if (visual.kind === "comparison") {
    return (
      <ComparisonCards
        items={visual.items}
        visualTitle={visual.title}
        takeaway={page.takeaway}
      />
    );
  }
  if (visual.kind === "steps") {
    return <StepperCard items={visual.items} visualTitle={visual.title} />;
  }
  if (visual.kind === "callout") {
    return <CalloutBox visual={visual} />;
  }

  return (
    <View
      style={{
        marginVertical: 18,
        borderWidth: 1,
        borderColor: CARD_BORDER,
        borderRadius: 18,
        backgroundColor: CARD_BG,
        padding: 20,
        gap: 16,
      }}
    >
      {/* Header tinh gọn chuẩn editorial: Tiêu đề riêng căn giữa + Bookmark góc phải, KHÔNG gắn nhãn phân loại thừa */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 22,
        }}
      >
        {visual.kind !== "concept-map" ? (
          <Text
            style={{
              fontSize: 15.5,
              lineHeight: 22,
              fontWeight: "700",
              color: INK,
              textAlign: "center",
              paddingHorizontal: 24,
            }}
          >
            {visual.title}
          </Text>
        ) : null}
        <View style={{ position: "absolute", right: 0, top: 2 }}>
          <Icon name="bookmark" size={17} color="rgba(35, 27, 21, 0.35)" />
        </View>
      </View>

      <VisualContent key={JSON.stringify(visual)} visual={visual} />

      {page.takeaway ? (
        <Text
          style={{
            fontSize: 13.5,
            lineHeight: 19.5,
            fontWeight: "600",
            color: "#574F46",
            textAlign: "center",
            marginTop: 2,
          }}
        >
          {page.takeaway}
        </Text>
      ) : null}
    </View>
  );
}
