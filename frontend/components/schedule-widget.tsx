import { CalendarDays, GraduationCap } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

export default function ScheduleWidget() {
    const schedule = [
        { vak: "Geschiedenis", tijd: "08:30-09:30", lokaal: "2.04" },
        { vak: "Wiskunde D", tijd: "09:30-10:30", lokaal: "1.12" },
        { vak: "Frans", tijd: "11:00-12:00", lokaal: "3.15" },
        { vak: "Lichamelijke Opv.", tijd: "13:30-15:00", lokaal: "Gymzaal B" },
    ];

    return (
        <Card className="bg-[#19191c] w-full">
            <CardHeader>
                <CardTitle className="text-lg font-bold leading-7">
                    Rooster van vandaag
                </CardTitle>
                <CardContent className="mt-6 mb-4">
                    <ul className="relative isolate space-y-8 before:absolute before:left-5 before:top-5 before:bottom-5 before:z-0 before:w-px before:bg-white/10">
                        {schedule.map((item, key) => (
                            <li
                                key={key}
                                className="relative z-10 flex justify-between"
                            >
                                <div className="flex gap-4 items-center">
                                    <div className="relative z-10 bg-linear-to-bl from-primary to-primary/50 rounded-lg p-2 text-black">
                                        <GraduationCap size={25} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold leading-5">
                                            {item.vak}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-normal uppercase leading-4 tracking-wide">
                                            {item.tijd} &#x2022; {item.lokaal}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="bg-transparent">
                    <Button variant="secondary" className="w-full py-6 mt-2">
                        <CalendarDays />{" "}
                        <span className="font-bold leading-4">
                            Volledig rooster bekijken
                        </span>
                    </Button>
                </CardFooter>
            </CardHeader>
        </Card>
    );
}
