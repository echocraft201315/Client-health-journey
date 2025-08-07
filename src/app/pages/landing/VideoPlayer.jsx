"use client";

import { useState, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { cn } from "@/app/lib/utils";

const VideoPlayer = ({
  videoUrl = "", // Will be updated with actual URL
  posterImage,
  title = "Platform Demo",
  description = "See how Client Health Tracker empowers healthcare providers",
  className,
  autoplay = false,
  muted = true,
  controls = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [showPlaceholder, setShowPlaceholder] = useState(!videoUrl);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = async () => {
    if (videoRef.current && !isLoading) {
      setIsLoading(true);
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          await videoRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.log('Video play/pause error:', error);
        // Don't update state if there's an error
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Placeholder component when no video URL is provided
  if (showPlaceholder) {
    return (
      <div className={cn(
        "relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl overflow-hidden",
        "border-2 border-dashed border-primary/20",
        className
      )}>
        <div className="aspect-video flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Play className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-text-hero mb-2">{title}</h3>
          <p className="text-text-medical max-w-md">{description}</p>
          <Button variant="outline" className="mt-4" disabled>
            Video Coming Soon
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-2xl overflow-hidden shadow-elegant", className)}>
             <video
         ref={videoRef}
         className="w-full h-auto"
         poster={posterImage}
         autoPlay={autoplay}
         muted={muted}
         loop
         onPlay={() => {
           setIsPlaying(true);
           setIsLoading(false);
         }}
         onPause={() => {
           setIsPlaying(false);
           setIsLoading(false);
         }}
         onError={(e) => {
           console.log('Video error:', e);
           setIsLoading(false);
         }}
       >
        <source src={videoUrl} type="video/mp4" />
        <p className="text-text-medical">
          Your browser doesn't support video playback. 
          <a href={videoUrl} className="text-primary hover:underline">
            Download the video
          </a>
        </p>
      </video>

      {/* Custom Controls Overlay */}
      {controls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

             {/* Play button overlay for initial play */}
       {!isPlaying && (
         <div className="absolute inset-0 flex items-center justify-center">
           <Button
             variant="ghost"
             size="lg"
             onClick={togglePlay}
             disabled={isLoading}
             className="w-20 h-20 rounded-full bg-white/90 hover:bg-white text-primary hover:text-primary shadow-lg disabled:opacity-50"
           >
             {isLoading ? (
               <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             ) : (
               <Play className="w-8 h-8 ml-1" />
             )}
           </Button>
         </div>
       )}
    </div>
  );
};

export default VideoPlayer;