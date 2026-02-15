import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ServiceItem {
    icon: LucideIcon;
    title: string;
    desc: string;
}

export interface Project {
    id: number;
    title: string;
    category: string;
    description: string;
    tags: string[];
    image: string;
}

export interface Differentiator {
    icon: LucideIcon;
    title: string;
    desc: string;
    stat?: string;
    statLabel?: string;
}

export interface PricingPlan {
    id: string;
    title: string;
    prices: {
        monthly: string;
        semiannual: string;
        annual: string;
    };
    desc: string;
    features: string[];
    highlight: boolean;
}

export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export interface SectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
}