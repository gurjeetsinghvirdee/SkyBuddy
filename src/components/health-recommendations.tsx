import type { AirQualityData, UVIndexData } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle, Cloud, Leaf, Sun, Wind } from "lucide-react";

interface HealthRecommendationsProps {
  airQuality?: AirQualityData;
  uvIndex?: UVIndexData;
  isLoading?: boolean;
}

interface Recommendation {
  category: string;
  level: "safe" | "moderate" | "high";
  value: string;
  recommendation: string;
  icon: typeof Cloud;
  emoji: string;
}

const HealthRecommendations = ({
  airQuality,
  uvIndex,
  isLoading,
}: HealthRecommendationsProps) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Health Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-gray-200 rounded-md" />
        </CardContent>
      </Card>
    );
  }

  const getAirQualityLevel = (aqi?: number): Recommendation["level"] => {
    if (!aqi) return "safe";
    if (aqi <= 2) return "safe";
    if (aqi <= 3) return "moderate";
    return "high";
  };

  const getAirQualityText = (aqi?: number): string => {
    if (!aqi) return "Good";
    const levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    return levels[aqi - 1] || "Unknown";
  };

  const getAirQualityRecommendation = (aqi?: number): string => {
    if (!aqi || aqi <= 2) return "Air quality is good. Great day for outdoor activities!";
    if (aqi === 3) return "Limit outdoor exertion if sensitive";
    return "Avoid prolonged outdoor activities";
  };

  const getUVLevel = (uv?: number): Recommendation["level"] => {
    if (!uv) return "safe";
    if (uv < 3) return "safe";
    if (uv < 6) return "moderate";
    return "high";
  };

  const getUVText = (uv?: number): string => {
    if (!uv) return "Low";
    if (uv < 3) return "Low";
    if (uv < 6) return "Moderate";
    if (uv < 8) return "High";
    if (uv < 11) return "Very High";
    return "Extreme";
  };

  const getUVRecommendation = (uv?: number): string => {
    if (!uv || uv < 3) return "Minimal risk. Enjoy outdoor activities!";
    if (uv < 6) return "Use SPF 15+, wear sunglasses";
    if (uv < 8) return "Use SPF 30+, wear hat, seek shade";
    return "Use SPF 50+, minimize sun exposure, stay in shade";
  };

  // Simulated pollen data based on season (in real app, would come from API)
  const getPollenData = (): Recommendation[] => {
    const month = new Date().getMonth();
    const isSpring = month >= 2 && month <= 4;
    const isSummer = month >= 5 && month <= 7;
    
    return [
      {
        category: "Tree Pollen",
        level: isSpring ? "moderate" : "safe",
        value: isSpring ? "Moderate (2)" : "Low (1)",
        recommendation: isSpring
          ? "Sensitive individuals should limit outdoor time"
          : "Minimal risk",
        icon: Leaf,
        emoji: "🌳",
      },
      {
        category: "Grass Pollen",
        level: isSummer ? "moderate" : "safe",
        value: isSummer ? "Moderate (2)" : "Low (1)",
        recommendation: isSummer
          ? "Consider staying indoors during peak hours"
          : "Minimal risk",
        icon: Wind,
        emoji: "🌾",
      },
      {
        category: "Weed Pollen",
        level: "safe",
        value: "Low (1)",
        recommendation: "Minimal risk",
        icon: Wind,
        emoji: "🌿",
      },
    ];
  };

  const aqi = airQuality?.list?.[0]?.main?.aqi;
  const uv = uvIndex?.value;

  const recommendations: Recommendation[] = [
    {
      category: "Air Quality",
      level: getAirQualityLevel(aqi),
      value: `${getAirQualityText(aqi)}${aqi ? ` (${aqi})` : ""}`,
      recommendation: getAirQualityRecommendation(aqi),
      icon: Cloud,
      emoji: "🌫️",
    },
    {
      category: "UV Index",
      level: getUVLevel(uv),
      value: `${getUVText(uv)}${uv ? ` (${uv.toFixed(1)})` : ""}`,
      recommendation: getUVRecommendation(uv),
      icon: Sun,
      emoji: "☀️",
    },
    ...getPollenData(),
  ];

  const getLevelColor = (level: Recommendation["level"]) => {
    switch (level) {
      case "safe":
        return "text-green-500 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900";
      case "moderate":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900";
      case "high":
        return "text-red-500 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900";
    }
  };

  const getLevelEmoji = (level: Recommendation["level"]) => {
    switch (level) {
      case "safe":
        return "🟢";
      case "moderate":
        return "🟡";
      case "high":
        return "🔴";
    }
  };

  const getLevelBar = (level: Recommendation["level"]) => {
    const segments = 5;
    const filled = level === "high" ? 4 : level === "moderate" ? 3 : 2;
    
    return (
      <div className="flex gap-0.5 h-2">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm ${
              i < filled
                ? level === "high"
                  ? "bg-red-500"
                  : level === "moderate"
                  ? "bg-yellow-500"
                  : "bg-green-500"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Health Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec) => (
            <div
              key={rec.category}
              className={`rounded-lg border p-4 transition-all hover:shadow-md ${getLevelColor(
                rec.level
              )}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{rec.emoji}</span>
                  <rec.icon className="h-4 w-4" />
                </div>
                <span className="text-lg">{getLevelEmoji(rec.level)}</span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-semibold">{rec.category}</p>
                  <p className="text-xs font-medium mt-1">{rec.value}</p>
                </div>
                
                {getLevelBar(rec.level)}
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rec.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthRecommendations;
