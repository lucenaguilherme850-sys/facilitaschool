import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { colors, serifFamily, sansFamily } from "../theme";

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleS = spring({ frame, fps, config: { damping: 18 } });
  const titleY = interpolate(titleS, [0, 1], [60, 0]);
  const ruleS = spring({ frame: frame - 25, fps, config: { damping: 200 } });
  const urlOp = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame / 8) * 0.02;
  const orbY = Math.sin(frame / 30) * 20;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink, padding: 80, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{
        background: `radial-gradient(circle at 50% 40%, ${colors.gold}33, transparent 60%)`,
        transform: `translateY(${orbY}px)`,
      }} />
      <div style={{
        fontFamily: sansFamily, fontSize: 28, letterSpacing: 10,
        color: colors.gold, textTransform: "uppercase",
        opacity: titleS, marginBottom: 50,
      }}>Comece agora</div>

      <div style={{
        fontFamily: serifFamily, fontSize: 170, color: colors.cream,
        lineHeight: 0.95, textAlign: "center", fontStyle: "italic",
        opacity: titleS, transform: `translateY(${titleY}px)`,
      }}>
        Sua escola<br/>
        <span style={{ color: colors.gold }}>merece mais.</span>
      </div>

      <div style={{
        height: 2, background: colors.gold, marginTop: 60,
        width: 400, transform: `scaleX(${ruleS})`,
      }} />

      <div style={{
        marginTop: 80,
        padding: "32px 60px",
        border: `2px solid ${colors.gold}`,
        borderRadius: 100,
        background: `${colors.gold}11`,
        opacity: urlOp,
        transform: `scale(${pulse})`,
      }}>
        <div style={{
          fontFamily: sansFamily, fontSize: 42, color: colors.cream,
          letterSpacing: 2, fontWeight: 500,
        }}>facilitaschool.com</div>
      </div>
    </AbsoluteFill>
  );
};
