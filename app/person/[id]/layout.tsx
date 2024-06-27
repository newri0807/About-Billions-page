import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "%s | About Billionaires",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
