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
    implementationPrice: string;
    prices: {
        monthly: string;
        semiannual: string;
        annual: string;
    };
    desc: string;
    devFeatures: string[];
    membershipFeatures: string[];
    highlight: boolean;
    disclaimer?: string;
    cta?: string;
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