import { GraduationCap, MapPin, Award, Medal, Star } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: GraduationCap,
    title: "Verified Onboarding",
    description:
      "Every student profile is verified with an .edu.my email, ensuring a community of genuine Malaysian students.",
    highlight: false,
  },
  {
    icon: MapPin,
    title: "Nearby Discovery",
    description:
      "Find talent or jobs in your immediate vicinity. Perfect for tutoring, repairs, and event support at your campus.",
    highlight: true,
  },
  {
    icon: Award,
    title: "Milestone Badges",
    description:
      "Level up your status. Progress from Newbie to Pro to Expert based on successful project delivery.",
    highlight: false,
    badges: true,
  },
];

export function FeaturesSection() {
  return (
    <section id="about" className="px-4 py-20 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Why SiswaGig?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Built specifically for Malaysian students, with features that set us apart.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`flex flex-col items-center text-center p-8 rounded-3xl transition-all ${
              feature.highlight
                ? "bg-primary/5 border border-primary/10"
                : ""
            }`}
          >
            {feature.badges ? (
              <div className="flex -space-x-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-secondary border-2 border-card flex items-center justify-center shadow-lg">
                  <Medal className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center shadow-lg z-10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div className="w-12 h-12 rounded-full bg-warning/10 border-2 border-card flex items-center justify-center shadow-lg">
                  <Star className="h-5 w-5 text-warning" />
                </div>
              </div>
            ) : (
              <div className={`mb-6 p-5 rounded-full shadow-lg ${
                feature.highlight
                  ? "gradient-primary text-primary-foreground shadow-primary/30"
                  : "bg-card shadow-border/50"
              }`}>
                <feature.icon className={`h-8 w-8 ${feature.highlight ? "" : "text-primary"}`} />
              </div>
            )}

            <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
