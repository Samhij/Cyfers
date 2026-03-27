import { User } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";

export default function StudentInfoWidget({
    student,
}: {
    student: {
        roepnaam: string;
        achternaam: string;
        leerlingnummer: string;
        geboortedatum: string;
    };
}) {
    return (
        student && (
            <Card className="bg-[#19191c] px-4 py-6">
                <CardHeader className="space-y-1">
                    <CardTitle className="flex justify-between items-center text-2xl font-bold">
                        Studentinformatie
                        <User className="text-muted-foreground size-8" />
                    </CardTitle>
                    <CardDescription className="text-sm">
                        Gegevens zoals geregistreerd in het leerlingsysteem.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 grid-rows-2 space-y-10 mt-6">
                    <div className="space-y-2">
                        <h2 className="text-muted-foreground text-sm font-bold uppercase tracking-wide">
                            Volledige naam
                        </h2>
                        <p className="text-lg font-semibold">
                            {student.roepnaam} {student.achternaam}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-muted-foreground text-sm font-bold uppercase tracking-wide">
                            Leerlingnummer
                        </h2>
                        <p className="text-lg font-semibold">
                            {student.leerlingnummer}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-muted-foreground text-sm font-bold uppercase tracking-wide">
                            Geboortedatum
                        </h2>
                        <p className="text-lg font-semibold">
                            {student.geboortedatum}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-muted-foreground text-sm font-bold uppercase tracking-wide">
                            Stamklas
                        </h2>
                        <p className="text-lg font-semibold">-</p>
                    </div>
                </CardContent>
            </Card>
        )
    );
}
