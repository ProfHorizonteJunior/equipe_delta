export default function Notification({ message }) {
  if (!message) return null;

  return (
    <div style={styles.notif}>
      {message}
    </div>
  );
}

const styles = {
  notif: {
    background: "#eafaf1",
    border: "1px solid #a9dfbf",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    color: "#1a7f4b",
    marginBottom: 12,
  },
};