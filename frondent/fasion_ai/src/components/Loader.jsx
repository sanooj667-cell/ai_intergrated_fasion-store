import { motion } from "framer-motion";

function Loader({ label = "Loading..." }) {
  return (
    <div className="glass-panel flex min-h-[220px] flex-col items-center justify-center gap-4 p-6 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        className="h-10 w-10 rounded-full border-4 border-[#ffd5d9] border-t-[#e74b58]"
      />
      <p className="text-sm text-[#7b808a]">{label}</p>
    </div>
  );
}

export default Loader;
