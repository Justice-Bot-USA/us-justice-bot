import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface VideoData {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
}

const videos: VideoData[] = [
  {
    id: "housing",
    title: "Housing Court",
    description: "Learn how to file a housing complaint and understand your tenant rights in the US court system.",
    youtubeId: "dQw4w9WgXcQ" // Placeholder - replace with real video IDs
  },
  {
    id: "small-claims",
    title: "Small Claims Court",
    description: "Step-by-step guide to filing a small claims case, from filling out forms to presenting your case.",
    youtubeId: "dQw4w9WgXcQ" // Placeholder - replace with real video IDs
  },
  {
    id: "eeoc",
    title: "EEOC Complaints",
    description: "How to file a workplace discrimination complaint with the Equal Employment Opportunity Commission.",
    youtubeId: "dQw4w9WgXcQ" // Placeholder - replace with real video IDs
  },
  {
    id: "family-law",
    title: "Family Court",
    description: "Understanding family court procedures for custody, child support, and divorce matters.",
    youtubeId: "dQw4w9WgXcQ" // Placeholder - replace with real video IDs
  }
];

const VideoShowcase = () => {
  const [activeTab, setActiveTab] = useState(videos[0].id);

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
                  {/* YouTube Embed */}
                  <div className="aspect-video bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                      title={`${video.title} Tutorial`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
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
          <p className="text-sm text-muted-foreground mt-4">
            Want to learn more about your legal rights?{" "}
            <a 
              href="https://www.youtube.com/@USCourts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Visit US Courts YouTube Channel
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
