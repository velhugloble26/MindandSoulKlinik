"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Music2 } from "lucide-react";

const VIDEO_ID = "B8uzDRge4rg";

const autoplayUrl = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=0&loop=1&playlist=${VIDEO_ID}&playsinline=1&controls=0&enablejsapi=1`;

export default function YouTubeShortsPlayer() {
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (pathname.startsWith("/admin")) return null;

function enableMusic() {
  iframeRef.current?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func: "unMute", args: [] }),
    "*",
  );

  iframeRef.current?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func: "playVideo", args: [] }),
    "*",
  );
}

  return (
    <>
      <button
        type="button"
        className="shorts-player"
        onClick={enableMusic}
        aria-label="Play music"
        title="Play music"
      >
        <Music2 aria-hidden="true" />
      </button>
      <iframe
        ref={iframeRef}
        className="shorts-player__audio"
        src={autoplayUrl}
        title="Background focus music"
        width={200}
        height={200}
        allow="autoplay; encrypted-media"
        loading="eager"
        tabIndex={-1}
        aria-hidden="true"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </>
  );
}
