import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Propper Proxy',
    description: 'Design system validation API for Figma components',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
