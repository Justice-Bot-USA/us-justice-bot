import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, FolderOpen, GraduationCap, type LucideIcon } from "lucide-react";
import ToolkitLayout from "@/components/toolkit/ToolkitLayout";
import LockedFeature from "@/components/toolkit/LockedFeature";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToolkitAccess } from "@/hooks/useToolkitAccess";
import { DATES_ARE_YOURS, TOOLKIT_FEATURES } from "@/lib/billingDisclosure";
import { countToolkitItems, toolkitKeys } from "@/lib/toolkit/api";
import { signInPath } from "@/lib/signIn";

interface ToolCard {
  /** Index into TOOLKIT_FEATURES (the plan's feature lines, word for word). */
  feature: number;
  to: string;
  open: string;
  icon: LucideIcon;
  /** What anyone can do without a plan. Must match the database rules. */
  free: string;
  /** What needs the plan. */
  paid: string;
  count: (c: { files: number; calendarEvents: number; classTrackers: number }) => string;
}

const TOOLS: ToolCard[] = [
  {
    feature: 0,
    to: "/toolkit/binder",
    open: "Open case binder",
    icon: FolderOpen,
    free: "Upload, view, rename, organize, download and delete your files.",
    paid: "Make a binder PDF.",
    count: (c) => (c.files === 1 ? "You have 1 file." : `You have ${c.files} files.`),
  },
  {
    feature: 1,
    to: "/toolkit/calendar",
    open: "Open hearing calendar",
    icon: CalendarDays,
    free: "See, change and delete dates you saved, and download your calendar file.",
    paid: "Add new dates.",
    count: (c) => (c.calendarEvents === 1 ? "You have 1 saved date." : `You have ${c.calendarEvents} saved dates.`),
  },
  {
    feature: 2,
    to: "/toolkit/classes",
    open: "Open class tracker",
    icon: GraduationCap,
    free: "See, change and delete class records you saved, and download them as a PDF.",
    paid: "Add new class records and sessions.",
    count: (c) => (c.classTrackers === 1 ? "You have 1 class record." : `You have ${c.classTrackers} class records.`),
  },
];

/** Splits "Case binder: one PDF of…" into the name and the rest, keeping the words exactly. */
function splitFeature(line: string): { name: string; text: string } {
  const at = line.indexOf(": ");
  if (at < 0) return { name: line, text: "" };
  const text = line.slice(at + 2);
  return { name: line.slice(0, at), text: text.charAt(0).toUpperCase() + text.slice(1) };
}

export default function ToolkitHub() {
  const { user } = useAuth();
  const access = useToolkitAccess();
  const userId = user?.id;

  // Counts only (no titles or names). Hidden if they can't be loaded.
  const counts = useQuery({
    queryKey: toolkitKeys.counts(userId),
    queryFn: () => countToolkitItems(userId as string),
    enabled: Boolean(userId),
    staleTime: 30_000,
    retry: false,
  });

  return (
    <ToolkitLayout
      title="My Toolkit"
      description="The Justice Bot USA Toolkit: a case binder for your own files, a hearing calendar for dates you type in, and a class tracker."
      intro="Keep your case organized: your files, your court dates, and the classes you were told to take."
      requireSignIn={false}
      backLink={null}
      noIndex={false}
    >
      <div className="space-y-6">
        {!user && access.status !== "loading" && (
          <Card>
            <CardContent className="space-y-3 pt-6">
              <h2 className="text-lg font-semibold">Sign in to open your Toolkit</h2>
              <p className="text-base">
                Your files, dates and class records are private to your account. Sign in, or create a free account, to
                use them.
              </p>
              <Button asChild className="min-h-11 w-full sm:w-auto">
                <Link to={signInPath("/toolkit")}>Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {user && access.status === "none" && <LockedFeature feature="toolkit" />}

        <div className="grid gap-4 md:grid-cols-3">
          {TOOLS.map((tool) => {
            const { name, text } = splitFeature(TOOLKIT_FEATURES[tool.feature]);
            const Icon = tool.icon;
            return (
              <Card key={tool.to} className="flex flex-col">
                <CardHeader className="pb-3">
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    {name}
                  </h2>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3 text-base">
                  <p>{text}</p>
                  <p>
                    <span className="font-semibold">Free:</span> {tool.free}
                  </p>
                  <p>
                    <span className="font-semibold">With the Toolkit plan:</span> {tool.paid}
                  </p>
                  {user && counts.data && <p className="text-muted-foreground">{tool.count(counts.data)}</p>}
                  <div className="mt-auto pt-2">
                    <Button asChild variant="outline" className="min-h-11 w-full">
                      <Link to={tool.to}>{tool.open}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="rounded-lg border bg-muted/40 p-4 text-base">{DATES_ARE_YOURS}</p>

        <p className="text-base">
          Court forms and guides stay free.{" "}
          <Link to="/forms-library" className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4">
            Find a court form
          </Link>
        </p>
      </div>
    </ToolkitLayout>
  );
}
