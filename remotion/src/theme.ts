import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadSans } from "@remotion/google-fonts/WorkSans";

export const { fontFamily: serifFamily } = loadSerif("normal", {
  weights: ["400"],
  subsets: ["latin"],
});
export const { fontFamily: sansFamily } = loadSans("normal", {
  weights: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

export const colors = {
  bg: "#0d0d0d",
  bgSoft: "#1a1a1a",
  gold: "#c9a84c",
  goldSoft: "#f0d78c",
  cream: "#f5f0e0",
  ink: "#0a0a0a",
};
