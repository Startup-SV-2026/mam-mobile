import React, { useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import type { Course, Screen } from "../types/course";
import { STARTER_COURSES } from "../data/courses";
import { Action, theme as t, ui } from "../components/ui/ui";
import { AIStatus } from "../components/ui/AIStatus";
import { Tutor } from "../screens/TutorScreen";
import { StudyGoals } from "../components/course/StudyGoals";
import { Review } from "../screens/ReviewScreen";
import { CourseBuilder } from "../screens/CourseBuilderScreen";
import { Podcast, MiniPodcast } from "../components/podcast/Podcast";
import { MascotLoading } from "../components/mascot/MascotLoading";
import { MamMascot } from "../components/mascot/MamMascot";
import { usePodcast } from "../hooks/usePodcast";
import { buildEpisode } from "../audio/transcript";
import { useProgressiveLessons } from "../hooks/useProgressiveLessons";
import { useCourseBuilder } from "../hooks/useCourseBuilder";
import { useAppStore } from "../hooks/useAppStore";
import { scheduleReview } from "../lib/learning";

// Refactored components
import { ReaderHeader } from "../components/layout/ReaderHeader";
import { MamHeader } from "../components/layout/MamHeader";
import { MamNavBar } from "../components/layout/MamNavBar";
import { MamRoadmap } from "../screens/RoadmapScreen";
import { MamHomeDashboard } from "../screens/HomeScreen";
import { MamLibrary } from "../screens/LibraryScreen";
import { CourseSidebarModal } from "../components/layout/CourseSidebarModal";
import { LessonContent, QuizContent } from "../components/course/LessonReader";
import { LessonHook } from "../components/course/LessonHook";
import { LessonDone } from "../screens/LessonDone";
import { ProfileScreen } from "../screens/ProfileScreen";
import { AuthScreen } from "../screens/AuthScreen";
import { SavedCards } from "../components/course/SavedCards";
import { TactileButton } from "../components/ui/TactileButton";
import {
  LessonActionModal,
  NotesModal,
  ResetConfirmModal,
} from "../components/ui/AppModals";

export default function App() {
  const podcast = usePodcast();
  const { width, height } = useWindowDimensions();
  const phonePreview = Platform.OS === "web" && width >= 600 && height >= 480;

  const {
    hydrated,
    currentUser,
    setAuthSession,
    courseId,
    setCourseId,
    lessonIndex,
    setLessonIndex,
    pageIndex,
    setPageIndex,
    completed,
    xp,
    streak,
    lastStudy,
    customCourses,
    setCustomCourses,
    reviews,
    setReviews,
    illustrationIds,
    setIllustrationIds,
    saved,
    toggleSaved,
    notes,
    setNotes,
    markLessonCompleted,
    resetAllData,
  } = useAppStore();

  const [screen, setScreen] = useState<Screen>("home");
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [savedCourse, setSavedCourse] = useState<string | null>(null);
  const [reviewCourse, setReviewCourse] = useState<string | null>(null);
  const [aiStatusFrom, setAIStatusFrom] = useState<Screen>("profile");
  const [confirmReset, setConfirmReset] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const courses = useMemo(
    () => [...customCourses, ...STARTER_COURSES],
    [customCourses],
  );
  const course =
    courses.find((item) => item.id === courseId) || STARTER_COURSES[0];
  const rawLesson = course.lessons[lessonIndex] || course.lessons[0];
  const illustrationId = illustrationIds[`${course.id}:${lessonIndex}`];
  const activeLesson = illustrationId
    ? { ...rawLesson, illustration: { id: illustrationId } }
    : rawLesson;
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
    go("course");
  };

  const startLesson = (index: number) => {
    if (!course.lessons[index]) {
      go("course");
      return;
    }
    setSelectedLesson(null);
    setLessonIndex(index);
    setPageIndex(0);
    setAnswer(null);
    setChecked(false);
    go("lesson");
  };

  const courseBuilder = useCourseBuilder((newCourse) => {
    setCustomCourses((old) => [newCourse, ...old]);
    openCourse(newCourse);
  });

  const generation = useProgressiveLessons(
    course,
    completed,
    hydrated,
    (id, index, lesson) => {
      setCustomCourses((old) =>
        old.map((c) =>
          c.id === id && c.lessons.length === index
            ? { ...c, lessons: [...c.lessons, lesson] }
            : c,
        ),
      );
    },
  );

  const isCorrect = answer === activeLesson.quiz.answer;

  const finish = () => {
    const gained = markLessonCompleted(course.id, lessonIndex);
    setEarnedXp(gained);
    go("done");
  };

  if (!hydrated) {
    return (
      <View style={s.loading}>
        <MascotLoading label="Đang tải Mầm…" size={96} />
      </View>
    );
  }

  const reading = screen === "lesson" || screen === "quiz";
  const nav =
    !reading &&
    screen !== "done" &&
    screen !== "saved" &&
    screen !== "ai-status" &&
    screen !== "auth";
  const totalReaderPages = activeLesson.pages.length + 1;
  const contentPageIndex = Math.max(0, pageIndex - 1);
  const page = activeLesson.pages[contentPageIndex] ?? activeLesson.pages[0];
  const pageKey = `${course.id}:${lessonIndex}:${contentPageIndex}`;
  const noteKey = reading ? `${course.id}:${lessonIndex}` : course.id;

  if (!currentUser) {
    return (
      <View style={[s.previewStage, !phonePreview && { backgroundColor: t.bg }]}>
        <SafeAreaView
          style={[
            s.app,
            phonePreview && [
              s.phoneFrame,
              { height: Math.min(900, height - 32) },
            ],
          ]}
        >
          <StatusBar barStyle="light-content" backgroundColor={t.bg} />
          <KeyboardAvoidingView
            style={s.layout}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              contentContainerStyle={[s.content, { paddingVertical: 24, flexGrow: 1, justifyContent: "center" }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <AuthScreen
                onSuccess={(authData) => {
                  setAuthSession(authData);
                  go("home");
                }}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }

  const title =
    screen === "ai-status"
      ? "Trạng thái AI"
      : screen === "podcast"
        ? "Podcast"
        : screen === "explore"
          ? "Thư viện"
          : screen === "create"
            ? ""
            : screen === "goals"
              ? "Mục tiêu học"
              : screen === "review"
                ? "Ôn tập"
                : screen === "profile"
                  ? "Cá nhân"
                  : screen === "stats"
                    ? "Tiến độ"
                    : screen === "saved"
                      ? "Thẻ đã lưu"
                      : "";

  return (
    <View style={[s.previewStage, !phonePreview && { backgroundColor: t.bg }]}>
      <SafeAreaView
        style={[
          s.app,
          phonePreview && [
            s.phoneFrame,
            { height: Math.min(900, height - 32) },
          ],
        ]}
      >
        <StatusBar barStyle="light-content" backgroundColor={t.bg} />
        <KeyboardAvoidingView
          style={s.layout}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {reading ? (
            <ReaderHeader
              screen={screen}
              pageIndex={pageIndex}
              totalPages={totalReaderPages}
              isSaved={saved.includes(pageKey)}
              onClose={() => go("home")}
              onOpenNotes={() => setNotesOpen(true)}
              onToggleSave={() => toggleSaved(pageKey)}
            />
          ) : (
            <MamHeader
              screen={screen}
              title={title}
              streak={streak}
              lastStudy={lastStudy}
              xp={xp}
              onToggleSidebar={() => setSidebarOpen(true)}
            />
          )}

          <ScrollView
            key={screen}
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              if (screen === "create" && courseBuilder.creating) {
                scrollRef.current?.scrollTo({ y: 0, animated: false });
              } else if (
                screen === "create" &&
                courseBuilder.turns.length &&
                !courseBuilder.brief
              ) {
                scrollRef.current?.scrollToEnd({ animated: true });
              }
            }}
            style={{ flex: 1 }}
            contentContainerStyle={[
              s.content,
              {
                paddingBottom: nav
                  ? podcast.episode && screen !== "podcast"
                    ? 205
                    : 135
                  : reading
                    ? 150
                    : 32,
              },
              screen === "done" && { flexGrow: 1 },
            ]}
          >
            {screen === "home" && (
              <MamHomeDashboard
                user={currentUser}
                courses={courses}
                activeCourse={course}
                completed={completed}
                streak={streak}
                lastStudy={lastStudy}
                xp={xp}
                onContinueCourse={(c) => {
                  setCourseId(c.id);
                  go("course");
                }}
                onSelectCourse={openCourse}
                onExplore={() => go("explore")}
                onCreateCourse={() => go("create")}
                onOpenGoals={() => go("goals")}
              />
            )}

            {screen === "course" && (
              <MamRoadmap
                course={course}
                generation={generation}
                completed={completed}
                onPodcast={() => go("podcast")}
                onTutor={() => setTutorOpen(true)}
                onSelect={setSelectedLesson}
                onNotes={() => setNotesOpen(true)}
                onSidebarToggle={() => setSidebarOpen(true)}
                onBack={() => go("home")}
              />
            )}

            {screen === "podcast" && (
              <Podcast
                courses={courses}
                courseId={courseId}
                completed={completed}
                player={podcast}
                onCourse={setCourseId}
                onRead={(id, index) => {
                  setCourseId(id);
                  startLesson(index);
                }}
              />
            )}

            {screen === "explore" && (
              <MamLibrary
                courses={courses}
                completed={completed}
                onOpen={openCourse}
                onCreate={() => go("create")}
              />
            )}

            {screen === "create" && (
              <CourseBuilder
                builder={courseBuilder}
                onChange={() =>
                  requestAnimationFrame(() =>
                    scrollRef.current?.scrollToEnd({ animated: true }),
                  )
                }
              />
            )}

            {screen === "lesson" &&
              (pageIndex === 0 ? (
                <LessonHook
                  lesson={activeLesson}
                  courseTitle={course.title}
                />
              ) : (
                <LessonContent
                  pageIndex={contentPageIndex}
                  activeLesson={activeLesson}
                  page={page}
                  courseId={course.id}
                  courseTitle={course.title}
                  lessonIndex={lessonIndex}
                  onOpenAIStatus={() => {
                    setAIStatusFrom("lesson");
                    go("ai-status");
                  }}
                />
              ))}

            {screen === "quiz" && (
              <QuizContent
                activeLesson={activeLesson}
                answer={answer}
                checked={checked}
                isCorrect={isCorrect}
                onSelectAnswer={(i) => {
                  setAnswer(i);
                  setChecked(false);
                }}
              />
            )}

            {screen === "done" && (
              <LessonDone
                course={course}
                lessonIndex={lessonIndex}
                activeLesson={activeLesson}
                earnedXp={earnedXp}
                generation={generation}
                onNextLesson={startLesson}
                onHome={() => go("home")}
              />
            )}

            {screen === "goals" && (
              <StudyGoals
                onNavigate={() =>
                  scrollRef.current?.scrollTo({ y: 0, animated: false })
                }
                onReview={() => {
                  setReviewCourse(null);
                  go("review");
                }}
              />
            )}

            {screen === "review" && (
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
                }}
                onExplore={() => go("explore")}
              />
            )}

            {screen === "saved" && (
              <SavedCards
                courses={courses}
                savedKeys={saved}
                filterCourseId={savedCourse}
                onBack={() => go("explore")}
                onReadCard={(cId, lIdx, pIdx) => {
                  setCourseId(cId);
                  setLessonIndex(lIdx);
                  setPageIndex(pIdx);
                  setAnswer(null);
                  setChecked(false);
                  go("lesson");
                }}
                onToggleSave={toggleSaved}
              />
            )}

            {screen === "ai-status" && (
              <AIStatus
                lesson={activeLesson}
                courseTitle={course.title}
                onAsset={(id) =>
                  setIllustrationIds((old) => ({
                    ...old,
                    [`${course.id}:${lessonIndex}`]: id,
                  }))
                }
                onBack={() => go(aiStatusFrom)}
              />
            )}

            {(screen === "profile" || screen === "stats") && (
              <ProfileScreen
                user={currentUser}
                xp={xp}
                doneCount={doneCount}
                streak={streak}
                lastStudy={lastStudy}
                savedCount={saved.length}
                onOpenAuth={() => go("auth")}
                onLogout={() => {
                  setAuthSession(null);
                  go("profile");
                }}
                onOpenSaved={() => {
                  setSavedCourse(null);
                  go("saved");
                }}
                onOpenPodcast={() => go("podcast")}
                onOpenLibrary={() => go("explore")}
                onOpenReview={() => {
                  setReviewCourse(null);
                  go("review");
                }}
                onRequestReset={() => setConfirmReset(true)}
              />
            )}
          </ScrollView>

          {reading && (
            <View style={s.readerFooter}>
              {screen === "lesson" ? (
                <>
                  <View style={[ui.row, { gap: 10 }]}>
                    {pageIndex > 0 && (
                      <View style={{ width: 56 }}>
                        <TactileButton
                          variant="secondary"
                          size="lg"
                          onPress={() => {
                            setPageIndex((v) => v - 1);
                            scrollRef.current?.scrollTo({
                              y: 0,
                              animated: false,
                            });
                          }}
                        >
                          ←
                        </TactileButton>
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <TactileButton
                        variant="primary"
                        size="lg"
                        arrow
                        onPress={() => {
                          if (pageIndex < totalReaderPages - 1) {
                            setPageIndex((v) => v + 1);
                            scrollRef.current?.scrollTo({
                              y: 0,
                              animated: false,
                            });
                          } else go("quiz");
                        }}
                      >
                        {pageIndex === totalReaderPages - 1
                          ? "TỰ KIỂM TRA"
                          : "TIẾP TỤC"}
                      </TactileButton>
                    </View>
                  </View>
                </>
              ) : (
                <TactileButton
                  variant="primary"
                  size="lg"
                  arrow
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
                </TactileButton>
              )}
            </View>
          )}

          {nav && podcast.episode && screen !== "podcast" && (
            <View
              style={{ position: "absolute", bottom: 88, left: 14, right: 14 }}
            >
              <MiniPodcast player={podcast} onOpen={() => go("podcast")} />
            </View>
          )}

          {nav && (
            <MamNavBar
              activeScreen={screen}
              onTabPress={(tabScreen) => {
                if (tabScreen === "review") setReviewCourse(null);
                go(tabScreen);
              }}
              onTutorPress={() => setTutorOpen(true)}
            />
          )}
        </KeyboardAvoidingView>

        <CourseSidebarModal
          visible={sidebarOpen}
          courses={courses}
          activeCourseId={course.id}
          onSelectCourse={openCourse}
          onCreateCourse={() => go("create")}
          onClose={() => setSidebarOpen(false)}
        />

        <LessonActionModal
          visible={selectedLesson !== null}
          course={course}
          selectedLesson={selectedLesson}
          isCompleted={!!completed[`${course.id}:${selectedLesson}`]}
          onClose={() => setSelectedLesson(null)}
          onQuiz={() => {
            const i = selectedLesson ?? 0;
            startLesson(i);
            go("quiz");
          }}
          onPodcast={() => {
            const index = selectedLesson ?? 0;
            go("podcast");
            void podcast.load(buildEpisode(course, index));
          }}
          onRead={() => startLesson(selectedLesson ?? 0)}
          onTutor={() => {
            setLessonIndex(selectedLesson ?? 0);
            setSelectedLesson(null);
            setTutorOpen(true);
          }}
        />

        <NotesModal
          visible={notesOpen}
          subtitle={reading ? activeLesson.title : course.title}
          notesText={notes[noteKey] ?? ""}
          onChangeNotes={(text) =>
            setNotes((old) => ({ ...old, [noteKey]: text }))
          }
          onClose={() => setNotesOpen(false)}
        />

        {tutorOpen && (
          <Tutor
            lesson={activeLesson}
            courseTitle={course.title}
            onClose={() => setTutorOpen(false)}
          />
        )}

        <ResetConfirmModal
          visible={confirmReset}
          onConfirm={() => {
            resetAllData();
            setConfirmReset(false);
            go("home");
          }}
          onCancel={() => setConfirmReset(false)}
        />
      </SafeAreaView>
    </View>
  );
}

function ActionText({ label }: { label: string }) {
  return <>{label}</>;
}

const s = StyleSheet.create({
  previewStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  phoneFrame: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    width: 420,
    borderWidth: 7,
    borderColor: t.frame,
    borderRadius: 42,
    overflow: "hidden",
  },
  app: {
    flex: 1,
    width: "100%",
    backgroundColor: t.bg,
  },
  layout: {
    flex: 1,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  loading: {
    flex: 1,
    backgroundColor: t.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  readerFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: t.bg,
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: t.line,
  },
  readerTutor: {
    alignSelf: "flex-end",
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});
