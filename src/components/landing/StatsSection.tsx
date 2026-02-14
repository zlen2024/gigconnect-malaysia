import { motion } from "framer-motion";

const stats = [
  { value: "50k+", label: "Verified Students" },
  { value: "12k+", label: "Jobs Completed" },
  { value: "25+", label: "Universities" },
  { value: "RM 2M+", label: "Student Earnings" },
];

export function StatsSection() {
  return (
    <section className="bg-gradient-to-br from-primary/80 to-primary-glow/80 backdrop-blur-sm py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl font-black text-primary-foreground mb-2">{stat.value}</div>
            <div className="text-primary-foreground/60 font-medium text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
