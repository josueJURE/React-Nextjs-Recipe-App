"use client";

import Image from "next/image";
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

import { AlertDialogCompoment } from "@/components/dialog";

export default function TabComponent(): React.JSX.Element {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string>("");
  const [pictureError, setPictureError] = useState<string | null>(null);
  const [isDescribingPicture, setIsDescribingPicture] =
    useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  async function startCamera(): Promise<void> {
    try {
      setCapturedImage(null);
      setImageDescription("");
      setPictureError(null);

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

  function stopCamera(): void {
    if (stream) {
      const tracks = stream.getTracks();

      for (const track of tracks) {
        track.stop();
      }

      setStream(null);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }

  function takePicture(): string | null {
    const video = videoRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }

    const canvas = document.createElement("canvas");
    const maxDimension = 1024;
    const scale = Math.min(
      1,
      maxDimension / Math.max(video.videoWidth, video.videoHeight)
    );
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);

    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedImage(image);
    return image;
  }

  async function sendPictureToAi(image: string | null) {
    if (!image) {
      setPictureError("Could not capture an image");
      return;
    }

    setIsDescribingPicture(true);
    setImageDescription("");
    setPictureError(null);

    try {
      const response = await fetch("/api/user/picture-based-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      const data = (await response.json()) as {
        description?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Image description failed");
      }

      setImageDescription(data.description ?? "");
      console.log("image description", data.description);
    } catch (error) {
      console.error("Error response:", error);
      setPictureError(
        error instanceof Error ? error.message : "Image description failed"
      );
    } finally {
      setIsDescribingPicture(false);
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
              {!stream ? (
                <Button
                  className={primaryButtonClassName}
                  onClick={startCamera}
                  style={primaryButtonStyle}
                  type="button"
                >
                  Start camera
                </Button>
              ) : (
                <Button
                  className={secondaryButtonClassName}
                  onClick={stopCamera}
                  type="button"
                  variant="outline"
                >
                  Stop camera
                </Button>
              )}
              {stream && (
                <AlertDialogCompoment
                title="Take and analyze this picture?"
                description="We’ll capture the current camera frame and use it to suggest a recipe."
                cancelLabel="Cancel"
                actionLabel="Analyse picture"
                 onConfirm={() => {
                    const image = takePicture();
                    void sendPictureToAi(image);
                  }}
                  trigger={
                    <Button
                      className={secondaryButtonClassName}
                      disabled={isDescribingPicture}
                      type="button"
                      variant="outline"
                    >
                      {isDescribingPicture
                        ? "Reading picture..."
                        : "Take a picture"}
                    </Button>
                  }
                />
              )}
            </div>

            {capturedImage && (
              <div className="relative mt-4 aspect-video overflow-hidden rounded-lg border border-[#d8e2d6] bg-[#f2f7f3]">
                <Image
                  alt="Captured ingredients"
                  className="object-cover"
                  fill
                  src={capturedImage}
                  unoptimized
                />
              </div>
            )}

            {imageDescription && (
              <p className={`${bodyTextClassName} mt-4`}>{imageDescription}</p>
            )}

            {pictureError && (
              <p className="mt-4 text-sm font-medium text-red-600">
                {pictureError}
              </p>
            )}
          </section>
        </TabsContent>

        <TabsContent value="build-menu"></TabsContent>
      </Tabs>
    </div>
  );
}
