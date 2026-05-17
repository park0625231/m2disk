import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  useEffect(() => {
    window.location.replace("/me2disk-coupon.html");
  }, []);

  return (
    <div style={{ padding: 40, textAlign: "center", fontFamily: "system-ui" }}>
      <p>
        이동 중입니다... <a href="/me2disk-coupon.html">여기를 클릭</a>
      </p>
    </div>
  );
}
