import React, { Key, useEffect, useRef, useState } from 'react';
import { useScroll } from './hooks';
import Item, { __DEFAULT_HEIGHT__ } from './Item';
import { VirtualItemRef, VirtualProps } from './types';

const Virtual = ({ dataSource, children, uniquekKey, height, scrollCantainer }: VirtualProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<VirtualItemRef>(null);

  const { data, offset, allHeight } = useScroll({
    originData: (dataSource || []) as any[],
    height: height || __DEFAULT_HEIGHT__,
    node: nodeRef.current!,
    scrollCantainer,
  });

  return (
    <div style={{ height: `${allHeight}px` }}>
      <div ref={nodeRef} style={{ transform: `translate3d(0, ${offset}px, 0)` }}>
        {dataSource
          ? data.map((data, index) => (
              <Item
                height={height || __DEFAULT_HEIGHT__}
                ref={itemRef}
                key={(data.id != undefined ? data.id : uniquekKey ? data[uniquekKey] : index) as Key}
              >
                {data.value}
              </Item>
            ))
          : children}
      </div>
    </div>
  );
};

export default Virtual;
