import { CheckCircle, ThumbsUp, Shield, Star, BadgeCheck } from "lucide-react";

interface TrustBarItem {
  icon: string;
  titel: string;
  beschreibung: string;
}

interface TrustBarProps {
  data: {
    elemente: TrustBarItem[];
  };
}

const iconMap = {
  Shield: Shield,
  CheckCircle: CheckCircle,
  Star: Star,
  ThumbsUp: ThumbsUp,
  BadgeCheck: BadgeCheck,
};

export default function Trust({ data }: TrustBarProps) {
  const { elemente } = data;
  
  return (
    <section className="px-4 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-4">
        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-10 gap-6 py-4">
          {elemente.map((item, index) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Shield;
            
            return (
              <div key={index} className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="flex-shrink-0">
                  <IconComponent className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{item.titel}</h3>
                  <p className="text-xs text-gray-600">{item.beschreibung}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
