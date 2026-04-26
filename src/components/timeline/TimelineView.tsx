import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { ELECTION_PHASES } from "@/data/electionPhases";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import * as Icons from "lucide-react";

export function TimelineView() {
  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent" role="list" aria-label="Election process timeline">
      {ELECTION_PHASES.map((phase, index) => {
        const Icon = (Icons as any)[phase.icon] || Circle;
        
        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}
            role="listitem"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <Icon className="w-5 h-5 text-primary" />
            </div>

            {/* Content */}
            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 shadow-sm border-muted/60 transition-colors hover:border-primary/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold">
                    Phase {index + 1}
                  </Badge>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock size={12} />
                    {phase.duration}
                  </div>
                </div>
                <CardTitle className="text-lg">{phase.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">{phase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {phase.steps.map((step, sIndex) => (
                    <div key={sIndex} className="flex items-start gap-2 text-xs text-muted-foreground group/step">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary/40 group-hover/step:text-primary transition-colors" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
