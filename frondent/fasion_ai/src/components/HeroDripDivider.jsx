import { motion } from "framer-motion";

/** Smooth curved bottom divider (viewBox width 1440, height 120). */
const CURVE_PATH = "M0,0 H1440 V20 Q720,120 0,20 Z";

function HeroDripDivider({ gradientId, gradientStops, className = "" }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`pointer-events-none block w-full ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          {gradientStops.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>
      <path fill={`url(#${gradientId})`} d={CURVE_PATH} />
    </svg>
  );
}

export default HeroDripDivider;
