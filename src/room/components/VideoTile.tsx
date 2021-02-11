import React, { useEffect, useRef } from "react";

interface VideoTileProps {
  isLocal: boolean;
  nameplate: string;
  bindVideoTile: (videoRef: any, isContent?: boolean) => void;
  isContent: true;
}

const VideoTile: React.FC<VideoTileProps> = ({
  bindVideoTile,
  nameplate,
  isLocal,
  isContent,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    bindVideoTile(videoRef.current);
  }, [videoRef, bindVideoTile]);

  const classes = `VideoTile ${
    isLocal ? "VideoTile--local" : !isContent ? "VideoTile--remote" : ""
  }`;

  return (
    <div style={{ display: isLocal ? "contents" : "grid" }}>
      <video className={classes} ref={videoRef} />
      {nameplate && !isLocal && (
        <div className="VideoTile-nameplate">{nameplate}</div>
      )}
    </div>
  );
};

export default VideoTile;
