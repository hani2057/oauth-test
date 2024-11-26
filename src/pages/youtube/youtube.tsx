import axios from "axios";
import { useState } from "react";

export function Youtube() {
  const OAUTH2_LOGIN_END_POINT = "https://accounts.google.com/o/oauth2/v2/auth";
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl";
  const STATE = import.meta.env.VITE_STATE;
  const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

  const [data, setData] = useState<{ snippet: { title: string } }>();

  const handleOauthLogIn = () => {
    localStorage.clear();

    const paramsObj = {
      client_id: CLIENT_ID,
      redirect_uri: `${REDIRECT_BASE_URL}/youtube/redirect`,
      response_type: "code",
      scope: SCOPE,
      access_type: "offline", // refresh token을 받기 위해 설정
      state: STATE,
      include_granted_scopes: "true",
      prompt: "consent", // 동의 화면을 항상 표시하도록 설정
    };

    const params = new URLSearchParams(paramsObj).toString();

    window.location.href = `${OAUTH2_LOGIN_END_POINT}?${params}`;
  };

  const handleGetYoutubeChannels = async () => {
    const res = await axios({
      method: "GET",
      url: `${YOUTUBE_API_BASE_URL}/channels`,
      params: {
        part: "snippet",
        mine: "true",
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    console.log("res", res);
    setData(res.data);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <p>step 1.</p>
        <button onClick={handleOauthLogIn}>구글 로그인</button>
        {localStorage.getItem("access_token") && <p>access token 발급 완료</p>}
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <p>step 2.</p>
        <button onClick={handleGetYoutubeChannels}>유튜브 api 호출</button>
        {data && <p>유튜브 채널 정보(채널명): {data.snippet.title}</p>}
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <p>reset</p>
        <button onClick={() => localStorage.clear()}>다시 하기</button>
      </div>
    </div>
  );
}
