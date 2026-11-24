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
import { CourseArt } from "./CourseArt";
import { Icon } from "./Icon";
import { theme as t, ui } from "./ui";
import { totalLessons } from "../lib/curriculum";
import { ArtChip, Scrim, SectionHeader } from "./MamKit";

export function MamLibrary({
  courses,
  completed,
  onOpen,
  onCreate,
}: Pick<Progress, "completed"> & {
  courses: Course[];
  onOpen: (c: Course) => void;
  onCreate: () => void;
}) {
  const [tab, setTab] = useState<"browse" | "mine">("browse");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");

  const categories = ["Tất cả", ...new Set(courses.map((c) => c.category))];

  const filtered = courses.filter((c) => {
    if (tab === "mine") {
      const hasProgress =
        c.source === "ai" || c.lessons.some((_, i) => completed[`${c.id}:${i}`]);
      if (!hasProgress) return false;
    }
    if (category !== "Tất cả" && c.category !== category) return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(query) ||
        c.subtitle?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const trendingCourses = filtered;
  const newCourses = [...filtered].reverse().slice(0, 4);

  return (
    <View style={styles.container}>
      {/* 1. Pill Segmented Toggle: Khám phá / Khóa của tôi */}
      <View style={styles.toggleContainer}>
        <View style={styles.pillToggle}>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === "browse" }}
            onPress={() => setTab("browse")}
            style={[styles.toggleBtn, tab === "browse" && styles.toggleBtnActive]}
          >
            <Text
              style={[
                styles.toggleText,
                tab === "browse" && styles.toggleTextActive,
              ]}
            >
              Khám phá
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === "mine" }}
            onPress={() => setTab("mine")}
            style={[styles.toggleBtn, tab === "mine" && styles.toggleBtnActive]}
          >
            <Text
              style={[
                styles.toggleText,
                tab === "mine" && styles.toggleTextActive,
              ]}
            >
              Khóa của tôi
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 2. Minimalist Search Input */}
      <View style={styles.searchBar}>
        <Icon name="search" size={19} color={t.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm khóa học"
          placeholderTextColor={t.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Icon name="close" size={16} color={t.muted} />
          </Pressable>
        )}
      </View>

      {/* 3. Wondering Dropdown Pill Filter Buttons */}
      <View style={styles.filterRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            const nextIdx = (categories.indexOf(category) + 1) % categories.length;
            setCategory(categories[nextIdx]);
          }}
          style={styles.filterPill}
        >
          <Text numberOfLines={1} style={styles.filterPillText}>
            {category === "Tất cả" ? "Tất cả danh mục" : category}
          </Text>
          <Text style={styles.dropdownChevron}>⌄</Text>
        </Pressable>

        <View style={styles.filterPill}>
          <Text style={styles.filterPillText}>Tất cả ngôn ngữ</Text>
          <Text style={styles.dropdownChevron}>⌄</Text>
        </View>
      </View>
      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Icon name="library" size={28} color={t.primary} />
          <Text style={{ fontSize: 18, fontWeight: "600", color: t.ink }}>Chưa có khóa học phù hợp</Text>
          <Text style={{ color: t.muted, textAlign: "center", lineHeight: 22 }}>Thử chủ đề khác hoặc tạo khóa học của bạn.</Text>
          <Pressable accessibilityRole="button" onPress={onCreate} style={styles.categoryChipActive}>
            <Text style={{ color: t.onPrimary, padding: 14, fontWeight: "600" }}>Tạo khóa học</Text>
          </Pressable>
        </View>
      )}
      {/* 4. Thịnh hành */}
      <View style={{ marginTop: 10 }}>
        <SectionHeader
          icon="trend"
          title={tab === "mine" ? "Khóa của tôi" : "Khám phá khóa học"}
          chip={`${filtered.length} khóa`}

        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalCardsScroll}
      >
        {trendingCourses.map((c, idx) => (
          <ArtCard
            key={c.id}
            course={c}
            chip={<ArtChip label={c.category} />}
            onPress={() => onOpen(c)}
          />
        ))}
      </ScrollView>

      {tab === "browse" && filtered.length > 4 && <>
      {/* More courses */}
      <View style={{ marginTop: 14 }}>
        <SectionHeader
          icon="sparkle"
          title="Chủ đề khác"


        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalCardsScroll}
      >
        {newCourses.map((c, idx) => (
          <ArtCard
            key={c.id}
            course={c}
            chip={<ArtChip label={c.category} />}
            onPress={() => onOpen(c)}
          />
        ))}
      </ScrollView>

      </>}
      <View style={{ height: 100 }} />
    </View>
  );
}

function ArtCard({
  course: c,
  chip,
  onPress,
}: {
  course: Course;
  chip: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={c.title}
      onPress={onPress}
      style={({ pressed }) => [styles.artCard, pressed && { opacity: 0.92 }]}
    >
      <CourseArt id={c.id} title={c.title} category={c.category} />
      <Scrim />
      <View style={styles.artCardTop}>
        {chip}

      </View>
      <View style={styles.artCardBottom}>
        <Text numberOfLines={2} style={styles.cardTitleWhite}>
          {c.title}
        </Text>
        <Text style={styles.cardLessonsSub}>{totalLessons(c)} bài học</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  categoryChip: { borderRadius: 20, borderWidth: 1, borderColor: t.line, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: t.surface },
  categoryChipActive: { backgroundColor: t.deep, borderColor: t.deep, borderRadius: 20 },
  emptyState: { alignItems: "center", gap: 14, padding: 28, borderRadius: 24, backgroundColor: t.soft },
  container: {
    gap: 16,
    paddingTop: 4,
  },
  toggleContainer: {
    alignItems: "center",
    marginVertical: 4,
  },
  pillToggle: {
    flexDirection: "row",
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.line,
    borderRadius: 18,
    padding: 4,
    width: "75%",
    maxWidth: 280,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 14,
  },
  toggleBtnActive: {
    backgroundColor: t.deep,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: t.muted,
  },
  toggleTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.line,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: t.ink,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
  },
  filterPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: t.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: t.line,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: "500",
    color: t.ink,
    flexShrink: 1,
  },
  dropdownChevron: {
    fontSize: 13,
    color: t.muted,
    marginLeft: 6,
  },
  horizontalCardsScroll: {
    gap: 14,
    paddingVertical: 4,
    paddingRight: 4,
  },
  artCard: {
    width: 272,
    height: 182,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: t.soft,
    borderWidth: 1,
    borderColor: t.line,
  },
  artCardTop: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardMoreBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(15,31,20,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  artCardBottom: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
  },
  cardTitleWhite: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 21,
  },
  cardLessonsSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
  },
});
