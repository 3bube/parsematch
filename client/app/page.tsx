import { ResumeParser } from "@/components/ResumeParser";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50 ">
      <div className="container w-full   py-10 space-y-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            ParseMatch
          </h1>
          <p className="mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px]">
            Upload candidates&apos; resumes and match them against your job
            criteria to find the best candidates.
          </p>
          <p className="mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px]">
            $5 per use🔜
          </p>
        </div>
        <ResumeParser />
      </div>
    </main>
  );
}
