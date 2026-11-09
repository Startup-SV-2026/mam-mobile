import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Course, Screen, Progress, ReviewCard } from "./src/types/course";
import { isCourseContent, readProgress } from "./src/types/course";
import {
  dayKey,
  previousDay,
  scheduleReview,
  currentStreak,
} from "./src/lib/learning";
import { STARTER_COURSES } from "./data/courses";
import { Icon, type IconName } from "./src/components/Icon";
import {
  Action,
  IconButton,
  Sprout,
  theme as t,
  ui,
} from "./src/components/ui";
import { Roadmap } from "./src/components/Roadmap";
import { Library } from "./src/components/Library";
import { LessonFigure } from "./src/components/LessonFigure";
import { CourseArt } from "./src/components/CourseArt";
import { Tutor } from "./src/components/Tutor";
import { Review } from "./src/components/Review";
const STORE_KEY = "mam-viet-learning-v1";
const dateKey = dayKey;
const tabs: { screen: Screen; icon: IconName; label: string }[] = [
  { screen: "home", icon: "home", label: "Lộ trình" },
  { screen: "create", icon: "sparkle", label: "Tạo khóa" },
  { screen: "review", icon: "review", label: "Ôn tập" },
  { screen: "explore", icon: "library", label: "Thư viện" },
  { screen: "profile", icon: "profile", label: "Cá nhân" },
];
export default function App() {
  const { width, height } = useWindowDimensions();
  const desktop = Platform.OS === "web" && width >= 900;
  const [screen, setScreen] = useState<Screen>("home");
  const [courseId, setCourseId] = useState("space");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [completed, setCompleted] = useState<Progress["completed"]>({});
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastStudy, setLastStudy] = useState("");
  const [customCourses, setCustomCourses] = useState<Course[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("Người mới");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [reviews, setReviews] = useState<Record<string, ReviewCard>>({});
  const [tutorOpen, setTutorOpen] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [saved, setSaved] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [notesOpen, setNotesOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [savedCourse, setSavedCourse] = useState<string | null>(null);
  const [reviewCourse, setReviewCourse] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const courses = useMemo(
    () => [...customCourses, ...STARTER_COURSES],
    [customCourses],
  );
  const course =
    courses.find((item) => item.id === courseId) || STARTER_COURSES[0];
  const activeLesson = course.lessons[lessonIndex] || course.lessons[0];
  const doneCount = Object.values(completed).filter(Boolean).length;
  const go = (next: Screen) => {
    setSelectedLesson(null);
    setNotesOpen(false);
    Keyboard.dismiss();
    setTutorOpen(false);
    setScreen(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };
  const openCourse = (c: Course) => {
    setCourseId(c.id);
    setLessonIndex(0);
    setPageIndex(0);
    go("home");
  };
  const startLesson = (index: number) => {
    setSelectedLesson(null);
    setLessonIndex(index);
    setPageIndex(0);
    setAnswer(null);
    setChecked(false);
    go("lesson");
  };
  const isCorrect = answer === activeLesson.quiz.answer;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORE_KEY);
        if (raw && mounted) {
          const p = readProgress(JSON.parse(raw));
          setReviews(p.reviews);
          setSaved(p.saved);
          setNotes(p.notes);
          setCourseId(p.selectedCourseId);
          setCompleted(p.completed || {});
          setXp(p.xp || 0);
          setStreak(p.streak || 0);
          setLastStudy(p.lastStudy || "");
          setCustomCourses(
            Array.isArray(p.customCourses) ? p.customCourses : [],
          );
        }
      } catch (e) {
        console.warn(
          "Could not load local progress:",
          e instanceof Error ? e.message : String(e),
        );
      } finally {
        if (mounted) setHydrated(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(
      STORE_KEY,
      JSON.stringify({
        completed,
        xp,
        streak,
        lastStudy,
        customCourses,
        reviews,
        saved,
        notes,
        selectedCourseId: courseId,
      }),
    ).catch((e) => console.warn("Could not save local progress:", e.message));
  }, [
    hydrated,
    completed,
    xp,
    streak,
    lastStudy,
    customCourses,
    reviews,
    saved,
    notes,
    courseId,
  ]);

  const finish = () => {
    const key = `${course.id}:${lessonIndex}`;
    setEarnedXp(completed[key] ? 0 : 25);
    setReviews((old) => ({
      ...old,
      [key]: old[key] ?? scheduleReview(undefined, true),
    }));
    if (!completed[key]) {
      setCompleted((old) => ({ ...old, [key]: true }));
      setXp((old) => old + 25);
    }
    if (lastStudy !== dateKey()) {
      setStreak((old) => (lastStudy === previousDay() ? old + 1 : 1));
      setLastStudy(dateKey());
    }
    go("done");
  };

  const createCourse = async () => {
    setCreateError("");
    const clean = topic.trim();
    if (clean.length < 3) {
      setCreateError("Hãy nhập một chủ đề dài ít nhất 3 ký tự nhé.");
      return;
    }
    // Curated matches are available without any API key.
    const found = STARTER_COURSES.find(
      (c) =>
        c.title
          .toLocaleLowerCase("vi")
          .includes(clean.toLocaleLowerCase("vi")) ||
        clean.toLocaleLowerCase("vi").includes(c.title.toLocaleLowerCase("vi")),
    );
    if (found) {
      openCourse(found);
      return;
    }
    const url = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
    if (!url) {
      setCreateError(
        "Chưa kết nối máy chủ AI. Bạn có thể học 5 khóa mẫu ngay, hoặc xem README để bật tính năng tạo khóa học bất kỳ.",
      );
      return;
    }
    setCreating(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 55000);
      let response;
      try {
        response = await fetch(`${url}/api/course`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: clean, goal: goal.trim(), level }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Máy chủ chưa sẵn sàng.");
      if (!isCourseContent(body.course))
        throw new Error("Dữ liệu từ AI chưa hợp lệ.");
      const newCourse: Course = {
        ...body.course,
        id: `ai-${Date.now()}`,
        source: "ai",
        category: "Cá nhân hoá",
        color: "#E8E1FF",
        accent: "#6851A9",
        emoji: "✨",
        level,
      };
      setCustomCourses((old) => [newCourse, ...old]);
      setTopic("");
      setGoal("");
      openCourse(newCourse);
    } catch (e) {
      setCreateError(
        e instanceof Error
          ? e.name === "AbortError"
            ? "Hết thời gian chờ AI. Hãy thử lại."
            : e.message
          : "Không thể tạo khóa học.",
      );
    } finally {
      setCreating(false);
    }
  };

  if (!hydrated)
    return (
      <View style={s.loading}>
        <ActivityIndicator color={t.ink} />
        <Text style={ui.body}>Mầm đang thức giấc...</Text>
      </View>
    );
  const reading = screen === "lesson" || screen === "quiz";
  const nav = !reading && screen !== "done" && screen !== "saved";
  const page = activeLesson.pages[pageIndex] ?? activeLesson.pages[0];
  const pageKey = `${course.id}:${lessonIndex}:${pageIndex}`;
  const noteKey = reading ? `${course.id}:${lessonIndex}` : course.id;
  const toggleSaved = (key: string) =>
    setSaved((old) =>
      old.includes(key) ? old.filter((v) => v !== key) : [...old, key],
    );
  const showSaved = (c: Course) => {
    setSavedCourse(c.id);
    go("saved");
  };
  const title =
    screen === "explore"
      ? "Thư viện"
      : screen === "create"
        ? ""
        : screen === "review"
          ? "Ôn tập"
          : screen === "profile"
            ? "Góc của bạn"
            : screen === "stats"
              ? "Tiến độ"
              : screen === "saved"
                ? "Thẻ đã lưu"
                : "";
  const savedPages = courses
    .filter((c) => !savedCourse || c.id === savedCourse)
    .flatMap((c) =>
      c.lessons.flatMap((l, i) =>
        l.pages.map((p, j) => ({
          course: c,
          lesson: i,
          page: j,
          content: p,
          key: `${c.id}:${i}:${j}`,
        })),
      ),
    )
    .filter((p) => saved.includes(p.key));
  const activeTab =
    screen === "course" ? "home" : screen === "stats" ? "profile" : screen;
  return (
    <View style={s.outer}>
      <StatusBar barStyle="dark-content" backgroundColor={t.bg} />
      {desktop && (
        <View style={s.desktopCopy}>
          <Sprout size={60} />
          <Text style={s.desktopBrand}>mầm.</Text>
          <Text style={s.desktopTitle}>Cứ tò mò.{"\n"}Rồi sẽ hiểu.</Text>
          <Text style={[ui.body, { marginTop: 20, maxWidth: 280 }]}>
            Một lộ trình nhỏ cho những điều bạn muốn biết. Mỗi ngày, gieo thêm
            một chút.
          </Text>
          <View style={[ui.row, { marginTop: 30 }]}>
            <View style={s.dot} />
            <Text style={ui.label}>HỌC THEO NHỊP CỦA BẠN</Text>
          </View>
        </View>
      )}
      <SafeAreaView
        style={[
          s.phone,
          desktop && {
            width: 420,
            minWidth: 420,
            height: Math.min(900, height - 32),
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: "auto",
            borderWidth: 7,
            borderColor: t.ink,
            borderRadius: 42,
          },
        ]}
      >
        {desktop && (
          <View style={s.status}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: t.ink }}>
              9:41
            </Text>
            <View style={s.island} />
            <Text style={{ fontSize: 11, color: t.ink }}>▴ ◉ ▰</Text>
          </View>
        )}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {reading ? (
            <View style={s.readerHeader}>
              <IconButton
                name="close"
                label="Đóng bài học"
                onPress={() => go("home")}
              />
              <View style={s.track}>
                <View
                  style={[
                    s.fill,
                    {
                      width: `${screen === "quiz" ? 100 : ((pageIndex + 1) / activeLesson.pages.length) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={{ color: t.ink, fontSize: 13 }}>
                {screen === "quiz"
                  ? "?"
                  : `${pageIndex + 1}/${activeLesson.pages.length}`}
              </Text>
              <IconButton
                name="notes"
                label="Ghi chú bài học"
                onPress={() => setNotesOpen(true)}
              />
              <IconButton
                name="bookmark"
                label={saved.includes(pageKey) ? "Bỏ lưu thẻ" : "Lưu thẻ"}
                selected={saved.includes(pageKey)}
                onPress={() => toggleSaved(pageKey)}
              />
            </View>
          ) : (
            screen !== "done" && (
              <View style={s.header}>
                <View style={{ flex: 1 }}>
                  {title ? (
                    <Text
                      style={{ fontSize: 26, fontWeight: "700", color: t.ink }}
                    >
                      {title}
                    </Text>
                  ) : screen === "create" ? (
                    <Text style={s.wordmark}>mầm.</Text>
                  ) : (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Mở thư viện"
                      onPress={() => go("explore")}
                    >
                      <Icon name="library" color="#716B5E" />
                    </Pressable>
                  )}
                </View>
                <View style={[ui.row, { gap: 13 }]}>
                  <View style={[ui.row, { gap: 4 }]}>
                    <Icon name="flame" color={t.muted} size={20} />
                    <Text style={ui.body}>
                      {currentStreak(streak, lastStudy)}
                    </Text>
                  </View>
                  <View style={[ui.row, { gap: 4 }]}>
                    <Icon name="star" color={t.muted} size={20} />
                    <Text style={ui.body}>{xp}</Text>
                  </View>
                </View>
              </View>
            )
          )}
          <ScrollView
            key={screen}
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={[
              s.content,
              { paddingBottom: nav ? 115 : reading ? 150 : 32 },
              screen === "done" && { flexGrow: 1 },
            ]}
          >
            {(screen === "home" || screen === "course") && (
              <Roadmap
                course={course}
                completed={completed}
                onLibrary={() => go("explore")}
                onSelect={setSelectedLesson}
                onNotes={() => setNotesOpen(true)}
                onExplore={() => go("create")}
                onReview={() => {
                  setReviewCourse(course.id);
                  go("review");
                }}
              />
            )}
            {screen === "explore" && (
              <Library
                courses={courses}
                completed={completed}
                reviews={reviews}
                onOpen={openCourse}
                onSaved={showSaved}
                onReview={(c) => {
                  setReviewCourse(c.id);
                  go("review");
                }}
                onCreate={() => go("create")}
              />
            )}
            {screen === "create" && (
              <>
                <View
                  style={{
                    paddingTop: 28,
                    paddingBottom: 30,
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <Text
                    style={[ui.title, { textAlign: "center", fontSize: 27 }]}
                  >
                    Bạn muốn học điều gì?
                  </Text>
                  <Text
                    style={[ui.body, { textAlign: "center", maxWidth: 300 }]}
                  >
                    Kể Mầm nghe điều bạn tò mò. Mình sẽ tạo một lộ trình dành
                    riêng cho bạn.
                  </Text>
                </View>
                <View style={{ gap: 23, marginBottom: 27 }}>
                  {STARTER_COURSES.slice(0, 4).map((c) => (
                    <Pressable
                      accessibilityRole="button"
                      key={c.id}
                      onPress={() => openCourse(c)}
                      style={ui.row}
                    >
                      <View
                        style={[
                          s.recommendationCover,
                          { backgroundColor: c.color },
                        ]}
                      >
                        <CourseArt id={c.id} size={110} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: "600",
                            lineHeight: 24,
                            color: t.ink,
                          }}
                        >
                          {c.title}
                        </Text>
                        <Text style={[ui.body, { fontSize: 12, marginTop: 4 }]}>
                          {c.subtitle}
                        </Text>
                        <Text
                          style={[ui.label, { fontSize: 10, marginTop: 6 }]}
                        >
                          {c.category.toUpperCase()}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
                <View
                  style={[
                    ui.card,
                    { padding: 17, gap: 15, borderBottomWidth: 3 },
                  ]}
                >
                  <TextInput
                    accessibilityLabel="Chủ đề muốn học"
                    placeholder="Mình muốn tìm hiểu về..."
                    placeholderTextColor={t.muted}
                    multiline
                    value={topic}
                    onChangeText={setTopic}
                    maxLength={80}
                    style={{
                      fontSize: 18,
                      minHeight: 68,
                      color: t.ink,
                      lineHeight: 27,
                    }}
                  />
                  <TextInput
                    accessibilityLabel="Mục tiêu học tập"
                    placeholder="Mục tiêu của mình (tùy chọn)"
                    placeholderTextColor={t.muted}
                    value={goal}
                    onChangeText={setGoal}
                    maxLength={160}
                    style={[ui.input, { fontSize: 13, padding: 12 }]}
                  />
                  <View
                    style={{ flexDirection: "row", gap: 7, flexWrap: "wrap" }}
                  >
                    {["Người mới", "Đã biết một chút", "Nâng cao"].map((v) => (
                      <Pressable
                        key={v}
                        accessibilityRole="button"
                        accessibilityState={{ selected: level === v }}
                        onPress={() => setLevel(v)}
                        style={{
                          backgroundColor: level === v ? t.ink : t.soft,
                          padding: 10,
                          borderRadius: 9,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: level === v ? t.bg : t.muted,
                          }}
                        >
                          {v}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <Action
                    disabled={creating || topic.trim().length < 3}
                    onPress={createCourse}
                    icon="sparkle"
                  >
                    {creating ? "ĐANG TẠO LỘ TRÌNH..." : "TẠO KHÓA HỌC"}
                  </Action>
                  {creating && <ActivityIndicator color={t.ink} />}{" "}
                  {createError ? (
                    <Text
                      accessibilityRole="alert"
                      style={{ color: "#A34232", fontSize: 13, lineHeight: 21 }}
                    >
                      {createError}
                    </Text>
                  ) : null}
                </View>
              </>
            )}
            {screen === "lesson" && (
              <>
                <Text style={[ui.label, { marginTop: 12 }]}>
                  {activeLesson.title.toLocaleUpperCase("vi")}
                </Text>
                <Text
                  style={[
                    ui.title,
                    { fontSize: 30, lineHeight: 38, marginTop: 18 },
                  ]}
                >
                  {page.title}
                </Text>
                <Text
                  selectable
                  style={{
                    fontSize: 18,
                    lineHeight: 30,
                    color: t.ink,
                    marginTop: 20,
                  }}
                >
                  {page.body}
                </Text>
                <LessonFigure
                  page={page}
                  lesson={activeLesson}
                  index={pageIndex}
                />
                <View style={ui.row}>
                  <Icon name="sprout" color="#6D8B57" size={22} />
                  <Text style={[ui.body, { fontSize: 14, flex: 1 }]}>
                    Thử diễn đạt ý chính bằng lời của bạn trước khi tiếp tục.
                  </Text>
                </View>
              </>
            )}
            {screen === "quiz" && (
              <>
                <Text
                  style={[ui.label, { marginTop: 20, textAlign: "center" }]}
                >
                  THỬ SỨC MỘT CHÚT
                </Text>
                <View style={{ alignItems: "center", padding: 24 }}>
                  <Icon name="review" size={64} color="#7CA9B6" />
                </View>
                <Text
                  style={[
                    ui.title,
                    { fontSize: 25, lineHeight: 34, textAlign: "center" },
                  ]}
                >
                  {activeLesson.quiz.question}
                </Text>
                <View style={{ gap: 12, marginTop: 25 }}>
                  {activeLesson.quiz.choices.map((choice, i) => (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: answer === i }}
                      disabled={checked && isCorrect}
                      key={i}
                      onPress={() => {
                        setAnswer(i);
                        setChecked(false);
                      }}
                      style={[
                        s.option,
                        answer === i && {
                          borderColor: "#70BCE0",
                          backgroundColor: "#E1F3FC",
                          borderBottomColor: "#70BCE0",
                        },
                      ]}
                    >
                      <Text
                        style={{ fontSize: 13, color: t.muted, padding: 5 }}
                      >
                        {String.fromCharCode(65 + i)}
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 16,
                          lineHeight: 24,
                          color: t.ink,
                        }}
                      >
                        {choice}
                      </Text>
                      {answer === i && <Icon name="check" size={19} />}
                    </Pressable>
                  ))}
                </View>
                {checked && (
                  <View
                    style={[
                      ui.card,
                      {
                        backgroundColor: isCorrect ? "#E8EDD5" : t.peach,
                        marginTop: 20,
                        gap: 8,
                      },
                    ]}
                  >
                    <Text style={{ fontWeight: "700", color: t.ink }}>
                      {isCorrect ? "Chính xác!" : "Cùng thử lại nhé."}
                    </Text>
                    <Text style={[ui.body, { color: t.ink }]}>
                      {activeLesson.quiz.why}
                    </Text>
                  </View>
                )}
              </>
            )}
            {screen === "done" && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 22,
                }}
              >
                <Sprout size={110} />
                <Text style={[ui.title, { textAlign: "center" }]}>
                  Thêm một mầm{"\n"}kiến thức mới.
                </Text>
                <Text style={[ui.body, { textAlign: "center" }]}>
                  Bạn đã hoàn thành “{activeLesson.title}”.
                  {earnedXp
                    ? " Mỗi bước nhỏ đều đáng ghi nhận."
                    : " Càng ôn lại, càng nhớ lâu."}
                </Text>
                <Text style={{ fontSize: 27, fontWeight: "700", color: t.ink }}>
                  {earnedXp ? `+${earnedXp} XP` : "Đã ôn lại"}
                </Text>
                <Action
                  style={{ width: "100%" }}
                  onPress={() =>
                    lessonIndex + 1 < course.lessons.length
                      ? startLesson(lessonIndex + 1)
                      : go("home")
                  }
                >
                  {lessonIndex + 1 < course.lessons.length
                    ? "HỌC BÀI TIẾP THEO"
                    : "VỀ LỘ TRÌNH"}
                </Action>
                <Action
                  secondary
                  style={{ width: "100%" }}
                  onPress={() => go("home")}
                >
                  VỀ LỘ TRÌNH
                </Action>
              </View>
            )}
            {screen === "review" && (
              <>
                {reviewCourse && (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setReviewCourse(null)}
                    style={{ paddingBottom: 15 }}
                  >
                    <Text style={ui.body}>Đang ôn một khóa · Xem tất cả ↗</Text>
                  </Pressable>
                )}
                <Review
                  courses={
                    reviewCourse
                      ? courses.filter((c) => c.id === reviewCourse)
                      : courses
                  }
                  completed={completed}
                  reviews={reviews}
                  onGrade={(key, remembered) => {
                    setReviews((old) => ({
                      ...old,
                      [key]: scheduleReview(old[key], remembered),
                    }));
                    if (lastStudy !== dateKey()) {
                      setStreak((old) =>
                        lastStudy === previousDay() ? old + 1 : 1,
                      );
                      setLastStudy(dateKey());
                    }
                  }}
                  onExplore={() => go("explore")}
                />
              </>
            )}
            {screen === "saved" && (
              <>
                <Action secondary icon="back" onPress={() => go("explore")}>
                  VỀ THƯ VIỆN
                </Action>
                <View style={{ height: 24 }} />
                {savedPages.length ? (
                  savedPages.map((p) => (
                    <View
                      key={p.key}
                      style={[ui.card, { marginBottom: 16, gap: 12 }]}
                    >
                      <Text style={ui.label}>{p.course.title}</Text>
                      <Text
                        style={{
                          fontSize: 19,
                          fontWeight: "700",
                          color: t.ink,
                        }}
                      >
                        {p.content.title}
                      </Text>
                      <Text style={ui.body}>{p.content.takeaway}</Text>
                      <View style={ui.row}>
                        <Action
                          secondary
                          style={{ flex: 1 }}
                          onPress={() => {
                            setCourseId(p.course.id);
                            setLessonIndex(p.lesson);
                            setPageIndex(p.page);
                            setAnswer(null);
                            setChecked(false);
                            go("lesson");
                          }}
                        >
                          ĐỌC LẠI
                        </Action>
                        <IconButton
                          name="bookmark"
                          label="Bỏ lưu thẻ"
                          selected
                          onPress={() => toggleSaved(p.key)}
                        />
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={[ui.card, { gap: 12 }]}>
                    <Icon name="bookmark" size={34} />
                    <Text style={ui.title}>Gom điều đáng nhớ.</Text>
                    <Text style={ui.body}>
                      Nhấn biểu tượng đánh dấu trong bài học để giữ lại thẻ tại
                      đây.
                    </Text>
                  </View>
                )}
              </>
            )}
            {(screen === "profile" || screen === "stats") && (
              <>
                <View
                  style={{ alignItems: "center", gap: 12, paddingVertical: 25 }}
                >
                  <Sprout size={80} />
                  <Text style={ui.title}>Người học tò mò</Text>
                  <Text style={ui.body}>Mỗi ngày, hiểu thêm một chút.</Text>
                </View>
                <View style={[ui.row, { marginBottom: 25 }]}>
                  {[
                    [String(xp), "ĐIỂM XP"],
                    [String(doneCount), "BÀI ĐÃ HỌC"],
                    [
                      String(currentStreak(streak, lastStudy)),
                      "NGÀY LIÊN TIẾP",
                    ],
                  ].map(([v, l]) => (
                    <View
                      key={l}
                      style={[
                        ui.card,
                        { flex: 1, padding: 12, alignItems: "center", gap: 8 },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 24,
                          fontWeight: "600",
                          color: t.ink,
                        }}
                      >
                        {v}
                      </Text>
                      <Text
                        style={[
                          ui.label,
                          {
                            fontSize: 8,
                            letterSpacing: 0.4,
                            textAlign: "center",
                          },
                        ]}
                      >
                        {l}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={{ gap: 15 }}>
                  <Action
                    secondary
                    icon="bookmark"
                    onPress={() => {
                      setSavedCourse(null);
                      go("saved");
                    }}
                  >
                    THẺ ĐÃ LƯU ({saved.length})
                  </Action>
                  <Action
                    secondary
                    icon="library"
                    onPress={() => go("explore")}
                  >
                    THƯ VIỆN CỦA BẠN
                  </Action>
                  <Action
                    secondary
                    icon="review"
                    onPress={() => {
                      setReviewCourse(null);
                      go("review");
                    }}
                  >
                    ÔN TẬP KIẾN THỨC
                  </Action>
                </View>
                <View style={[ui.card, { marginTop: 28, gap: 12 }]}>
                  <Text
                    style={{ fontWeight: "700", fontSize: 17, color: t.ink }}
                  >
                    Một khu vườn của riêng bạn
                  </Text>
                  <Text style={ui.body}>
                    Tiến độ, ghi chú và thẻ đã lưu được giữ trên thiết bị này.
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setConfirmReset(true)}
                  style={{ padding: 20, alignItems: "center" }}
                >
                  <Text style={{ color: "#A25F4B", fontSize: 13 }}>
                    Xóa dữ liệu dùng thử
                  </Text>
                </Pressable>
                <Text style={[ui.label, { textAlign: "center" }]}>
                  MẦM · 0.3
                </Text>
              </>
            )}
          </ScrollView>
          {reading && (
            <View style={s.readerFooter}>
              {screen === "lesson" ? (
                <>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Hỏi gia sư Mầm"
                    onPress={() => setTutorOpen(true)}
                    style={s.readerTutor}
                  >
                    <Sprout size={39} />
                    <Text style={{ color: t.ink, fontSize: 12 }}>Hỏi Mầm</Text>
                  </Pressable>
                  <View style={[ui.row, { gap: 9 }]}>
                    {pageIndex > 0 && (
                      <Action
                        secondary
                        style={{ width: 52 }}
                        onPress={() => {
                          setPageIndex((v) => v - 1);
                          scrollRef.current?.scrollTo({
                            y: 0,
                            animated: false,
                          });
                        }}
                      >
                        ←
                      </Action>
                    )}
                    <Action
                      style={{ flex: 1 }}
                      onPress={() => {
                        if (pageIndex < activeLesson.pages.length - 1) {
                          setPageIndex((v) => v + 1);
                          scrollRef.current?.scrollTo({
                            y: 0,
                            animated: false,
                          });
                        } else go("quiz");
                      }}
                    >
                      {pageIndex === activeLesson.pages.length - 1
                        ? "TỰ KIỂM TRA"
                        : "TIẾP TỤC"}
                    </Action>
                  </View>
                </>
              ) : (
                <Action
                  disabled={answer === null}
                  onPress={() => {
                    if (checked && isCorrect) finish();
                    else if (checked) {
                      setChecked(false);
                      setAnswer(null);
                    } else setChecked(true);
                  }}
                >
                  {checked
                    ? isCorrect
                      ? "HOÀN THÀNH BÀI HỌC"
                      : "THỬ LẠI"
                    : "KIỂM TRA ĐÁP ÁN"}
                </Action>
              )}
            </View>
          )}
          {nav && (
            <View style={s.navDock}>
              <View style={s.navPill}>
                {tabs.map((item) => (
                  <Pressable
                    key={item.screen}
                    accessibilityRole="tab"
                    accessibilityLabel={item.label}
                    accessibilityState={{ selected: activeTab === item.screen }}
                    onPress={() => {
                      if (item.screen === "review") setReviewCourse(null);
                      go(item.screen);
                    }}
                    style={[
                      s.navItem,
                      activeTab === item.screen && { backgroundColor: t.soft },
                    ]}
                  >
                    <Icon
                      name={item.icon}
                      size={23}
                      filled={
                        activeTab === item.screen &&
                        ["home", "sparkle"].includes(item.icon)
                      }
                    />
                  </Pressable>
                ))}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Hỏi gia sư Mầm"
                onPress={() => setTutorOpen(true)}
                style={s.mascotButton}
              >
                <Sprout size={39} />
              </Pressable>
            </View>
          )}
          {desktop && (
            <View style={s.homeIndicator}>
              <View
                style={{
                  height: 4,
                  width: 110,
                  borderRadius: 4,
                  backgroundColor: t.ink,
                }}
              />
            </View>
          )}
        </KeyboardAvoidingView>
        <Modal
          visible={selectedLesson !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedLesson(null)}
        >
          <View style={s.overlay}>
            <View style={s.sheet}>
              <View style={[ui.row, { justifyContent: "space-between" }]}>
                <Text style={[ui.title, { flex: 1, fontSize: 23 }]}>
                  {course.lessons[selectedLesson ?? 0]?.title}
                </Text>
                <IconButton
                  name="close"
                  label="Đóng lựa chọn bài"
                  onPress={() => setSelectedLesson(null)}
                />
              </View>
              <Text style={ui.body}>
                {completed[`${course.id}:${selectedLesson}`]
                  ? "Đã hoàn thành · Sẵn sàng ôn lại"
                  : `${course.lessons[selectedLesson ?? 0]?.minutes} phút để khám phá`}
              </Text>
              <Action
                icon="review"
                onPress={() => {
                  const i = selectedLesson ?? 0;
                  startLesson(i);
                  go("quiz");
                }}
              >
                LUYỆN TẬP
              </Action>
              <Action
                secondary
                icon="notes"
                onPress={() => startLesson(selectedLesson ?? 0)}
              >
                ĐỌC BÀI HỌC
              </Action>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setLessonIndex(selectedLesson ?? 0);
                  setSelectedLesson(null);
                  setTutorOpen(true);
                }}
                style={[ui.row, { paddingVertical: 12 }]}
              >
                <Icon name="chat" />
                <Text style={[ui.body, { flex: 1, color: t.ink }]}>
                  Tìm hiểu sâu hơn cùng Mầm
                </Text>
                <Icon name="arrow" size={19} />
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          visible={notesOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setNotesOpen(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={s.overlay}
          >
            <View style={s.sheet}>
              <View style={[ui.row, { justifyContent: "space-between" }]}>
                <Text style={ui.title}>Ghi chú của mình</Text>
                <IconButton
                  name="close"
                  label="Đóng ghi chú"
                  onPress={() => setNotesOpen(false)}
                />
              </View>
              <Text style={ui.body}>
                {reading ? activeLesson.title : course.title}
              </Text>
              <TextInput
                accessibilityLabel="Nội dung ghi chú"
                placeholder="Điều mình muốn ghi nhớ..."
                placeholderTextColor={t.muted}
                multiline
                value={notes[noteKey] ?? ""}
                onChangeText={(text) =>
                  setNotes((old) => ({ ...old, [noteKey]: text }))
                }
                maxLength={5000}
                textAlignVertical="top"
                style={[ui.input, { minHeight: 180, lineHeight: 25 }]}
              />
              <Text style={[ui.label, { fontSize: 10 }]}>
                TỰ ĐỘNG LƯU TRÊN THIẾT BỊ
              </Text>
              <Action onPress={() => setNotesOpen(false)}>XONG</Action>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        {tutorOpen && (
          <Tutor
            lesson={activeLesson}
            courseTitle={course.title}
            onClose={() => setTutorOpen(false)}
          />
        )}
        <Modal
          visible={confirmReset}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmReset(false)}
        >
          <View style={s.overlay}>
            <View style={s.sheet}>
              <Text style={ui.title}>Xóa dữ liệu học?</Text>
              <Text style={ui.body}>
                Tiến độ, XP, khóa AI, thẻ đã lưu và ghi chú trên thiết bị này sẽ
                bị xóa.
              </Text>
              <Action
                onPress={() => {
                  setCompleted({});
                  setXp(0);
                  setStreak(0);
                  setLastStudy("");
                  setCustomCourses([]);
                  setReviews({});
                  setSaved([]);
                  setNotes({});
                  setCourseId("space");
                  setConfirmReset(false);
                  go("home");
                }}
              >
                XÓA DỮ LIỆU
              </Action>
              <Action secondary onPress={() => setConfirmReset(false)}>
                GIỮ LẠI
              </Action>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
const s = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#ECECE2",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loading: {
    flex: 1,
    backgroundColor: t.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  phone: {
    flex: 1,
    height: "100%",
    width: "100%",
    maxWidth: 520,
    backgroundColor: t.bg,
    overflow: "hidden",
  },
  desktopCopy: { width: 360, padding: 25, marginRight: 40 },
  desktopBrand: {
    fontSize: 23,
    fontWeight: "700",
    color: t.ink,
    marginTop: 17,
  },
  desktopTitle: {
    fontSize: 44,
    lineHeight: 51,
    letterSpacing: -1.4,
    fontWeight: "700",
    color: t.ink,
    marginTop: 35,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#8AAB72" },
  status: {
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  island: { width: 96, height: 23, backgroundColor: t.ink, borderRadius: 20 },
  header: {
    height: 69,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  wordmark: { fontSize: 25, fontWeight: "700", color: t.ink },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  navDock: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navPill: {
    flex: 1,
    height: 65,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: t.line,
    backgroundColor: t.bg,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: t.ink,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 3,
  },
  navItem: {
    flex: 1,
    height: 50,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotButton: {
    width: 58,
    height: 63,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: t.line,
    backgroundColor: t.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  homeIndicator: {
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.bg,
  },
  recommendationCover: {
    width: 110,
    height: 79,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: t.line,
    alignItems: "center",
    justifyContent: "center",
  },
  readerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    gap: 3,
    paddingVertical: 7,
  },
  track: {
    height: 9,
    borderRadius: 7,
    backgroundColor: "#E4E1D6",
    flex: 1,
    overflow: "hidden",
    marginRight: 6,
  },
  fill: { height: "100%", backgroundColor: t.blue, borderRadius: 7 },
  readerFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: t.bg,
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#EEEADF",
  },
  readerTutor: {
    alignSelf: "flex-end",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    gap: 13,
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: t.line,
    borderRadius: 15,
    minHeight: 65,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(35,30,22,.48)",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },
  sheet: {
    width: "100%",
    maxWidth: 410,
    backgroundColor: t.bg,
    borderRadius: 28,
    padding: 25,
    gap: 18,
  },
});
