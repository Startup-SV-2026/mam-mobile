import React from "react";
import { Image } from "react-native";
import { courseArtKey } from "../../lib/visual-design";
const artworks = {
  space: require("../../../assets/artwork/space-v2.jpg"),
  mind: require("../../../assets/artwork/mind-v2.jpg"),
  money: require("../../../assets/artwork/money-v2.jpg"),
  ai: require("../../../assets/artwork/ai-v2.jpg"),
  language: require("../../../assets/artwork/language-v2.jpg"),
  history: require("../../../assets/artwork/history-v2.jpg"),
  lexicon: require("../../../assets/artwork/lexicon-v2.jpg"),
  science: require("../../../assets/artwork/science-v2.jpg"),
  exam: require("../../../assets/artwork/exam-v2.jpg"),
  literature: require("../../../assets/artwork/literature-v2.jpg"),
  design: require("../../../assets/artwork/design-v2.jpg"),
  health: require("../../../assets/artwork/health-v2.jpg"),
  logic: require("../../../assets/artwork/logic-v2.jpg"),
  earth: require("../../../assets/artwork/earth-v2.jpg"),
  culture: require("../../../assets/artwork/culture-v2.jpg"),
};

export function CourseArt({
  id,
  title = "",
  category = "",
}: {
  id: string;
  title?: string;
  category?: string;
  size?: number;
}) {
  const key = courseArtKey(id, title, category);
  return (
    <Image
      source={artworks[key] || artworks.lexicon}
      resizeMode="cover"
      accessible={false}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
