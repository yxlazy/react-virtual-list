import { useCallback, useEffect, useRef, useState } from 'react';
import type { Scroll, ScrollParams, ViewportSize } from './types';

/**
 * Get viewport's height and width
 * @returns
 */
export const useViewport = (): ViewportSize => {
  const [width, setWidth] = useState(0),
    [height, setHeight] = useState(0);

  const calcViewport = useCallback(() => {
    const clientHeight = document.documentElement.clientHeight || document.body.clientHeight,
      clientWidth = document.documentElement.clientWidth || document.body.clientWidth;

    setHeight(clientHeight);
    setWidth(clientWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', calcViewport);

    return () => window.removeEventListener('resize', calcViewport);
  }, []);

  // 初始化
  useEffect(() => {
    calcViewport();
  }, [calcViewport]);

  return { height, width };
};

export const useScrollTop = <T extends Element | null>(node?: T) => {
  // 滚动的距离
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setHeight] = useState(0);

  const calcScrollTop = useCallback(() => {
    if (node) {
      setScrollTop(node.scrollTop);
      setHeight(node.scrollHeight);
    } else {
      setScrollTop(document.documentElement.scrollTop || document.body.scrollTop);
      setHeight(document.documentElement.scrollHeight || document.body.scrollHeight);
    }
  }, [node]);

  const calcScrollTopRef = useRef(calcScrollTop);
  calcScrollTopRef.current = calcScrollTop;

  useEffect(() => {
    window.addEventListener('scroll', calcScrollTop);

    return () => window.removeEventListener('scroll', calcScrollTop);
  }, [calcScrollTop]);

  // init
  useEffect(() => {
    calcScrollTopRef.current();
  }, []);

  return [scrollTop, scrollHeight];
};

export const useScroll = <T extends Record<string, unknown>, U extends Element | null>({
  originData,
  height,
  node,
  scrollCantainer,
}: ScrollParams<T, U>) => {
  const viewport = useViewport();
  const [scrollTop, scrollHeight] = useScrollTop(scrollCantainer ? node : window.document.documentElement);
  const { top: initTop = 0 } = useNodeInitRect(node);
  const [offset, setOffset] = useState(0);
  // 实际渲染的数据
  const [data, setData] = useState<Array<Record<string, unknown>>>([]);
  // 渲染所有元素总的高度
  const allHeightRef = useRef(0);

  const setContainerHeight = () => {
    const h = height === 0 ? 1 : height;

    allHeightRef.current = originData.length * h;
    // 设置高度
    window.document.documentElement.style.height = `${allHeightRef.current}px`;
  };

  const calcViewportData = useCallback(() => {
    const h = height === 0 ? 1 : height;
    // 当前视口能展示的元素个数
    const showNum = Math.ceil(viewport.height / h);
    // 隐藏元素个数
    let start = Math.floor((scrollTop - initTop) / h),
      end;

    start = start < 0 ? 0 : start;
    end = start + showNum;

    if (scrollTop <= initTop) {
      setOffset(0);
    } else if (scrollTop > initTop && scrollTop < scrollHeight - viewport.height) {
      setOffset(scrollTop - initTop);
    }

    setData(originData.slice(start, end));
  }, [originData, height, viewport.height, scrollTop, initTop, scrollHeight]);

  useEffect(() => {
    window.addEventListener('scroll', calcViewportData);

    return () => window.removeEventListener('scroll', calcViewportData);
  }, [calcViewportData]);

  // 初始化
  useEffect(() => {
    calcViewportData();
    setContainerHeight();
  }, [calcViewportData]);

  return { data, offset, allHeight: allHeightRef.current } as Scroll;
};

export const useLatest = (v: any) => {
  const latestRef = useRef(v);
  latestRef.current = v;
  return latestRef.current;
};

export const useNodeInitRect = (node: Element | null) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (node) {
      const rect = node.getBoundingClientRect();

      setRect(rect);
    }
  }, [node]);
  return (rect || {}) as DOMRect;
};
