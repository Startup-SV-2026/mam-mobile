import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Course, Progress, ReviewCard } from "../types/course";
import { readProgress } from "../types/course";
import { dayKey, previousDay, scheduleReview } from "../lib/learning";
import { fetchMe, syncUserProgress, type UserProfile, type AuthResponse } from "../services/auth-api";

const STORE_KEY = "mam-viet-learning-v1";
const AUTH_KEY = "mam-auth-session-v1";

export function useAppStore() {
  const [courseId, setCourseId] = useState("space");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [completed, setCompleted] = useState<Progress["completed"]>({});
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastStudy, setLastStudy] = useState("");
  const [customCourses, setCustomCourses] = useState<Course[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [reviews, setReviews] = useState<Record<string, ReviewCard>>({});
  const [illustrationIds, setIllustrationIds] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rawAuth = await AsyncStorage.getItem(AUTH_KEY);
        if (rawAuth) {
          const authData: AuthResponse = JSON.parse(rawAuth);
          setAuthToken(authData.token);
          setCurrentUser(authData.user);
          // Refresh profile from server so cached display data never goes stale
          fetchMe(authData.token)
            .then(({ user }) => {
              if (!mounted || !user) return;
              setCurrentUser(user);
              AsyncStorage.setItem(
                AUTH_KEY,
                JSON.stringify({ ...authData, user }),
              ).catch(() => {});
            })
            .catch(() => {
              // Offline or expired: keep cached profile
            });
        }

        const raw = await AsyncStorage.getItem(STORE_KEY);
        if (raw && mounted) {
          const p = readProgress(JSON.parse(raw));
          setReviews(p.reviews);
          setIllustrationIds(p.illustrationIds);
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
    const statePayload = {
      completed,
      xp,
      streak,
      lastStudy,
      customCourses,
      reviews,
      saved,
      notes,
      illustrationIds,
      selectedCourseId: courseId,
    };

    AsyncStorage.setItem(STORE_KEY, JSON.stringify(statePayload)).catch((e) =>
      console.warn("Could not save local progress:", e.message),
    );

    // Sync to backend if logged in
    if (authToken) {
      syncUserProgress(authToken, statePayload).catch(() => {
        // Soft fail if offline
      });
    }
  }, [
    hydrated,
    illustrationIds,
    completed,
    xp,
    streak,
    lastStudy,
    customCourses,
    reviews,
    saved,
    notes,
    courseId,
    authToken,
  ]);

  const setAuthSession = (authData: AuthResponse | null) => {
    if (authData) {
      setAuthToken(authData.token);
      setCurrentUser(authData.user);
      AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));

      // Apply server progress if available
      const p = authData.user.progress;
      if (p) {
        if (p.completed) setCompleted(p.completed);
        if (p.xp !== undefined) setXp(p.xp);
        if (p.streak !== undefined) setStreak(p.streak);
        if (p.lastStudy) setLastStudy(p.lastStudy);
        if (p.saved) setSaved(p.saved);
        if (p.notes) setNotes(p.notes);
        if (p.reviews) setReviews(p.reviews as Record<string, ReviewCard>);
        if (p.illustrationIds) setIllustrationIds(p.illustrationIds);
        if (p.selectedCourseId) setCourseId(p.selectedCourseId);
      }
    } else {
      setAuthToken(null);
      setCurrentUser(null);
      AsyncStorage.removeItem(AUTH_KEY);
    }
  };

  const toggleSaved = (key: string) => {
    setSaved((old) =>
      old.includes(key) ? old.filter((v) => v !== key) : [...old, key],
    );
  };

  const markLessonCompleted = (cId: string, lIdx: number) => {
    const key = `${cId}:${lIdx}`;
    const isNew = !completed[key];
    const earned = isNew ? 25 : 0;

    setReviews((old) => ({
      ...old,
      [key]: old[key] ?? scheduleReview(undefined, true),
    }));

    if (isNew) {
      setCompleted((old) => ({ ...old, [key]: true }));
      setXp((old) => old + 25);
    }

    const today = dayKey();
    if (lastStudy !== today) {
      setStreak((old) => (lastStudy === previousDay() ? old + 1 : 1));
      setLastStudy(today);
    }

    return earned;
  };

  const resetAllData = () => {
    setCompleted({});
    setXp(0);
    setStreak(0);
    setLastStudy("");
    setCustomCourses([]);
    setReviews({});
    setSaved([]);
    setNotes({});
    setCourseId("space");
  };

  return {
    hydrated,
    currentUser,
    authToken,
    setAuthSession,
    courseId,
    setCourseId,
    lessonIndex,
    setLessonIndex,
    pageIndex,
    setPageIndex,
    completed,
    setCompleted,
    xp,
    setXp,
    streak,
    lastStudy,
    customCourses,
    setCustomCourses,
    reviews,
    setReviews,
    illustrationIds,
    setIllustrationIds,
    saved,
    setSaved,
    toggleSaved,
    notes,
    setNotes,
    markLessonCompleted,
    resetAllData,
  };
}
