import { Cat, Star } from "lucide-react";

export default function HomeAnimations() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Cat className="w-12 h-12 text-secondary animate-pulse" />
          <Star className="w-6 h-6 text-accent absolute top-0 -right-4 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold font-serif bg-gradient-to-r from-secondary via-foreground to-secondary bg-clip-text text-transparent pb-2">
        고양이 점술관
      </h1>
      <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto break-keep">
        별빛이 흐르는 밤, 냥이가 점을 봐드린다냥.
      </p>
    </div>
  );
}
