import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { colors, serifFamily, sansFamily } from "../theme";

const features = [
  { n: "01", t: "Matrículas online", d: "Em minutos, sem papelada" },
  { n: "02", t: "Gestão completa", d: "Alunos, turmas e financeiro" },
  { n: "03", t: "Comunicação direta", d: "Pais e escola conectados" },
];

export const Features: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, padding: 80, justifyContent: "center" }}>
      <div style={{
        fontFamily: sansFamily, fontSize: 24, letterSpacing: 8,
        color: colors.gold, textTransform: "uppercase", marginBottom: 60,
      }}>O que você ganha</div>
      {features.map((f, i) => {
        const fr = useCurrentFrame() - 10 - i * 18;
        const s = spring({ frame: fr, fps, config: { damping: 20 } });
        const y = interpolate(s, [0, 1], [60, 0]);
        return (
          <div key={i} style={{
            opacity: s,
            transform: `translateY(${y}px)`,
            padding: "40px 0",
            borderBottom: `1px solid ${colors.gold}33`,
            display: "flex",
            gap: 40,
            alignItems: "baseline",
          }}>
            <div style={{
              fontFamily: serifFamily, fontSize: 80,
              color: colors.gold, fontStyle: "italic", opacity: 0.5,
            }}>{f.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: serifFamily, fontSize: 72, color: colors.cream,
                lineHeight: 1, fontStyle: "italic",
              }}>{f.t}</div>
              <div style={{
                fontFamily: sansFamily, fontSize: 32, color: colors.cream,
                opacity: 0.7, marginTop: 12, fontWeight: 300,
              }}>{f.d}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
