"use client";

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import Toggle from './Toggle';

interface RHFControlProps {
    control: 'input' | 'textarea' | 'select' | 'toggle';
    name: string;
    label?: string;
    placeholder?: string;
    helperText?: string;
    icon?: React.ReactNode;
    options?: { label: string; value: string | number }[];
    type?: string;
    className?: string;
    disabled?: boolean;
}

const RHFControl: React.FC<RHFControlProps> = ({ 
    control, 
    name, 
    label, 
    placeholder, 
    helperText, 
    icon, 
    options = [], 
    type = 'text',
    className,
    disabled
}) => {
    const { control: formControl } = useFormContext();

    return (
        <Controller
            name={name}
            control={formControl}
            render={({ field, fieldState: { error } }) => {
                switch (control) {
                    case 'input':
                        return (
                            <Input
                                {...field}
                                label={label}
                                placeholder={placeholder}
                                icon={icon}
                                type={type}
                                error={error?.message}
                                className={className}
                                disabled={disabled}
                            />
                        );
                    case 'textarea':
                        return (
                            <Textarea
                                {...field}
                                label={label}
                                placeholder={placeholder}
                                icon={icon}
                                error={error?.message}
                                className={className}
                                disabled={disabled}
                            />
                        );
                    case 'select':
                        return (
                            <Select
                                {...field}
                                label={label}
                                icon={icon}
                                options={options}
                                error={error?.message}
                                className={className}
                                disabled={disabled}
                            />
                        );
                    case 'toggle':
                        return (
                            <Toggle
                                enabled={field.value}
                                setEnabled={field.onChange}
                                label={label}
                                description={helperText}
                            />
                        );
                    default:
                        return <></>;
                }
            }}
        />
    );
};

export default RHFControl;
