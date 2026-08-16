import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChatLoadingSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col animate-pulse">
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Header Skeleton */}
        <div className="flex items-center gap-3 pb-4 border-b">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Messages Skeleton */}
        <div className="flex-1 py-4 space-y-4">
          {/* Bot message */}
          <div className="flex gap-3 justify-start">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="max-w-[80%]">
              <Skeleton className="h-20 w-full rounded-lg mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* User message */}
          <div className="flex gap-3 justify-end">
            <div className="max-w-[80%]">
              <Skeleton className="h-12 w-full rounded-lg mb-1" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          </div>

          {/* Bot message */}
          <div className="flex gap-3 justify-start">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="max-w-[80%]">
              <Skeleton className="h-24 w-full rounded-lg mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>

        {/* Input Skeleton */}
        <div className="flex gap-2 pt-4 border-t">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="w-10 h-10" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TypingIndicator({ language }: { language: 'en' | 'es' }) {
  const text = {
    en: "Justice Bot USA is thinking",
    es: "Justice Bot USA está pensando"
  };

  return (
    <div className="flex gap-3 justify-start animate-fade-in">
      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0">
        <div className="w-4 h-4 bg-primary/60 rounded-full animate-pulse" />
      </div>
      <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%]">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">{text[language]}</span>
          <div className="flex gap-1 ml-2">
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}