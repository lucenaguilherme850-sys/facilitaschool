import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { colors, serifFamily, sansFamily } from "../theme";

const items = [
  "Matrículas confusas",
  "Documentos perdidos",
  "Pais sem informação",
  "Processos manuais",
];

export const Problem: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bgSoft, padding: 100, justifyContent: "center" }}>
      <div style={{
        fontFamily: serifFamily,
        fontSize: 110,
        color: colors.cream,
        lineHeight: 1,
        fontStyle: "italic",
        marginBottom: 80,
      }}>
        O problema
      </div>
      {items.map((text, i) => {
        const f = useCurrentFrame() - 15 - i * 12;
        const s = spring({ frame: f, fps, config: { damping: 18 } });
        const x = interpolate(s, [0, 1], [-200, 0]);
        const op = interpolate(s, [0, 1], [0, 1]);
        return (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
            marginBottom: 30,
            transform: `translateX(${x}px)`,
            opacity: op,
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: "50%",
              border: `2px solid ${colors.gold}`,
            }} />
            <div style={{
              fontFamily: sansFamily,
              fontSize: 52,
              color: colors.cream,
              fontWeight: 300,
            }}>{text}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
