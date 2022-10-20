import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { VirtualItemProps } from './types';

export const __DEFAULT_HEIGHT__ = 40;

const Item = forwardRef(({ children, height, className }: VirtualItemProps, ref) => {
  const itemRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(
    ref,
    () => {
      return {
        getHeight() {
          if (itemRef.current) {
            const { height: itemHeight } = itemRef.current.getBoundingClientRect();
            return itemHeight;
          }
          return __DEFAULT_HEIGHT__;
        },
      };
    },
    []
  );

  return (
    <div ref={itemRef} style={{ height: `${height || __DEFAULT_HEIGHT__}px` }} className={className}>
      {children}
    </div>
  );
});

export default Item;
