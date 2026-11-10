import { useEffect, useRef } from "react";

export function SignaturePad({ color, onChange, clearKey }: { color: string; onChange: (url: string | null) => void; clearKey: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const has = useRef(false);

  useEffect(() => {
    const c = ref.current!;
    const r = c.getBoundingClientRect();
    const d = window.devicePixelRatio || 1;
    c.width = r.width * d; c.height = r.height * d;
    const ctx = c.getContext("2d")!;
    ctx.scale(d, d); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 2.4;
    has.current = false; onChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearKey]);

  const pos = (e: React.PointerEvent) => { const r = ref.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
  const down = (e: React.PointerEvent) => {
    ref.current!.setPointerCapture(e.pointerId); drawing.current = true;
    const ctx = ref.current!.getContext("2d")!; const [x, y] = pos(e);
    ctx.strokeStyle = getComputedStyle(ref.current!).getPropertyValue(color).trim() || color;
    ctx.beginPath(); ctx.moveTo(x, y);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return; const ctx = ref.current!.getContext("2d")!; const [x, y] = pos(e);
    ctx.lineTo(x, y); ctx.stroke(); has.current = true;
  };
  const up = () => { if (!drawing.current) return; drawing.current = false; if (has.current) onChange(ref.current!.toDataURL("image/png")); };

  return <canvas ref={ref} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
    className="h-40 w-full touch-none cursor-crosshair rounded-md border border-dashed border-input bg-paper" />;
}
