import type * as React from 'react';

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: Record<string, string>;
  };
};

export type ChartContextProps = {
  config: ChartConfig;
};

export type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
  id?: string;
  className?: string;
  children?: React.ReactNode;
};

export type ChartStyleProps = {
  id: string;
  config: ChartConfig;
};

export type ChartTooltipContentProps = {
  active?: boolean;
  payload?: any[];
  className?: string;
  indicator?: 'dot' | 'line' | 'dashed';
  hideLabel?: boolean;
  hideIndicator?: boolean;
  label?: string;
  labelFormatter?: (value: any, payload: any[]) => React.ReactNode;
  labelClassName?: string;
  formatter?: (value: any, name: any, item: any, index: number, payload: any) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
};

export type ChartLegendContentProps = {
  className?: string;
  hideIcon?: boolean;
  payload?: any[];
  verticalAlign?: 'top' | 'bottom';
  nameKey?: string;
};
