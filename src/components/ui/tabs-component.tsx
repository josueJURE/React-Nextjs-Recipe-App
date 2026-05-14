"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  bodyTextClassName,
  infoPanelClassName,
  primaryButtonClassName,
  primaryButtonStyle,
  secondaryButtonClassName,
  sectionHeadingClassName,
  tabsTriggerClassName,
} from "@/utils/const";

export default function TabComponent() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Could not access camera:", err);
    }
  }

  function stopCamera() {
    if (stream) {
      console.log("typeof stream.getTracks()", typeof stream.getTracks());
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }



  return (
    <div className="flex w-full justify-center px-4 pb-6 sm:px-6 lg:px-8">
      <Tabs
        defaultValue="build-menu"
        className="mx-auto w-full max-w-6xl items-center gap-4"
      >
        <TabsList className="!h-auto mx-auto grid w-full max-w-md grid-cols-2 rounded-lg border border-[#d8e2d6] bg-white/80 p-1 shadow-[0_14px_34px_-30px_rgba(36,56,45,0.5)]">
          <TabsTrigger className={tabsTriggerClassName} value="build-menu">
            Build your menu
          </TabsTrigger>
          <TabsTrigger className={tabsTriggerClassName} value="account">
            Take picture
          </TabsTrigger>
        </TabsList>

        <TabsContent className="mt-4 w-full" value="account">
          <section className={`${infoPanelClassName} mx-auto max-w-3xl`}>
            <div className="space-y-2">
              <h2 className={sectionHeadingClassName}>Take a picture</h2>
              <p className={bodyTextClassName}>
                You&apos;ve got some ingredients but no idea what do do with
                them. Take a picture and we will cook something up.
              </p>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-[#d8e2d6] bg-[#f2f7f3]">
              <video
                ref={videoRef}
                autoPlay
                className="aspect-video w-full bg-[#24382d] object-cover"
                playsInline
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button
                className={primaryButtonClassName}
                onClick={startCamera}
                style={primaryButtonStyle}
                type="button"
              >
                Start camera
              </Button>
              {stream && <Button
                className={secondaryButtonClassName}
                onClick={
                  stopCamera
                }
                type="button"
                variant="outline"
              >
                Stop camera
              </Button>  }
          
            </div>
          </section>
        </TabsContent>

        <TabsContent value="build-menu"></TabsContent>
      </Tabs>
    </div>
  );
}
