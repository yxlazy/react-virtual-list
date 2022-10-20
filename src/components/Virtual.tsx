import React, { Key, useEffect, useRef, useState } from 'react';
import { useScroll } from './hooks';
import Item, { __DEFAULT_HEIGHT__ } from './Item';
import { VirtualItemRef, VirtualProps } from './types';

const Virtual = ({ dataSource, children, uniquekKey, height }: VirtualProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<VirtualItemRef>(null);
  const [top, setTop] = useState(0);
  const [data, offset] = useScroll({
    originData: (dataSource || []) as any[],
    height: height || __DEFAULT_HEIGHT__,
    node: nodeRef.current!,
    top,
  });

  useEffect(() => {
    if (nodeRef.current) {
      const { top } = nodeRef.current.getBoundingClientRect();

      setTop(top);
    }
  }, []);

  return (
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
  );
};

export default Virtual;
