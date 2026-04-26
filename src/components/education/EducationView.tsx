import { motion } from "framer-motion";
import { BookOpen, Info, ExternalLink, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EDU_MODULES = [
  {
    title: "Voter Eligibility",
    description: "Are you eligible to vote in India?",
    content: "Must be an Indian citizen, 18+ years of age on the qualifying date, and ordinarily resident in the constituency where registering.",
    link: "https://voters.eci.gov.in/",
    icon: ShieldCheck,
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    title: "EVM & VVPAT",
    description: "How your vote is recorded.",
    content: "Votes are cast on an Electronic Voting Machine (EVM). The VVPAT allows you to verify that your vote was cast for the correct candidate.",
    link: "https://www.eci.gov.in/evm-vvpat",
    icon: BookOpen,
    color: "bg-orange-500/10 text-orange-500"
  },
  {
    title: "Voter ID (EPIC)",
    description: "The document needed for identity.",
    content: "The Electors Photo Identity Card (EPIC) is issued by ECI. If you don't have it, you can use 12 alternative documents like Aadhaar or PAN card.",
    link: "https://voters.eci.gov.in/download-epic",
    icon: Info,
    color: "bg-green-500/10 text-green-500"
  }
];

export function EducationView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {EDU_MODULES.map((module, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
            <CardHeader>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${module.color}`}>
                <module.icon size={24} />
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {module.content}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" className="w-full justify-between" asChild>
                <a href={module.link} target="_blank" rel="noopener noreferrer">
                  Learn More
                  <ExternalLink size={16} />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="md:col-span-2 lg:col-span-3"
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Electoral Search</CardTitle>
            <CardDescription>Search for your name in the voter list by State.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {["Maharashtra", "Uttar Pradesh", "Tamil Nadu", "West Bengal"].map(state => (
               <Button key={state} variant="outline" size="sm" asChild>
                 <a href={`https://electoralsearch.eci.gov.in/`} target="_blank" rel="noopener noreferrer">
                   {state}
                 </a>
               </Button>
             ))}
             <Button variant="outline" size="sm" asChild className="opacity-70 italic">
               <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer">
                 Any Other State
               </a>
             </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
