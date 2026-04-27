import React from "react";

export default function UserOnlineIndicator({ online }) {
  return (
    <span
      title={online ? "Online" : "Offline"}
      style={{
        display: "inline-block",
        width: "10px",
        height: "10px",
        borderRadius: "999px",
        background: online ? "var(--success-500)" : "var(--neutral-300)",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    />
  );
}
