import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingVertical: Platform.OS === "android" ? 60 : 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  backIcon: {
    fontSize: 22,
    color: "#005AB3",
  },
  headerTextWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: "Bold",
    color: "#1B1B1D",
  },
  title: {
    fontSize: 36,
    fontFamily: "Bold",
    color: "#1B1B1D",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B6B7A",
    marginBottom: 28,
  },
  formField: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#3A3A45",
    fontFamily: "Bold",
  },
  input: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1B1B1D",
  },
  primaryButton: {
    marginTop: 10,
    backgroundColor: "#005AB3",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Bold",
  },
  bottomTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
  },
  tabItemActive: {
    alignItems: "center",
    flex: 1,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 4,
    color: "#6B6B7A",
  },
  tabLabel: {
    fontSize: 12,
    color: "#6B6B7A",
  },
  tabLabelActive: {
    fontSize: 12,
    color: "#005AB3",
    fontFamily: "Bold",
  },
});
