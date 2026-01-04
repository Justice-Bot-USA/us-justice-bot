import { Play } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VideoShowcase = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videos = [
    {
      id: "housing",
      title: "Housing Court",
      description: "Learn how to file a housing complaint with your local court"
    },
    {
      id: "small-claims",
      title: "Small Claims Court",
      description: "Step-by-step guide to filing a small claims case"
    },
    {
      id: "eeoc",
      title: "EEOC Complaints",
      description: "How to file a workplace discrimination complaint"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See US Justice Bot in Action</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch these video guides to see how easy it is to get legal help and navigate your case.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="housing" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {videos.map((video) => (
                <TabsTrigger key={video.id} value={video.id}>
                  {video.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {videos.map((video) => (
              <TabsContent key={video.id} value={video.id}>
                <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    {/* Placeholder for video */}
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                        <Play className="h-10 w-10 text-primary ml-1" />
                      </div>
                      <p className="text-muted-foreground">{video.title} Tutorial</p>
                    </div>
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

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Ready to start your own case? It takes less than 5 minutes.</p>
          <Button asChild size="lg">
            <Link to="/case-analysis">Start Your Case</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
