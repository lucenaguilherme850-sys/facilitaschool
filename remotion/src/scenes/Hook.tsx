import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { colors, serifFamily, sansFamily } from "../theme";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blur = interpolate(frame, [0, 25], [20, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const lineScale = spring({ frame: frame - 25, fps, config: { damping: 200 } });
  const subY = interpolate(spring({ frame: frame - 40, fps, config: { damping: 18 } }), [0, 1], [40, 0]);
  const subOp = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, padding: 80, justifyContent: "center" }}>
      <AbsoluteFill style={{
        background: `radial-gradient(circle at 30% 30%, ${colors.gold}22, transparent 50%)`,
      }} />
      <div style={{
        fontFamily: sansFamily,
        fontSize: 28,
        letterSpacing: 8,
        color: colors.gold,
        textTransform: "uppercase",
        opacity,
        marginBottom: 40,
      }}>
        — Facilita School
      </div>
      <div style={{
        fontFamily: serifFamily,
        fontSize: 180,
        lineHeight: 0.95,
        color: colors.cream,
        opacity,
        filter: `blur(${blur}px)`,
        fontStyle: "italic",
      }}>
        Cansado da<br/>burocracia<br/>escolar?
      </div>
      <div style={{
        height: 3,
        background: colors.gold,
        marginTop: 60,
        transform: `scaleX(${lineScale})`,
        transformOrigin: "left",
        width: "60%",
      }} />
      <div style={{
        fontFamily: sansFamily,
        fontSize: 36,
        color: colors.cream,
        opacity: subOp,
        marginTop: 40,
        transform: `translateY(${subY}px)`,
        fontWeight: 300,
      }}>
        Existe um jeito mais fácil.
      </div>
    </AbsoluteFill>
  );
};
