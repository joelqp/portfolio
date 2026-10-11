export function getProfileEntryAnimation(): Animation | null {
  const panel = document.querySelector<HTMLElement>('[data-profile-panel]');
  return panel?.getAnimations().find(
    (animation) => animation.playState !== 'finished' && animation.playState !== 'idle'
  ) ?? null;
}
