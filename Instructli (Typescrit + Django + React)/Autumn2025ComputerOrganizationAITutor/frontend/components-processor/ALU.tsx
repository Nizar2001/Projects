export default function ALU() {
  return (
    <svg width="81" height="171">
      <polygon
        points="1,1 80,50 80,120 1,170 1,100 15,85 1,70"
        fill="#FFFFFF"
        stroke="black"
        strokeWidth="1"
      />

      <text
        x="70%"
        y="35%"
        textAnchor="middle"
      >
        Zero
      </text>
      <text
        x="45%"
        y="50%"
        textAnchor="middle"
      >
        ALU
      </text>
      <text
        x="90%"
        y="53%"
        textAnchor="end"
      >
        <tspan x="90%" dy="1em">ALU</tspan>
        <tspan x="90%" dy="1em">result</tspan>
      </text>
    </svg>
  );
}