
interface DefaultLayoutProps {
    activateMetadata?: boolean;
    children: React.ReactNode;
    title?: string;
    description?: string;
    category?: string;
    openGraph?: {
        title: string;
        description: string;
    };
    applicationName?: string;
    robots?: string;
}

export default DefaultLayoutProps;

