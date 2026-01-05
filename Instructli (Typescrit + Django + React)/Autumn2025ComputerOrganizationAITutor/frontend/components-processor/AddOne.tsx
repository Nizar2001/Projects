export default function AddOne() {
  return (
    <svg width="61" height="131">
      <polygon
        points="1,1 60,40 60,90 1,130 1,75 10,65 1,55"
        fill="#FFFFFF"
        stroke="black"
        strokeWidth="1"
      />

        <text
        x="60%"
        y="50%"
        // makes sure text is centered
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Add
      </text>
    </svg>
  );
}