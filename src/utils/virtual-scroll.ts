export interface IVirtualScrollData<Type> {
  wrapperSize: number;
  wrapperMargin: number;
  visibleItems: {
    data: Type;
    index: number;
  }[];
}

export const getVirtualScrollData = <Type>(
  items: Type[],
  itemSize: number, // width or height
  containerSize: number, // viewport size (width or height)
  scrollPosition: number, // scrollLeft or scrollTop
  nodePadding = 5, // count hidden items behind the viewport
) : IVirtualScrollData<Type> => {
  let startItem = Math.floor(scrollPosition / itemSize) - nodePadding;
  startItem = Math.max(0, startItem);

  let visibleItemsCount = Math.ceil(containerSize / itemSize) + 2 * nodePadding;
  visibleItemsCount = Math.min(items.length - startItem, visibleItemsCount);

  const wrapperMargin = startItem * itemSize;
  const wrapperSize = items.length * itemSize - wrapperMargin;

  const visibleItems = items.map((item, index) => ({
    data: item,
    index,
  })).slice(startItem, startItem + visibleItemsCount);

  return {
    wrapperSize,
    wrapperMargin,
    visibleItems,
  };
};
