export function LogoMark({ size = 18 }: { size?: number }) {
  const dots = [
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ];
  const cell = size / 3;
  const r = cell * 0.26;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {dots.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x * cell + cell / 2}
          cy={y * cell + cell / 2}
          r={r}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
