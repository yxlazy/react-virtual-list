import { ReactElement } from 'react';

export interface Data {
  value: ReactElement;
  id?: string | number;
  [k: string]: unknown;
}
export interface VirtualProps {
  dataSource?: Data[];
  children?: ReactElement;
  uniquekKey?: string;
  height?: number;
}

export interface VirtualItemProps {
  children?: ReactElement;
  height?: number;
  className?: string;
}

export interface VirtualItemRef {
  height: number;
}

export interface ViewportSize {
  height: number;
  width: number;
}

export interface ScrollParams<T extends Record<string, unknown>, U extends Element | null> {
  originData: Array<T>;
  height: number;
  node: U;
  top: number;
}
