import React from "react";
import { Image } from "react-native";
import { courseArtKey } from "../lib/visual-design";
const artworks = {
  space: require("../../assets/artwork/space-v3.jpg"),
  mind: require("../../assets/artwork/mind-v3.jpg"),
  money: require("../../assets/artwork/money-v3.jpg"),
  ai: require("../../assets/artwork/ai-v3.jpg"),
  language: require("../../assets/artwork/language-v3.jpg"),
  history: require("../../assets/artwork/history-v3.jpg"),
  lexicon: require("../../assets/artwork/lexicon-v3.jpg"),
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
  return (
    <Image
      source={artworks[courseArtKey(id, title, category)]}
      resizeMode="cover"
      accessible={false}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
