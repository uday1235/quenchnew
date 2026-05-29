import Svg, { Ellipse, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const PETALS = [0, 60, 120, 180, 240, 300];

export default function FlowerLogo({ size = 36 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 40 40" width={size} height={size}>
      <Defs>
        <RadialGradient id="petal" cx="50%" cy="15%" r="85%">
          <Stop offset="0%" stopColor="#c7d2fe" />
          <Stop offset="100%" stopColor="#4338ca" />
        </RadialGradient>
        <RadialGradient id="centre" cx="50%" cy="30%" r="70%">
          <Stop offset="0%" stopColor="#fde68a" />
          <Stop offset="100%" stopColor="#f59e0b" />
        </RadialGradient>
      </Defs>
      {PETALS.map((deg) => (
        <Ellipse
          key={deg}
          cx="20" cy="12"
          rx="5" ry="9"
          fill="url(#petal)"
          opacity={0.88}
          rotation={deg}
          originX="20"
          originY="20"
        />
      ))}
      <Circle cx="20" cy="20" r="6.5" fill="url(#centre)" />
      <Circle cx="20" cy="20" r="2.5" fill="#fff" opacity={0.6} />
    </Svg>
  );
}
