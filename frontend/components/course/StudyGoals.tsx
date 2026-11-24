import { MascotLoading } from "../mascot/MascotLoading";
import { fetchBackend } from "../../services/backend-fetch";
import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  makeStudyPlan,
  isStudyPlan,
  isActivities,
  studyDate,
  type StudyPlan,
} from "../../lib/study-plan";
import { StudyActivity } from "../../screens/StudyActivityScreen";
import { Action, theme as t, ui } from "../ui/ui";
const KEY = "mam-study-plans-v1";
export function StudyGoals({
  onReview,
  onNavigate,
}: {
  onReview: () => void;
  onNavigate: () => void;
}) {
  const [plans, setPlans] = useState<StudyPlan[]>([]),
    [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [editing, setEditing] = useState(false),
    [topic, setTopic] = useState("Từ vựng tiếng Anh C1, C2"),
    [level, setLevel] = useState("C1 → C2"),
    [minutes, setMinutes] = useState(20),
    [selected, setSelected] = useState(0),
    [week, setWeek] = useState<number | null>(null),
    [busy, setBusy] = useState(false);
  const now = new Date(),
    tomorrow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const [start, setStart] = useState(studyDate(tomorrow)),
    [end, setEnd] = useState(
      studyDate(
        Date.UTC(now.getFullYear(), now.getMonth() + 1, now.getDate() + 1),
      ),
    );
  const skipSave = useRef(true);
  const controller = useRef<AbortController | null>(null),
    requestId = useRef(0);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!active) return;
        if (raw) {
          const data = JSON.parse(raw);
          if (!Array.isArray(data) || !data.every(isStudyPlan))
            throw Error("Kế hoạch đã lưu chưa hợp lệ.");
          setPlans(data);
        }
      })
      .catch(() => {
        if (active) setError("Chưa đọc được kế hoạch đã lưu.");
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
      requestId.current++;
      controller.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    AsyncStorage.setItem(KEY, JSON.stringify(plans)).catch(() =>
      setError("Chưa lưu được kế hoạch trên thiết bị."),
    );
  }, [plans, ready]);
  useEffect(() => {
    onNavigate();
  }, [editing, week, selected, plans.length]);
  const plan = plans[selected];
  const current = week !== null ? plan?.weeks[week] : undefined;
  function update(f: (p: StudyPlan) => StudyPlan) {
    setPlans((old) => old.map((p, i) => (i === selected ? f(p) : p)));
  }
  async function generate() {
    if (!plan || week === null || busy) return;
    const id = ++requestId.current,
      pid = plan.id,
      wi = week;
    setBusy(true);
    setError("");
    const c = new AbortController();
    controller.current = c;
    const timer = setTimeout(() => c.abort(), 90000);
    try {
      const base = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
      if (!base) throw Error("Chưa kết nối máy chủ AI.");
      const r = await fetchBackend(`${base}/api/study-week`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: c.signal,
        body: JSON.stringify({
          topic: plan.topic,
          level: plan.level,
          minutes: plan.minutes,
          focus: plan.weeks[wi].focus,
          week: wi + 1,
          totalWeeks: plan.weeks.length,
          previousTopics: plan.weeks
            .slice(0, wi)
            .flatMap((w) =>
              (w.activities ?? [])
                .filter((a) => a.kind === "flashcard")
                .map((a) => a.prompt.slice(0, 200)),
            )
            .slice(-20),
        }),
      });
      const body = await r.json();
      if (!r.ok) throw Error(body.error || "Chưa tạo được bài học.");
      if (!isActivities(body.activities))
        throw Error("Nội dung AI chưa đúng cấu trúc. Hãy thử lại.");
      if (id === requestId.current)
        setPlans((old) =>
          old.map((p) =>
            p.id === pid
              ? {
                  ...p,
                  weeks: p.weeks.map((w, i) =>
                    i === wi ? { ...w, activities: body.activities } : w,
                  ),
                }
              : p,
          ),
        );
    } catch (e) {
      if (id === requestId.current)
        setError(
          e instanceof Error
            ? e.name === "AbortError"
              ? "Hết thời gian chờ. Bạn có thể thử lại."
              : e.message
            : "Không kết nối được AI.",
        );
    } finally {
      clearTimeout(timer);
      if (id === requestId.current) setBusy(false);
    }
  }
  if (!ready) return <MascotLoading compact label="Đang tải mục tiêu…" />;
  return (
    <View style={{ gap: 20, paddingTop: 14 }}>
      <Text style={ui.title}>
        {editing || !plan
          ? "Bạn muốn đạt điều gì?"
          : current
            ? `Tuần ${week! + 1}`
            : "Mục tiêu của bạn"}
      </Text>
      {error ? (
        <Text
          accessibilityRole="alert"
          style={{ color: t.danger, lineHeight: 22 }}
        >
          {error}
        </Text>
      ) : null}
      {editing || !plan ? (
        <>
          <Text style={ui.body}>
            Chọn chủ đề và thời gian. Bài học được chia theo tuần.
          </Text>
          <Text style={ui.label}>MỤC TIÊU</Text>
          <TextInput
            accessibilityLabel="Mục tiêu học"
            value={topic}
            onChangeText={setTopic}
            maxLength={150}
            style={ui.input}
          />
          <Text style={ui.label}>TRÌNH ĐỘ MONG MUỐN</Text>
          <TextInput
            accessibilityLabel="Trình độ mong muốn"
            value={level}
            onChangeText={setLevel}
            maxLength={100}
            style={ui.input}
          />
          <View style={[ui.row, { alignItems: "flex-start" }]}>
            {[
              ["Từ ngày", start, setStart],
              ["Đến ngày", end, setEnd],
            ].map(([label, value, setter]) => (
              <View key={label as string} style={{ flex: 1, gap: 8 }}>
                <Text style={ui.label}>{label as string}</Text>
                <TextInput
                  accessibilityLabel={label as string}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={t.muted}
                  value={value as string}
                  onChangeText={setter as (v: string) => void}
                  style={[ui.input, { padding: 12, fontSize: 14 }]}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            ))}
          </View>
          <Text style={ui.body}>
            Nhập ngày cụ thể theo DD/MM/YYYY. Ví dụ: 11/11/2026 – 11/12/2026.
          </Text>
          <Text style={ui.label}>PHÚT MỖI NGÀY</Text>
          <View style={[ui.row, { flexWrap: "wrap", gap: 8 }]}>
            {[10, 20, 30, 45, 60].map((m) => (
              <Pressable
                key={m}
                accessibilityRole="button"
                accessibilityState={{ selected: minutes === m }}
                onPress={() => setMinutes(m)}
                style={[
                  ui.input,
                  {
                    padding: 12,
                    backgroundColor: minutes === m ? t.selected : t.surface,
                  },
                ]}
              >
                <Text style={{ color: t.ink }}>{m} phút</Text>
              </Pressable>
            ))}
          </View>
          <Action
            onPress={() => {
              try {
                const p = makeStudyPlan(topic, level, minutes, start, end);
                setPlans((old) => [p, ...old]);
                setSelected(0);
                setWeek(null);
                setEditing(false);
                setError("");
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            LẬP KẾ HOẠCH
          </Action>
          {plans.length > 0 && (
            <Action secondary onPress={() => setEditing(false)}>
              HỦY
            </Action>
          )}
        </>
      ) : current ? (
        <>
          <Action
            secondary
            onPress={() => {
              setWeek(null);
              setError("");
            }}
          >
            VỀ KẾ HOẠCH
          </Action>
          <Text style={ui.body}>
            {current.start} – {current.end}
          </Text>
          <Text style={{ fontSize: 20, lineHeight: 29, color: t.ink }}>
            {current.focus}
          </Text>
          <Text style={ui.body}>
            {plan.topic} · {plan.level} · {plan.minutes} phút/ngày
          </Text>
          {current.activities ? (
            <>
              <Text style={ui.label}>
                {current.done.length}/{current.activities.length} HOẠT ĐỘNG ĐÃ
                HOÀN THÀNH
              </Text>
              {current.activities.map((a, i) => (
                <View key={i} style={{ gap: 8 }}>
                  {current.done.includes(i) && (
                    <Text style={{ color: t.accent }}>✓ Đã hoàn thành</Text>
                  )}
                  <StudyActivity
                    key={`${plan.id}:${week}:${i}`}
                    activity={a}
                    draft={current.drafts[i] || ""}
                    onDraft={(v) =>
                      update((p) => ({
                        ...p,
                        weeks: p.weeks.map((w, j) =>
                          j === week
                            ? { ...w, drafts: { ...w.drafts, [i]: v } }
                            : w,
                        ),
                      }))
                    }
                    onDone={() =>
                      update((p) => ({
                        ...p,
                        weeks: p.weeks.map((w, j) =>
                          j === week
                            ? { ...w, done: [...new Set([...w.done, i])] }
                            : w,
                        ),
                      }))
                    }
                  />
                </View>
              ))}
            </>
          ) : (
            <>
              <Text style={ui.body}>
                AI tạo nội dung riêng theo mục tiêu và trình độ. Bài đã tạo sẽ
                được lưu để học lại; bạn có thể chia các hoạt động cho nhiều
                buổi trong tuần.
              </Text>
              {busy ? (
                <MascotLoading
                  label="Đang tạo bài cho tuần…"
                  detail="Nội dung đang được soạn theo mục tiêu của bạn."
                  size={100}
                />
              ) : (
                <Action onPress={generate}>TẠO BÀI HỌC TUẦN NÀY</Action>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <View style={[ui.card, { gap: 12 }]}>
            <Text style={{ fontSize: 22, fontWeight: "600", color: t.ink }}>
              {plan.topic}
            </Text>
            <Text style={ui.body}>
              {plan.start} – {plan.end}
            </Text>
            <Text style={ui.body}>
              {plan.level} · {plan.minutes} phút/ngày · {plan.weeks.length} tuần
            </Text>
            <Text style={{ fontSize: 12, color: t.muted }}>
              Flashcard · Điền từ · Ghép nghĩa · Đọc hiểu · Luyện viết
            </Text>
          </View>
          {plan.weeks.map((w, i) => (
            <Pressable
              accessibilityRole="button"
              key={i}
              onPress={() => {
                setWeek(i);
                setError("");
              }}
              style={[ui.card, { gap: 9 }]}
            >
              <Text style={{ fontWeight: "700", color: t.accent }}>
                TUẦN {i + 1} · {w.start.slice(0, 5)} – {w.end.slice(0, 5)}
              </Text>
              <Text style={{ fontSize: 18, color: t.ink, lineHeight: 26 }}>
                {w.focus}
              </Text>
              <Text style={ui.body}>
                {w.activities
                  ? `${w.done.length}/${w.activities.length} hoạt động đã học`
                  : "Chưa tạo nội dung"}{" "}
                ↗
              </Text>
            </Pressable>
          ))}
          <Action
            secondary
            onPress={() => {
              setEditing(true);
              setError("");
            }}
          >
            THÊM MỤC TIÊU
          </Action>
          {plans.length > 1 &&
            plans.map(
              (p, i) =>
                i !== selected && (
                  <Action
                    key={p.id}
                    secondary
                    onPress={() => {
                      setSelected(i);
                      setWeek(null);
                    }}
                  >
                    {p.topic}
                  </Action>
                ),
            )}
        </>
      )}
      <Action secondary onPress={onReview}>
        ÔN LẠI KIẾN THỨC ĐÃ HỌC
      </Action>
    </View>
  );
}
