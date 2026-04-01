import AverageWidget from "@/components/widgets/average-widget";
import GradesWidget from "@/components/widgets/grades-widget";
import SubjectsWidget from "@/components/widgets/subjects-widget";

export default function Cijfers() {
    return (
        <div className="px-12 py-10 space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black leading-10">Mijn Cijfers</h1>
                    <p className="text-muted-foreground text-base max-w-sm">
                        Bekijk je laatste resultaten, gemiddelden en voortgang
                        per vak in een overzichtelijk dashboard.
                    </p>
                </div>
                <AverageWidget />
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="w-full flex-1 min-w-0 space-y-6">
                    {/* Left column: for widgets with a larger width */}
                    <SubjectsWidget />
                </div>
                <div className="w-full md:max-w-full lg:max-w-sm xl:max-w-lg space-y-6">
                    {/* Right column: for widgets with a small width */}
                    <GradesWidget amount={5} columns={1} />
                </div>
            </div>
        </div>
    );
}
