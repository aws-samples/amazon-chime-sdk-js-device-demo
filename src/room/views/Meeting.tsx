import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import MeetingAudio from "../containers/MeetingAudio";
import { useRoomProviderState } from "../containers/RoomProvider";
import VideoManager from "../containers/VideoManager";

const Meeting = (): JSX.Element => {
  const roomState = useRoomProviderState();
  const history = useHistory();

  useEffect(() => {
    if (!roomState?.activeMeeting) {
      history.goBack();
    }
  }, [roomState, history]);

  return (
    <>
      <h1>In-Meeting</h1>
      <VideoManager />
      <MeetingAudio />
    </>
  );
};

export default Meeting;
