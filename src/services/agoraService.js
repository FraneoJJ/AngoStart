import AgoraRTC from "agora-rtc-sdk-ng";

class AgoraService {
  constructor() {
    this.client = null;
    this.localAudioTrack = null;
    this.localVideoTrack = null;
    this.joined = false;
  }

  getClient() {
    if (!this.client) {
      this.client = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });
    }
    return this.client;
  }

  async setupListeners({ onRemoteVideo, onRemoteAudio, onUserLeft, onError } = {}) {
    const client = this.getClient();
    client.removeAllListeners();

    client.on("user-published", async (user, mediaType) => {
      try {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          onRemoteVideo?.(user);
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
          onRemoteAudio?.(user);
        }
      } catch (err) {
        onError?.(err);
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") onUserLeft?.(user);
    });

    client.on("user-left", (user) => {
      onUserLeft?.(user);
    });
  }

  async join({ appId, channelName, token, uid, withVideo = true }) {
    const client = this.getClient();
    if (this.joined) await this.leave();

    await client.join(appId, channelName, token, uid);
    this.joined = true;

    if (withVideo) {
      try {
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        this.localAudioTrack = audioTrack;
        this.localVideoTrack = videoTrack;
        await client.publish([audioTrack, videoTrack]);
        return { withVideo: true, fallbackToVoice: false };
      } catch {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        this.localAudioTrack = audioTrack;
        this.localVideoTrack = null;
        await client.publish([audioTrack]);
        return { withVideo: false, fallbackToVoice: true };
      }
    } else {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      this.localAudioTrack = audioTrack;
      this.localVideoTrack = null;
      await client.publish([audioTrack]);
      return { withVideo: false, fallbackToVoice: false };
    }
  }

  playLocalVideo(container) {
    if (!this.localVideoTrack) return;
    this.localVideoTrack.play(container);
  }

  playRemoteVideo(user, container) {
    user?.videoTrack?.play(container);
  }

  async toggleMicrophone() {
    if (!this.localAudioTrack) return false;
    const enabled = this.localAudioTrack.enabled;
    await this.localAudioTrack.setEnabled(!enabled);
    return !enabled;
  }

  async toggleCamera() {
    if (!this.localVideoTrack) return false;
    const enabled = this.localVideoTrack.enabled;
    await this.localVideoTrack.setEnabled(!enabled);
    return !enabled;
  }

  async leave() {
    try {
      if (this.localAudioTrack) {
        this.localAudioTrack.stop();
        this.localAudioTrack.close();
      }
      if (this.localVideoTrack) {
        this.localVideoTrack.stop();
        this.localVideoTrack.close();
      }
      this.localAudioTrack = null;
      this.localVideoTrack = null;
      if (this.client && this.joined) {
        await this.client.leave();
      }
    } finally {
      this.joined = false;
    }
  }
}

export const agoraService = new AgoraService();
