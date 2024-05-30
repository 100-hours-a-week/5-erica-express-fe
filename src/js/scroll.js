export const getScrollPosition = () => {
  const scrollPosition = document.documentElement.scrollTop;
  return { scrollPosition };
};

export const disableScroll = () => {
  const scrollPosition = getScrollPosition();
  // 스크롤을 막기 위해 body에 스타일을 적용
  document.body.style.overflow = "hidden";
  // 현재 스크롤 위치를 다시 적용하여 화면이 이동하지 않도록 함
  window.scrollTo(scrollPosition);
};

export const enableScroll = () => {
  document.body.style.overflow = "visible";
};
