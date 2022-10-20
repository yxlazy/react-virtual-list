import { useCallback, useEffect, useRef, useState } from 'react';
import type { Data, ScrollParams, ViewportSize } from './types';

/**
 * Get viewport's height and width
 * @returns
 */
export const useViewport = (): ViewportSize => {
  const [width, setWidth] = useState(0),
    [height, setHeight] = useState(0);

  const calcViewport = useCallback(() => {
    const { clientHeight, clientWidth } = document.documentElement;

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

export const useScrollTop = <T extends Element | null>(node: T) => {
  // 滚动的距离
  const [scrollTop, setScrollTop] = useState(0);

  const calcScrollTop = useCallback(() => {
    if (node) {
      setScrollTop(document.documentElement.scrollTop);
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

  return scrollTop;
};

export const useScroll = <T extends Record<string, unknown>, U extends Element | null>({
  originData,
  height,
  node,
  top,
}: ScrollParams<T, U>) => {
  const viewport = useViewport();
  const scrollTop = useScrollTop(node);
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
    const start = Math.floor(scrollTop / h),
      end = start + showNum;

    if (end === showNum) {
      setOffset(0);
    } else if (end > showNum && end < originData.length) {
      setOffset(scrollTop - top);
    } else if (end >= originData.length) {
      setOffset(scrollTop - h - top);
    }
    setData(originData.slice(start, end));
  }, [originData, height, viewport.height, scrollTop, top]);

  useEffect(() => {
    window.addEventListener('scroll', calcViewportData);

    return () => window.removeEventListener('scroll', calcViewportData);
  }, [calcViewportData]);

  // 初始化
  useEffect(() => {
    calcViewportData();
    setContainerHeight();
  }, [calcViewportData]);

  return [data, offset] as [Array<Data>, number];
};

export const useLatest = (v: any) => {
  const latestRef = useRef(v);
  latestRef.current = v;
  return latestRef.current;
};
