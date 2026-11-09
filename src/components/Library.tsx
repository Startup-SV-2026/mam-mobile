import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import type { Course, Progress } from "../types/course";
import { filterLibrary } from "../lib/roadmap";
import { CourseArt } from "./CourseArt";
import { Icon } from "./Icon";
import { Action, theme as t, ui } from "./ui";
export function Library({
  courses,
  completed,
  reviews,
  onOpen,
  onSaved,
  onReview,
  onCreate,
}: Pick<Progress, "completed" | "reviews"> & {
  courses: Course[];
  onOpen: (c: Course) => void;
  onSaved: (c: Course) => void;
  onReview: (c: Course) => void;
  onCreate: () => void;
}) {
  const [mode, setMode] = useState<"browse" | "mine">("browse");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [sort, setSort] = useState<"default" | "done" | "total">("default");
  const [expanded, setExpanded] = useState(false);
  const categories = ["Tất cả", ...new Set(courses.map((c) => c.category))];
  const all =
    mode === "mine"
      ? courses.filter(
          (c) =>
            c.source === "ai" ||
            c.lessons.some((_, i) => completed[`${c.id}:${i}`]),
        )
      : courses;
  const items = filterLibrary(all, completed, search, category, status).sort(
    (a, b) =>
      sort === "total"
        ? b.lessons.length - a.lessons.length
        : sort === "done"
          ? b.lessons.filter((_, i) => completed[`${b.id}:${i}`]).length -
            a.lessons.filter((_, i) => completed[`${a.id}:${i}`]).length
          : 0,
  );
  const cycleStatus = () => {
    const values = ["Tất cả", "Chưa học", "Đang học", "Hoàn thành"];
    setStatus(values[(values.indexOf(status) + 1) % values.length]);
  };
  const cover = (c: Course) => (
    <Pressable
      key={c.id}
      accessibilityRole="button"
      accessibilityLabel={`Mở khóa ${c.title}`}
      onPress={() => onOpen(c)}
      style={{
        width: 235,
        height: 183,
        borderWidth: 1,
        borderColor: t.line,
        borderBottomWidth: 4,
        borderRadius: 20,
        backgroundColor: c.color,
        overflow: "hidden",
      }}
    >
      <View style={{ alignItems: "center", height: 110 }}>
        <CourseArt id={c.id} size={160} />
      </View>
      <View style={{ backgroundColor: t.ink, padding: 13, flex: 1 }}>
        <Text
          numberOfLines={2}
          style={{ fontSize: 16, fontWeight: "600", color: t.bg }}
        >
          {c.title}
        </Text>
        <Text style={{ fontSize: 11, color: "#DDD5C7", marginTop: 5 }}>
          {c.lessons.length} bài học · {c.category}
        </Text>
      </View>
    </Pressable>
  );
  return (
    <View style={{ gap: 22 }}>
      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          borderWidth: 1,
          borderColor: t.line,
          borderRadius: 17,
          padding: 4,
          marginTop: 7,
        }}
      >
        {(["browse", "mine"] as const).map((v) => (
          <Pressable
            key={v}
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === v }}
            onPress={() => {
              setMode(v);
              setStatus("Tất cả");
            }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
              backgroundColor: mode === v ? t.ink : "transparent",
              borderRadius: 13,
            }}
          >
            <Text style={{ fontSize: 14, color: mode === v ? t.bg : t.muted }}>
              {v === "browse" ? "Khám phá" : "Của tôi"}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={[ui.row, ui.input, { paddingVertical: 0 }]}>
        <Icon name="search" size={20} color={t.muted} />
        <TextInput
          accessibilityLabel="Tìm khóa học"
          placeholder="Tìm khóa học"
          placeholderTextColor={t.muted}
          value={search}
          onChangeText={setSearch}
          style={{ flex: 1, minHeight: 48, fontSize: 15, color: t.ink }}
        />
      </View>
      {mode === "browse" ? (
        <>
          <View style={ui.row}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setExpanded(!expanded)}
              style={[
                ui.card,
                {
                  flex: 1,
                  padding: 13,
                  backgroundColor: t.soft,
                  borderWidth: 0,
                  borderRadius: 12,
                },
              ]}
            >
              <Text style={ui.body}>
                {category === "Tất cả" ? "Tất cả chủ đề" : category} ⌄
              </Text>
            </Pressable>
            <View
              style={[
                ui.card,
                {
                  padding: 13,
                  backgroundColor: t.soft,
                  borderWidth: 0,
                  borderRadius: 12,
                },
              ]}
            >
              <Text style={ui.body}>Tiếng Việt</Text>
            </View>
          </View>
          {expanded && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {categories.map((c) => (
                <Pressable
                  accessibilityRole="button"
                  key={c}
                  onPress={() => {
                    setCategory(c);
                    setExpanded(false);
                  }}
                  style={{
                    padding: 12,
                    backgroundColor: t.soft,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: t.ink }}>{c}</Text>
                </Pressable>
              ))}
            </View>
          )}
          <View style={[ui.row, { justifyContent: "space-between" }]}>
            <View style={ui.row}>
              <Icon name="sparkle" color="#70ABC0" />
              <Text style={{ fontSize: 22, fontWeight: "600", color: t.ink }}>
                Gợi ý cho bạn
              </Text>
            </View>
            <Text style={[ui.label, { fontSize: 10 }]}>
              {items.length} KHÓA
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 14, paddingBottom: 5 }}
          >
            {items.map(cover)}
          </ScrollView>
          <View style={[ui.row, { marginTop: 12 }]}>
            <Icon name="library" color="#70ABC0" />
            <Text style={{ fontSize: 22, fontWeight: "600", color: t.ink }}>
              Tất cả khóa học
            </Text>
          </View>
          {items.map((c) => (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              onPress={() => onOpen(c)}
              style={[ui.row, { gap: 14 }]}
            >
              <View
                style={{
                  width: 105,
                  height: 80,
                  backgroundColor: c.color,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: t.line,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CourseArt id={c.id} size={110} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: t.ink }}>
                  {c.title}
                </Text>
                <Text style={[ui.body, { fontSize: 12, marginTop: 4 }]}>
                  {c.subtitle}
                </Text>
              </View>
            </Pressable>
          ))}
        </>
      ) : (
        <>
          <Text style={ui.body}>Những hành trình bạn đang nuôi dưỡng.</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lọc trạng thái khóa học"
            onPress={cycleStatus}
            style={[ui.input, ui.row, { justifyContent: "space-between" }]}
          >
            <Text style={ui.body}>Trạng thái: {status}</Text>
            <Icon name="chevron" size={18} />
          </Pressable>
          <View style={ui.row}>
            {(["done", "total"] as const).map((v) => (
              <Pressable
                key={v}
                accessibilityRole="button"
                accessibilityState={{ selected: sort === v }}
                onPress={() => setSort(sort === v ? "default" : v)}
                style={[
                  ui.input,
                  {
                    flex: 1,
                    padding: 12,
                    backgroundColor: sort === v ? t.soft : t.bg,
                  },
                ]}
              >
                <Text style={ui.body}>
                  {v === "done" ? "Đã học ↓" : "Tổng bài ↓"}
                </Text>
              </Pressable>
            ))}
          </View>
          {items.map((c) => {
            const done = c.lessons.filter(
              (_, i) => completed[`${c.id}:${i}`],
            ).length;
            const due = c.lessons.some(
              (_, i) =>
                completed[`${c.id}:${i}`] &&
                (!reviews[`${c.id}:${i}`] ||
                  reviews[`${c.id}:${i}`].due <= Date.now()),
            );
            return (
              <View key={c.id} style={[ui.card, { gap: 17, borderRadius: 12 }]}>
                <Pressable accessibilityRole="button" onPress={() => onOpen(c)}>
                  <Text
                    style={{
                      fontSize: 19,
                      fontWeight: "600",
                      lineHeight: 26,
                      color: t.ink,
                    }}
                  >
                    {c.title} ↗
                  </Text>
                </Pressable>
                <View style={ui.row}>
                  <Text
                    style={{
                      backgroundColor: done ? "#DCE9F6" : t.soft,
                      padding: 7,
                      borderRadius: 5,
                      color: done ? "#376F9D" : t.muted,
                      fontSize: 12,
                    }}
                  >
                    {done === c.lessons.length
                      ? "Hoàn thành"
                      : done
                        ? "Đang học"
                        : "Chưa học"}
                  </Text>
                  <Text style={ui.body}>
                    {done}/{c.lessons.length} bài
                  </Text>
                </View>
                <View style={[ui.row, { gap: 8 }]}>
                  <Action
                    secondary
                    style={{ flex: 1 }}
                    onPress={() => onSaved(c)}
                  >
                    ĐÃ LƯU
                  </Action>
                  <Action
                    secondary
                    style={{ flex: 1 }}
                    disabled={!due}
                    onPress={() => onReview(c)}
                  >
                    {due ? "ÔN TẬP" : "CHƯA ĐẾN HẠN"}
                  </Action>
                </View>
              </View>
            );
          })}
        </>
      )}
      {!items.length && (
        <View style={[ui.card, { gap: 12 }]}>
          <Text style={{ fontSize: 18, color: t.ink }}>
            Chưa có khóa học phù hợp
          </Text>
          <Text style={ui.body}>
            Thử một bộ lọc khác hoặc bắt đầu một hành trình mới.
          </Text>
        </View>
      )}
      <Action secondary icon="sparkle" onPress={onCreate}>
        TẠO KHÓA HỌC CỦA BẠN
      </Action>
    </View>
  );
}
