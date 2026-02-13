import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const useScrollReveal = (threshold = 0.15) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: threshold });
    return { ref, isInView };
};

export const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

export const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export const scaleInVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
};

export const slideLeftVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
};

export const slideRightVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
};

export const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};
