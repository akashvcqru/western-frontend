import React, { forwardRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ placeholder = 'Search...', className, wrapperClassName, ...props }, ref) => {
        return (
            <div className={cn("relative w-full", wrapperClassName)}>
                <Search 
                    size={16} 
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
                />
                <input
                    ref={ref}
                    type="text"
                    placeholder={placeholder}
                    className={cn(
                        "w-full pl-10 pr-4 py-2.5 bg-white dark:bg-card border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
