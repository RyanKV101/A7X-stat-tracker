import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { ModalDemo } from "./modal-demo";

export const metadata: Metadata = { title: "Design system - A7X Stat Tracker" };

const swatches: { group: string; colors: { name: string; className: string; hex: string }[] }[] = [
  {
    group: "Ink",
    colors: [
      { name: "ink-950 / background", className: "bg-ink-950", hex: "#0b090a" },
      { name: "ink-900 / surface", className: "bg-ink-900", hex: "#141012" },
      { name: "ink-800 / raised", className: "bg-ink-800", hex: "#1d171a" },
      { name: "ink-700 / border", className: "bg-ink-700", hex: "#2a2125" },
      { name: "ink-600", className: "bg-ink-600", hex: "#4a3c42" },
      { name: "ink-500 / border-strong", className: "bg-ink-500", hex: "#7d6a72" },
    ],
  },
  {
    group: "Bone",
    colors: [
      { name: "bone-50 / foreground", className: "bg-bone-50", hex: "#f3ede4" },
      { name: "bone-300 / muted", className: "bg-bone-300", hex: "#bfb4a9" },
      { name: "bone-400 / subtle", className: "bg-bone-400", hex: "#9a8f86" },
    ],
  },
  {
    group: "Crimson",
    colors: [
      { name: "crimson-300", className: "bg-crimson-300", hex: "#f07a8a" },
      { name: "crimson-400 / danger", className: "bg-crimson-400", hex: "#e5485e" },
      { name: "crimson-500", className: "bg-crimson-500", hex: "#c8203c" },
      { name: "crimson-600", className: "bg-crimson-600", hex: "#b0152f" },
      { name: "crimson-700 / primary", className: "bg-crimson-700", hex: "#8c0f24" },
      { name: "crimson-800", className: "bg-crimson-800", hex: "#5c0a18" },
      { name: "crimson-900", className: "bg-crimson-900", hex: "#2e0710" },
    ],
  },
  {
    group: "Gold",
    colors: [
      { name: "gold-200", className: "bg-gold-200", hex: "#f0e0b0" },
      { name: "gold-300", className: "bg-gold-300", hex: "#e6cf8c" },
      { name: "gold-400 / accent", className: "bg-gold-400", hex: "#d6b456" },
      { name: "gold-500", className: "bg-gold-500", hex: "#c29a2e" },
      { name: "gold-600", className: "bg-gold-600", hex: "#9a7a22" },
      { name: "gold-700", className: "bg-gold-700", hex: "#6e5718" },
      { name: "gold-900", className: "bg-gold-900", hex: "#261e0a" },
    ],
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-h2 text-foreground">{title}</h2>
        <div className="divider-ornament" />
      </div>
      {children}
    </section>
  );
}

