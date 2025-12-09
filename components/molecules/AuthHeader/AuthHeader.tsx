import { H2, P } from '@/components/atoms/Typography/Typography';

interface AuthHeaderProps {
    title: string;
    subtitle: string;
    className?: string;
}

export const AuthHeader = ({ title, subtitle, className }: AuthHeaderProps) => {
    return (
        <div className={`text-center mb-8 ${className}`}>
            <H2 className="text-gray-900 mb-2">{title}</H2>
            <P className="text-gray-500 text-sm">{subtitle}</P>
        </div>
    );
};
