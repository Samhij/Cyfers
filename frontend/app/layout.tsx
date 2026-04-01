import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Cyfers",
    description:
        "Cyfers is een studentenportaal waarmee je cijfers, roosters en persoonlijke academische informatie op één plek kunt bekijken.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