/** Dev-only style guide for the theme tokens and base components (#6). */
export default function DesignPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-eyebrow text-gold-400 font-semibold uppercase">Dev only</p>
        <h1 className="text-gold-gradient text-display">Design system</h1>
        <p className="text-muted max-w-2xl">
          Tokens live in <code className="text-gold-300">src/app/globals.css</code> (
          <code className="text-gold-300">@theme</code>), components in{" "}
          <code className="text-gold-300">src/components/ui</code>. This page 404s in production.
        </p>
      </header>

      <Section title="Colors">
        <div className="flex flex-col gap-8">
          {swatches.map((group) => (
            <div key={group.group} className="flex flex-col gap-3">
              <h3 className="text-eyebrow text-subtle font-sans font-semibold uppercase">
                {group.group}
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {group.colors.map((color) => (
                  <div key={color.name} className="flex flex-col gap-2">
                    <div className={`border-border h-16 rounded-md border ${color.className}`} />
                    <div className="text-xs">
                      <p className="text-foreground">{color.name}</p>
                      <p className="text-subtle font-mono">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-5">
          <p className="text-display text-foreground font-display font-bold">Display</p>
          <h1 className="text-h1 text-foreground">Heading 1: Hail to the King</h1>
          <h2 className="text-h2 text-foreground">Heading 2: City of Evil</h2>
          <h3 className="text-h3 text-foreground">Heading 3: Waking the Fallen</h3>
          <p className="text-eyebrow text-gold-400 font-semibold uppercase">Eyebrow label</p>
          <p className="text-foreground max-w-2xl">
            Body text in Inter. Clean and readable at small sizes, so stats tables and quiz
            explanations stay easy to scan while the headings carry the heavy look.
          </p>
          <p className="text-muted max-w-2xl text-sm">Muted text for secondary information.</p>
          <p className="text-subtle max-w-2xl text-sm">Subtle text for hints and metadata.</p>
          <p className="text-gold-gradient font-display text-h2 font-bold">Gold gradient title</p>
        </div>
      </Section>

      <Section title="Radius and shadows">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {["rounded-xs", "rounded-sm", "rounded-md", "rounded-lg", "rounded-xl"].map((r) => (
            <div
              key={r}
              className={`border-border-strong bg-surface text-muted flex h-20 items-center justify-center border text-xs ${r}`}
            >
              {r}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {["shadow-card", "shadow-raised", "shadow-glow-crimson", "shadow-glow-gold"].map((s) => (
            <div
              key={s}
              className={`bg-surface text-muted flex h-24 items-center justify-center rounded-lg text-xs ${s}`}
            >
              {s}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="gold">Hail to the King</Badge>
          <Badge variant="crimson">Hard</Badge>
          <Badge variant="success">Exact</Badge>
          <Badge variant="outline">Estimate</Badge>
        </div>
      </Section>

      <Section title="Card">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Minutes listened</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-display text-gold-300">4,812</p>
            </CardContent>
            <CardFooter>
              <Badge variant="success">Exact</Badge>
              <span className="text-subtle text-xs">Data up to 1 Nov 2026</span>
            </CardFooter>
          </Card>
          <Card interactive>
            <CardHeader>
              <CardTitle>Interactive card</CardTitle>
              <CardDescription>Hover for the gold glow. Used for song cards in #9.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar name="Synyster Gates" />
              <div>
                <p className="text-foreground text-sm">Example content</p>
                <p className="text-subtle text-xs">Secondary line</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Input and Select">
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            id="demo-username"
            label="Username"
            placeholder="m_shadows"
            hint="3-20 characters"
          />
          <Input
            id="demo-email"
            label="Email"
            type="email"
            defaultValue="not-an-email"
            error="Enter a valid email address"
          />
          <Select
            id="demo-difficulty"
            label="Difficulty"
            defaultValue="mixed"
            options={[
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
              { value: "mixed", label: "Mixed" },
            ]}
          />
          <Input id="demo-disabled" label="Disabled" placeholder="Can't touch this" disabled />
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="month">
          <TabsList label="Time range">
            <TabsTrigger value="month">Last month</TabsTrigger>
            <TabsTrigger value="6months">6 months</TabsTrigger>
            <TabsTrigger value="year">Last year</TabsTrigger>
            <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
          </TabsList>
          <TabsContent value="month" className="text-muted">
            Stats for the last month. Use the arrow keys to switch tabs.
          </TabsContent>
          <TabsContent value="6months" className="text-muted">
            Stats for the last 6 months.
          </TabsContent>
          <TabsContent value="year" className="text-muted">
            Stats for the last year.
          </TabsContent>
          <TabsContent value="lifetime" className="text-muted">
            Lifetime stats.
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Modal">
        <ModalDemo />
      </Section>

      <Section title="Avatar">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name="Zacky Vengeance" size="sm" />
          <Avatar name="Johnny Christ" size="md" />
          <Avatar name="m_shadows" size="lg" ring />
          <Avatar name="Broken image" src="/does-not-exist.png" size="xl" />
        </div>
      </Section>
    </main>
  );
}
