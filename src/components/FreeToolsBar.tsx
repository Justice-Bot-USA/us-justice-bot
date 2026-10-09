import { Link } from "react-router-dom";

const FreeToolsBar = () => {
  return (
    <div className="bg-muted border-b text-xs md:text-sm">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1 md:gap-3">
          <span className="text-muted-foreground font-medium">Free tools:</span>
          <Link to="/sex-offender-registry" className="text-primary hover:underline">Sex Offender Lookup</Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/usa-forms" className="text-primary hover:underline">Court Form Finder</Link>
        </div>
        <span className="text-muted-foreground italic hidden sm:inline">Not legal advice. Self-help + preparation tools.</span>
      </div>
    </div>
  );
};

export default FreeToolsBar;
