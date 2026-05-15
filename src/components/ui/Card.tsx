import React from 'react';
import type { ReactNode } from 'react';

// --- Card Container ---
export interface CardProps {
    children: ReactNode;
    className?: string; // Allows for custom width or margin overrides
    style?: React.CSSProperties;
}

const CardContainer: React.FC<CardProps> = ({ children, className = '', style }) => {
    return (
        <div 
            className={`bg-white dark:bg-card rounded-xl border-2 border-gray-100 dark:border-white/10 overflow-hidden ${className}`}
            style={style}
        >
            {children}
        </div>
    );
};

// --- Card Header ---
export interface CardHeaderProps {
    children: ReactNode;
    className?: string;
    borderBottom?: boolean; // Optional separator line
    style?: React.CSSProperties;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', borderBottom = true, style }) => {
    return (
        <div 
            className={`px-6 py-4 flex items-center justify-between ${borderBottom ? 'border-b border-gray-100 dark:border-white/10' : ''} ${className}`}
            style={style}
        >
            {typeof children === 'string' ? (
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{children}</h3>
            ) : (
                children
            )}
        </div>
    );
};

// --- Card Body ---
export interface CardBodyProps {
    children: ReactNode;
    className?: string;
    noPadding?: boolean; // Useful if body contains a full-width image or list
}

const CardBody: React.FC<CardBodyProps> = ({ children, className = '', noPadding = false }) => {
    return (
        <div className={`${noPadding ? '' : 'p-6'} ${className}`}>
            {children}
        </div>
    );
};

// --- Card Footer ---
export interface CardFooterProps {
    children: ReactNode;
    className?: string;
    borderTop?: boolean; // Optional separator line
    mutedBackground?: boolean; // Subtle gray background for footer
    noPadding?: boolean; // Useful if footer contains full-width elements
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', borderTop = true, mutedBackground = false, noPadding = false }) => {
    return (
        <div className={`${noPadding ? '' : 'px-6 py-4'} flex items-center gap-3 ${borderTop ? 'border-t border-gray-100 dark:border-white/10' : ''} ${mutedBackground ? 'bg-gray-50/80 dark:bg-white/5' : ''} ${className}`}>
            {children}
        </div>
    );
};

// --- Compound Component Export ---

type CardComponent = React.FC<CardProps> & {
    Header: React.FC<CardHeaderProps>;
    Body: React.FC<CardBodyProps>;
    Footer: React.FC<CardFooterProps>;
};

// Cast the container to the compound type and attach subcomponents
export const Card = CardContainer as CardComponent;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
