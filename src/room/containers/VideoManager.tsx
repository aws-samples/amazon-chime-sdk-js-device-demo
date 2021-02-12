import React, { useReducer, useEffect, useState, useRef } from "react";

import MeetingManager from "../MeetingManager";
import VideoGrid from "../components/VideoGrid";
import VideoTile from "../components/VideoTile";
import { DeviceMessage } from "../../shim/types";
import { Type as actionType } from "./RoomProvider/reducer";
import {
  useRoomProviderDispatch,
  useRoomProviderState,
} from "./RoomProvider/index";

function reducer(state, { type, payload }) {
  switch (type) {
    case "TILE_UPDATED": {
      const { tileId, ...rest } = payload;
      return {
        ...state,
        [tileId]: {
          ...rest,
        },
      };
    }
    case "TILE_DELETED": {
      const { [payload]: omit, ...rest } = state;
      return {
        ...rest,
      };
    }
    default: {
      return state;
    }
  }
}

const VideoManager = () => {
  const roomProviderDispatch = useRoomProviderDispatch();
  const { isViewingSharedScreen } = useRoomProviderState();
  const [state, dispatch] = useReducer(reducer, {});
  const contentShareTile = useRef(null);

  const videoTileDidUpdate = (tileState) => {
    if (tileState.isContent && tileState.tileId !== contentShareTile.current) {
      contentShareTile.current = tileState.tileId;

      const deviceMessage: DeviceMessage = {
        type: actionType.StartScreenShareView,
      };

      roomProviderDispatch(deviceMessage);
    }
    // Handle contentShare tile
    MeetingManager.getAttendee(tileState.boundAttendeeId.split("#")[0]).then(
      (name: string) => {
        dispatch({ type: "TILE_UPDATED", payload: { ...tileState, name } });
      }
    );
  };

  const videoTileWasRemoved = (tileId: number) => {
    if (tileId === contentShareTile?.current) {
      contentShareTile.current = null;

      const deviceMessage: DeviceMessage = {
        type: actionType.StopScreenShareView,
      };

      roomProviderDispatch(deviceMessage);
    }
    dispatch({ type: "TILE_DELETED", payload: tileId });
  };

  const videoObservers = { videoTileDidUpdate, videoTileWasRemoved };

  useEffect(() => {
    MeetingManager.addAudioVideoObserver(videoObservers);
    return () => {
      MeetingManager.removeMediaObserver(videoObservers);
    };
  }, []);

  const videos = Object.keys(state).map((tileId) => (
    <VideoTile
      key={tileId}
      nameplate={state[tileId].name}
      isLocal={state[tileId].localTile}
      bindVideoTile={(videoRef) => {
        MeetingManager.bindVideoTile(parseInt(tileId), videoRef);
      }}
      isContent={state[tileId].isContent}
    />
  ));

  const videoTiles = videos.filter((video) => video.props.isContent === false);
  const contentShareVideo = videos.filter(
    (video) => video.props.isContent === true
  )[0];

  return (
    <>
      <div
        id="shared-content-view"
        style={{ display: isViewingSharedScreen ? "inline" : "none" }}
      >
        {contentShareVideo ? (
          contentShareVideo
        ) : (
          <div id="share-content-view-nameplate">No one is sharing screen</div>
        )}
      </div>
      <VideoGrid size={videos.length}>{videoTiles}</VideoGrid>
    </>
  );
};

export default VideoManager;
