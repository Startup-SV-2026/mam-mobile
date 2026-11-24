import { StyleSheet, Platform } from "react-native";
import { theme } from "./theme";

export const commonStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  phoneFrame: {
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
    backgroundColor: theme.bg,
    minHeight: "100%",
    borderRadius: Platform.OS === "web" ? 36 : 0,
    overflow: "hidden",
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 8,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  surfaceCard: {
    backgroundColor: theme.soft,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 12,
  },
  rowCentered: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading1: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.ink,
    letterSpacing: -0.3,
  },
  heading2: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.ink,
    letterSpacing: -0.2,
  },
  bodyText: {
    fontSize: 14,
    color: theme.muted,
    lineHeight: 20,
  },
});
