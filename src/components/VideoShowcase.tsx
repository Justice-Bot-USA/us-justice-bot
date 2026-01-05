import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

// Import tutorial videos
import gettingStartedVideo from "@/assets/videos/getting-started-tutorial.mp4";
import aiCaseAnalysisVideo from "@/assets/videos/ai-case-analysis-tutorial.mp4";
import downloadingFormsVideo from "@/assets/videos/downloading-forms-tutorial.mp4";
import legalJourneyVideo from "@/assets/videos/legal-journey-tutorial.mp4";

interface VideoData {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
}

const videos: VideoData[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn how to create your account, navigate the platform, and begin your legal journey with US Justice Bot.",
    videoSrc: gettingStartedVideo
  },
  {
    id: "ai-case-analysis",
    title: "AI Case Analysis",
    description: "See how our AI analyzes your legal situation, calculates merit scores, and provides personalized recommendations.",
    videoSrc: aiCaseAnalysisVideo
  },
  {
    id: "downloading-forms",
    title: "Downloading Forms",
    description: "Step-by-step guide to finding, filling out, and downloading the correct legal forms for your jurisdiction.",
    videoSrc: downloadingFormsVideo
  },
  {
    id: "legal-journey",
    title: "Legal Journey Wizard",
    description: "Follow along as we walk through the complete case filing process from triage to court-ready documents.",
    videoSrc: legalJourneyVideo
  }
];

const VideoShowcase = () => {
  const [activeTab, setActiveTab] = useState(videos[0].id);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState<Record<string, boolean>>({});

  const handlePlayPause = (videoId: string) => {
    const video = document.getElementById(`video-${videoId}`) as HTMLVideoElement;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(prev => ({ ...prev, [videoId]: true }));
      } else {
        video.pause();
        setIsPlaying(prev => ({ ...prev, [videoId]: false }));
      }
    }
  };

  const handleMuteToggle = (videoId: string) => {
    const video = document.getElementById(`video-${videoId}`) as HTMLVideoElement;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(prev => ({ ...prev, [videoId]: video.muted }));
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Video Tutorials</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See US Justice Bot in Action</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch these video guides to see how easy it is to get legal help and navigate your case.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto">
              {videos.map((video) => (
                <TabsTrigger 
                  key={video.id} 
                  value={video.id}
                  className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {video.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {videos.map((video) => (
              <TabsContent key={video.id} value={video.id}>
                <div className="bg-card rounded-2xl border shadow-lg overflow-hidden">
                  {/* Video Player */}
                  <div className="aspect-video bg-black relative group">
                    <video
                      id={`video-${video.id}`}
                      src={video.videoSrc}
                      className="w-full h-full object-cover"
                      loop
                      muted
                      playsInline
                      onPlay={() => setIsPlaying(prev => ({ ...prev, [video.id]: true }))}
                      onPause={() => setIsPlaying(prev => ({ ...prev, [video.id]: false }))}
                    />
                    
                    {/* Video Controls Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-14 w-14 rounded-full bg-white/90 hover:bg-white text-black"
                          onClick={() => handlePlayPause(video.id)}
                        >
                          {isPlaying[video.id] ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6 ml-1" />
                          )}
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-white/90 hover:bg-white text-black"
                          onClick={() => handleMuteToggle(video.id)}
                        >
                          {isMuted[video.id] ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Play button when not playing */}
                    {!isPlaying[video.id] && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={() => handlePlayPause(video.id)}
                      >
                        <div className="h-20 w-20 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center transition-colors">
                          <Play className="h-8 w-8 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                    <p className="text-muted-foreground">{video.description}</p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Demo Journey Link */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            Want to see the full user experience? Try our interactive demo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/demo-journey">
                See Live Demo
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/case-analysis">
                Start Your Case
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
