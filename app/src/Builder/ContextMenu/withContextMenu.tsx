import React from "react";
import { motion } from "framer-motion";

// Define a type for the common props that the HOC adds
interface ContextMenuProps {
  top: number;
  left: number;
}

// Define the type for the HOC function itself
export const withContextMenu = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P & ContextMenuProps> => {
  return ({ top, left, ...props }: ContextMenuProps & P) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { type: "tween", stiffness: 200, duration: 0.1 },
        }}
        className="fixed p-2 bg-white text-gray-600 font-semibold text-sm border border-gray-50 rounded-lg z-50"
        style={{
          top,
          left,
          zIndex: 50,
        }}
      >
        <ul className="p-0  w-max m-0">
          <WrappedComponent {...(props as P)} />
        </ul>
      </motion.div>
    );
  };
};
