import { totalLessons } from "../lib/curriculum";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Course, Progress } from "../types/course";
import { filterLibrary } from "../lib/roadmap";
import { CourseArt } from "./CourseArt";
import { Icon } from "./Icon";
import { Action, Sprout, theme as t, ui } from "./ui";

const CATEGORY_ICONS: Record<string, string> = {
  "Tất cả": "🌿",
  "Lịch sử": "⚔️",
  "Ngôn ngữ": "🎓",
  "Khoa học": "🪐",
  "Tâm lý": "🧠",
  "Công nghệ": "🤖",
  "Đời sống": "💰",
};

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
        ? totalLessons(b) - totalLessons(a)
        : sort === "done"
          ? b.lessons.filter((_, i) => completed[`${b.id}:${i}`]).length -
            a.lessons.filter((_, i) => completed[`${a.id}:${i}`]).length
          : 0,
  );

  const cycleStatus = () => {
    const values = ["Tất cả", "Chưa học", "Đang học", "Hoàn thành"];
    setStatus(values[(values.indexOf(status) + 1) % values.length]);
  };

  return (
    <View style={{ gap: 20 }}>
      {/* 1. CHUYỂN ĐỔI CHẾ ĐỘ THANH LỊCH (EDITORIAL TABS) */}
      <View style={s.tabBar}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === "browse" }}
          onPress={() => {
            setMode("browse");
            setStatus("Tất cả");
          }}
          style={[s.tabItem, mode === "browse" && s.tabItemActive]}
        >
          <Text style={[s.tabText, mode === "browse" && s.tabTextActive]}>
            Khám phá
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === "mine" }}
          onPress={() => {
            setMode("mine");
            setStatus("Tất cả");
          }}
          style={[s.tabItem, mode === "mine" && s.tabItemActive]}
        >
          <Text style={[s.tabText, mode === "mine" && s.tabTextActive]}>
            Khóa của tôi
          </Text>
        </Pressable>
      </View>

      {/* 2. THANH TÌM KIẾM MẢNH DẺ */}
      <View style={s.searchBox}>
        <Icon name="search" size={18} color={t.muted} />
        <TextInput
          selectionColor={t.accent}
          keyboardAppearance="light"
          accessibilityLabel="Tìm kiếm khóa học"
          placeholder="Tìm khóa học"
          placeholderTextColor={t.muted}
          value={search}
          onChangeText={setSearch}
          style={s.searchInput}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")} style={{ padding: 4 }}>
            <Icon name="close" size={16} color={t.muted} />
          </Pressable>
        )}
      </View>

      {mode === "browse" ? (
        <>
          {/* 3. DẢI CHỦ ĐỀ CUỘN NGANG (TOPIC PILLS) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.categoryRow}
          >
            {categories.map((cat) => {
              const isSelected = category === cat;
              const icon = CATEGORY_ICONS[cat] || "🌱";
              return (
                <Pressable
                  key={cat}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setCategory(cat)}
                  style={[s.catPill, isSelected && s.catPillActive]}
                >
                  <Text style={[s.catText, isSelected && s.catTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* 4. KHÓA HỌC NỔI BẬT: BÌA SÁCH NGHỆ THUẬT (FEATURED BOOK COVERS) */}
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Gợi ý khóa học</Text>
            <Text style={s.sectionCount}>{items.length} KHÓA HỌC</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.featuredScroll}
          >
            {items.map((c) => {
              const doneCount = c.lessons.filter(
                (_, i) => completed[`${c.id}:${i}`],
              ).length;
              return (
                <Pressable
                  key={c.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Khóa ${c.title}`}
                  onPress={() => onOpen(c)}
                  style={s.featuredCard}
                >
                  {/* Tranh minh họa nghệ thuật chiếm nửa trên */}
                  <View
                    style={[
                      s.artCanvas,
                      { backgroundColor: c.color || "#F4F1EA" },
                    ]}
                  >
                    <CourseArt
                      id={c.id}
                      title={c.title}
                      category={c.category}
                      size={180}
                    />
                  </View>

                  {/* Thông tin thanh nhã ở nửa dưới */}
                  <View style={s.featuredContent}>
                    <Text numberOfLines={2} style={s.featuredTitle}>
                      {c.title}
                    </Text>
                    <Text numberOfLines={2} style={s.listSubtitle}>
                      {c.subtitle}
                    </Text>
                    <View style={s.featuredMetaRow}>
                      <Text style={s.featuredCategory}>{c.category}</Text>
                      <Text style={s.featuredMetaDot}>•</Text>
                      <Text style={s.featuredLessons}>
                        {doneCount > 0
                          ? `Đã học ${doneCount}/${totalLessons(c)}`
                          : `${totalLessons(c)} bài học`}
                      </Text>
                    </View>
                    <View
                      style={{
                        height: 3,
                        borderRadius: 3,
                        backgroundColor: t.line,
                        overflow: "hidden",
                        marginTop: 5,
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: `${(doneCount / totalLessons(c)) * 100}%`,
                          backgroundColor: t.primary,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: t.accent,
                        marginTop: 4,
                      }}
                    >
                      {doneCount ? "Tiếp tục học" : "Xem khóa học"} ↗
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* 5. TẤT CẢ KHÓA HỌC: BẢN IN NGHỆ THUẬT (CURATED LIST) */}
          <View style={[s.sectionHeader, { marginTop: 10 }]}>
            <Text style={s.sectionTitle}>Tất cả khóa học</Text>
          </View>

          <View style={{ gap: 12 }}>
            {items.map((c) => {
              const doneCount = c.lessons.filter(
                (_, i) => completed[`${c.id}:${i}`],
              ).length;

              return (
                <Pressable
                  key={c.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Khóa ${c.title}`}
                  onPress={() => onOpen(c)}
                  style={s.listItem}
                >
                  {/* Bìa tranh nghệ thuật thu nhỏ */}
                  <View
                    style={[
                      s.listCover,
                      { backgroundColor: c.color || "#F4F1EA" },
                    ]}
                  >
                    <CourseArt
                      id={c.id}
                      title={c.title}
                      category={c.category}
                      size={88}
                    />
                  </View>

                  {/* Nội dung sách tao nhã */}
                  <View style={s.listContent}>
                    <Text numberOfLines={2} style={s.listTitle}>
                      {c.title}
                    </Text>
                    <Text numberOfLines={2} style={s.listSubtitle}>
                      {c.subtitle}
                    </Text>
                    <View style={s.listMetaRow}>
                      <Text style={s.listCategory}>{c.category}</Text>
                      <Text style={s.featuredMetaDot}>•</Text>
                      <Text style={s.listLessons}>
                        {doneCount > 0
                          ? `Đã xong ${doneCount}/${totalLessons(c)} bài`
                          : `${totalLessons(c)} bài học · ${c.level}`}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : (
        /* My courses */
        <>
          <Text style={ui.body}>Các khóa học đã tạo hoặc đã bắt đầu.</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lọc trạng thái khóa học"
            onPress={cycleStatus}
            style={s.statusButton}
          >
            <Text style={ui.body}>
              Trạng thái:{" "}
              <Text style={{ fontWeight: "700", color: t.ink }}>{status}</Text>
            </Text>
            <Icon name="chevron" size={18} color={t.muted} />
          </Pressable>

          <View style={ui.row}>
            {(["done", "total"] as const).map((v) => (
              <Pressable
                key={v}
                accessibilityRole="button"
                accessibilityState={{ selected: sort === v }}
                onPress={() => setSort(sort === v ? "default" : v)}
                style={[s.sortButton, sort === v && s.sortButtonActive]}
              >
                <Text
                  style={[
                    s.sortButtonText,
                    sort === v && s.sortButtonTextActive,
                  ]}
                >
                  {v === "done" ? "Đã học nhiều nhất ↓" : "Số bài học ↓"}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={{ gap: 12 }}>
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
                <View key={c.id} style={s.mineCard}>
                  <View style={[ui.row, { gap: 12 }]}>
                    <View
                      style={[
                        s.mineCover,
                        { backgroundColor: c.color || "#F4F1EA" },
                      ]}
                    >
                      <CourseArt
                        id={c.id}
                        title={c.title}
                        category={c.category}
                        size={76}
                      />
                    </View>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => onOpen(c)}
                      >
                        <Text style={s.mineTitle}>{c.title} ↗</Text>
                      </Pressable>
                      <Text style={s.mineMeta}>
                        Tiến độ: {done}/{totalLessons(c)} bài hoàn thành
                      </Text>
                    </View>
                  </View>

                  <View style={[ui.row, { gap: 10, marginTop: 4 }]}>
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
          </View>
        </>
      )}

      {!items.length && (
        <View style={s.emptyBox}>
          <Sprout size={48} />
          <Text style={s.emptyTitle}>Chưa có khóa học phù hợp</Text>
          <Text style={[ui.body, { textAlign: "center" }]}>
            Thử từ khóa hoặc bộ lọc khác.
          </Text>
        </View>
      )}

      {/* NÚT TẠO KHÓA HỌC DƯỚI ĐÁY */}
      <Action secondary icon="sparkle" onPress={onCreate}>
        Tạo khóa học
      </Action>
    </View>
  );
}

const s = StyleSheet.create({
  // 1. Chuyển đổi Khám phá / Khóa của tôi (Editorial Style)
  tabBar: {
    flexDirection: "row",
    backgroundColor: t.soft,
    borderRadius: 16,
    padding: 3,
    borderWidth: 1,
    borderColor: t.line,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  tabItemActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: t.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 5,
    elevation: 0,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: t.muted,
  },
  tabTextActive: {
    color: t.ink,
    fontWeight: "700",
  },

  // 2. Thanh tìm kiếm
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: t.line,
    borderRadius: 16,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    fontSize: 14,
    color: t.ink,
  },

  // 3. Cuộn chủ đề
  categoryRow: {
    gap: 8,
    paddingVertical: 2,
  },
  catPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: t.line,
    borderRadius: 14,
  },
  catPillActive: {
    backgroundColor: t.selected,
    borderColor: t.primary,
  },
  catText: {
    fontSize: 12,
    fontWeight: "600",
    color: t.muted,
  },
  catTextActive: {
    color: t.accent,
    fontWeight: "700",
  },

  // 4. Tiêu đề mục
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: t.ink,
  },
  sectionCount: {
    fontSize: 10,
    fontWeight: "700",
    color: t.muted,
    letterSpacing: 0.4,
  },

  // 5. Thẻ bìa sách nghệ thuật nổi bật (Featured Book Covers)
  featuredScroll: {
    gap: 14,
    paddingBottom: 4,
  },
  featuredCard: {
    width: 250,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: t.line,
    overflow: "hidden",
    shadowColor: t.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0,
    shadowRadius: 8,
  },
  artCanvas: {
    height: 166,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: t.line,
  },
  featuredContent: {
    padding: 16,
    gap: 8,
  },
  featuredTitle: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "700",
    color: t.ink,
  },
  featuredMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featuredCategory: {
    fontSize: 11,
    fontWeight: "600",
    color: t.accent,
  },
  featuredMetaDot: {
    color: t.line,
    fontSize: 10,
  },
  featuredLessons: {
    fontSize: 11,
    color: t.muted,
  },

  // 6. Danh sách thẻ sách thanh thoát (Curated List)
  listItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: t.line,
    borderRadius: 18,
    padding: 12,
    gap: 14,
    alignItems: "center",
    shadowColor: t.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 6,
  },
  listCover: {
    width: 82,
    height: 72,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: t.line,
    overflow: "hidden",
  },
  listContent: {
    flex: 1,
    gap: 4,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: t.ink,
  },
  listSubtitle: {
    fontSize: 12,
    color: t.muted,
    lineHeight: 17,
  },
  listMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  listCategory: {
    fontSize: 11,
    fontWeight: "600",
    color: t.accent,
  },
  listLessons: {
    fontSize: 11,
    color: t.muted,
  },

  // Tab Khóa của tôi
  statusButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: t.line,
    borderRadius: 14,
    padding: 12,
  },
  sortButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: t.line,
    borderRadius: 12,
    alignItems: "center",
  },
  sortButtonActive: {
    backgroundColor: t.selected,
    borderColor: t.primary,
  },
  sortButtonText: {
    fontSize: 12,
    color: t.muted,
    fontWeight: "600",
  },
  sortButtonTextActive: {
    color: t.accent,
    fontWeight: "700",
  },
  mineCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: t.line,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  mineCover: {
    width: 68,
    height: 58,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: t.line,
    overflow: "hidden",
  },
  mineTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: t.ink,
    lineHeight: 20,
  },
  mineMeta: {
    fontSize: 12,
    color: t.muted,
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: t.line,
    padding: 24,
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: t.ink,
  },
});
