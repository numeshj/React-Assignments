export default function FancyBox({ children }) {
  return (
    <div style={{
      padding: "12px 18px",
      border: "1px solid #555",
      borderRadius: 8,
      background: "#222",
      color: "#fff"
    }}>
      {children}
    </div>
  );
}
