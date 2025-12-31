import { Info } from 'lucide-react';

const Disclaimer = () => {
  return (
    <footer className="border-t border-border bg-card/50 px-4 py-4 mt-8">
      <div className="container mx-auto flex items-center gap-3 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0" />
        <p><strong className="text-foreground">Not medical advice.</strong> MindPulse is a wellness tool. Please consult professionals for mental health support.</p>
      </div>
    </footer>
  );
};

export default Disclaimer;
