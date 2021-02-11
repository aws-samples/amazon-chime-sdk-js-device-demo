import React from "react";

import "./VideoGrid.css";

interface VideoGridProps {
  size: number;
}

const VideoGrid: React.FC<VideoGridProps> = ({ children, size }) => {
  return (
    <div className={`VideoGrid ${`VideoGrid--size-${size}`}`}>{children}</div>
  );
};

export default VideoGrid;
