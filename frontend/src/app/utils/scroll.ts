const refreshRate = 10;

export function animatedScrollByElement(element: HTMLElement, to: number, duration = 200) {
  if (duration <= 0) {return; }
  const difference = to - element.scrollTop;
  const perTick = difference / duration * refreshRate;

  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) { return; }
    animatedScrollByElement(element, to, duration - refreshRate);
  }, refreshRate);
}

export function animatedScrollByWindow(to = 0, cb?: () => any, duration = 200, from = window.pageYOffset) {
  if (duration <= 0) {return cb ? cb() : null; }
  const difference = to - from;
  const perTick = difference / duration * refreshRate;
  window.scrollTo(0, from + perTick);
  setTimeout(() => {
    if (from === to) { return cb ? cb() : null; }
    animatedScrollByWindow(to, cb, duration - refreshRate, from + perTick);
  }, refreshRate);
}
