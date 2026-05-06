import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Julius from "../assets/Julius.webp";

const FOTO_URL = Julius;


export function Secrets(){
    const navigate = useNavigate();
  const imgRef = useRef(null);
  const pos = useRef({ x: 100, y: 100, vx: 3, vy: 2 });
  const frameRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;

    function animate() {
      const p = pos.current;
      const maxX = window.innerWidth - img.offsetWidth;
      const maxY = window.innerHeight - img.offsetHeight;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= 0 || p.x >= maxX) p.vx *= -1;
      if (p.y <= 0 || p.y >= maxY) p.vy *= -1;

      img.style.left = p.x + "px";
      img.style.top  = p.y + "px";

      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div style={styles.container}>
      <p style={styles.hint}>clica na foto pra sair 👆</p>
      <img
        ref={imgRef}
        src={FOTO_URL}
        alt="surpresa"
        onClick={() => navigate("/")}
        style={styles.img}
      />
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    background: "#111",
    overflow: "hidden",
    position: "relative",
  },
  hint: {
    position: "absolute",
    top: 16,
    left: "50%",
    transform: "translateX(-50%)",
    color: "#ffffff44",
    fontSize: 13,
    userSelect: "none",
  },
  img: {
    position: "absolute",
    width: 180,
    borderRadius: 12,
    cursor: "pointer",
    userSelect: "none",
  },
};
