import { Shield, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const MoneyBackGuarantee = () => {
  return (
    <div className="space-y-6">
      {/* Trust + Boundaries */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-center">Trust & Boundaries</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                <CheckCircle className="h-5 w-5" />
                What this is
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• Self-help preparation tools</li>
                <li>• Official sources (state & court sites)</li>
                <li>• Guided steps and checklists</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                What this isn't
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• Not a lawyer or law firm</li>
                <li>• Not legal advice</li>
                <li>• Not a guarantee of outcome</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Money-Back Guarantee */}
      <Card className="border-2 border-green-500/30 bg-green-500/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                30-Day Money-Back Guarantee
              </h3>
              <p className="text-muted-foreground">
                Not satisfied? Get a full refund within 30 days, no questions asked.
              </p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-500 hidden md:block" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoneyBackGuarantee;
