import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { colors, serifFamily, sansFamily } from "../theme";

export const Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const label = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleS = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const titleScale = interpolate(titleS, [0, 1], [0.85, 1]);
  const circle = spring({ frame: frame - 30, fps, config: { damping: 200, mass: 1.5 } });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, padding: 100, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{
          width: 800, height: 800, borderRadius: "50%",
          border: `1px solid ${colors.gold}33`,
          transform: `scale(${circle})`,
        }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{
          width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.gold}33, transparent 70%)`,
          transform: `scale(${circle})`,
        }} />
      </AbsoluteFill>
      <div style={{
        fontFamily: sansFamily,
        fontSize: 26,
        letterSpacing: 10,
        color: colors.gold,
        textTransform: "uppercase",
        opacity: label,
        marginBottom: 40,
        zIndex: 2,
      }}>
        A solução
      </div>
      <div style={{
        fontFamily: serifFamily,
        fontSize: 220,
        color: colors.cream,
        lineHeight: 0.9,
        textAlign: "center",
        fontStyle: "italic",
        transform: `scale(${titleScale})`,
        opacity: titleS,
        zIndex: 2,
      }}>
        Facilita<br/>
        <span style={{ color: colors.gold }}>School</span>
      </div>
    </AbsoluteFill>
  );
};
