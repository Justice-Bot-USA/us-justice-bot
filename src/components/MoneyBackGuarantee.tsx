import { Shield, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const MoneyBackGuarantee = () => {
  return (
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
  );
};

export default MoneyBackGuarantee;
