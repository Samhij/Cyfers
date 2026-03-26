import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function StudentInfoWidget({ student }: { student: {} }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Studentinformatie</CardTitle>
                <CardDescription>Gegevens zoals geregistreerd in het leerlingsysteem.</CardDescription>
            </CardHeader>
        </Card>
    );
}