import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Course, Progress } from "../types/course";
type Props = Pick<Progress, "completed" | "reviews"> & {
  courses: Course[];
  onGrade: (key: string, remembered: boolean) => void;
  onExplore: () => void;
};
export function Review({
  courses,
  completed,
  reviews,
  onGrade,
  onExplore,
}: Props) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  const [revealed, setRevealed] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const cards = courses
    .flatMap((course) =>
      course.lessons.map((lesson, i) => ({
        key: `${course.id}:${i}`,
        lesson,
        course,
      })),
    )
    .filter((c) => completed[c.key]);
  const due = cards.filter((c) => !reviews[c.key] || reviews[c.key].due <= now);
  const card = due[0];
  const grade = (remembered: boolean) => {
    if (!card) return;
    onGrade(card.key, remembered);
    setRevealed(false);
    setChoice(null);
    setSessionCount((c) => c + 1);
  };
  return (
    <View style={{ gap: 18, paddingTop: 12 }}>
      <Text style={s.eyebrow}>GIEO LẠI ĐỂ NHỚ LÂU</Text>
      <Text style={s.title}>Một chút ôn tập.</Text>
      <Text style={s.body}>
        Những điều đã học sẽ quay lại đúng lúc. Mỗi lần nhớ là một lần hiểu sâu
        hơn.
      </Text>
      <View style={s.summary}>
        <Text style={{ fontSize: 40 }}>↻</Text>
        <View>
          <Text style={s.number}>{due.length} câu đến hạn</Text>
          <Text style={s.body}>
            {cards.length} kiến thức trong vườn của bạn
          </Text>
        </View>
      </View>
      {card ? (
        <View style={s.card}>
          <Text style={s.eyebrow}>
            {card.course.emoji} {card.course.title}
          </Text>
          <Text style={s.question}>{card.lesson.quiz.question}</Text>
          {card.lesson.quiz.choices.map((text, i) => (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: choice === i }}
              disabled={revealed}
              key={i}
              onPress={() => setChoice(i)}
              style={[
                s.option,
                choice === i && {
                  borderColor: "#549BBC",
                  backgroundColor: "#DDEEF3",
                },
              ]}
            >
              <Text style={s.body}>
                {String.fromCharCode(65 + i)}. {text}
              </Text>
            </Pressable>
          ))}
          {!revealed ? (
            <Pressable
              accessibilityRole="button"
              disabled={choice === null}
              onPress={() => setRevealed(true)}
              style={[s.button, choice === null && { opacity: 0.4 }]}
            >
              <Text style={s.buttonText}>Xem đáp án</Text>
            </Pressable>
          ) : (
            <>
              <Text style={s.answer}>
                {choice === card.lesson.quiz.answer
                  ? "Chính xác!"
                  : "Cùng ghi nhớ lại nhé."}{" "}
                {card.lesson.quiz.why}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => grade(choice === card.lesson.quiz.answer)}
                style={s.button}
              >
                <Text style={s.buttonText}>Tiếp tục →</Text>
              </Pressable>
            </>
          )}
        </View>
      ) : (
        <View style={s.card}>
          <Text style={{ fontSize: 52, textAlign: "center" }}>✳</Text>
          <Text style={[s.question, { textAlign: "center" }]}>
            {cards.length
              ? "Bạn đã ôn xong hôm nay!"
              : "Vườn kiến thức đang chờ bạn"}
          </Text>
          <Text style={s.body}>
            {cards.length
              ? `Đã ôn ${sessionCount} câu trong lượt này. Câu trả lời đúng sẽ trở lại sau 1, 3, 7, 14 rồi 30 ngày; câu chưa nhớ sẽ trở lại sau 10 phút.`
              : "Hoàn thành bài học đầu tiên để bắt đầu. Câu hỏi sẽ xuất hiện tại đây khi đến lịch ôn."}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onExplore}
            style={s.button}
          >
            <Text style={s.buttonText}>Khám phá bài học ↗</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#549BBC",
  },
  title: {
    fontSize: 31,
    fontWeight: "800",
    color: "#2C1C18",
    letterSpacing: -1,
  },
  body: { fontSize: 14, lineHeight: 22, color: "#867F73" },
  summary: {
    backgroundColor: "#E3E5C8",
    padding: 20,
    borderRadius: 22,
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
  number: { fontSize: 21, fontWeight: "800", color: "#2C1C18" },
  card: {
    backgroundColor: "#FFFDF1",
    borderWidth: 1,
    borderColor: "#D4D0C3",
    borderRadius: 22,
    padding: 20,
    gap: 12,
  },
  question: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C1C18",
    lineHeight: 30,
    marginVertical: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: "#D4D0C3",
    padding: 14,
    borderRadius: 14,
  },
  button: {
    backgroundColor: "#2C1C18",
    borderRadius: 16,
    padding: 17,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#FFFDF1", fontWeight: "700", fontSize: 14 },
  answer: {
    fontSize: 15,
    lineHeight: 24,
    color: "#2C1C18",
    backgroundColor: "#E3E5C8",
    padding: 16,
    borderRadius: 12,
  },
});
