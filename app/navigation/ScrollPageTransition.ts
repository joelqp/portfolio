export type PageEdge = 'top' | 'bottom';
export type ScrollDirection = 'forward' | 'backward';

export interface PageTransitionHandle {
  finished: Promise<unknown>;
  skipTransition(): void;
}

interface TransitionActions {
  navigate(pathname: string): void;
  position(edge: PageEdge): void;
  prepare(direction: ScrollDirection): void;
  release(): void;
  start?: (update: () => Promise<void>) => PageTransitionHandle;
}

interface PendingNavigation {
  pathname: string;
  edge: PageEdge;
  committed: boolean;
  requested: boolean;
  resolveCommit: () => void;
  handle?: PageTransitionHandle;
}

/** Coordinates route commits independently of gesture detection and visual effects. */
export class ScrollPageTransition {
  private pending: PendingNavigation | null = null;
  private actions: TransitionActions;

  constructor(actions: TransitionActions) {
    this.actions = actions;
  }

  get busy() {
    return this.pending !== null;
  }

  navigate(pathname: string, direction: ScrollDirection): boolean {
    if (this.pending) return false;

    let resolveCommit!: () => void;
    const committed = new Promise<void>((resolve) => { resolveCommit = resolve; });
    const pending: PendingNavigation = {
      pathname,
      edge: direction === 'forward' ? 'top' : 'bottom',
      committed: false,
      requested: false,
      resolveCommit,
    };
    this.pending = pending;

    if (!this.actions.start) {
      pending.requested = true;
      this.actions.navigate(pathname);
      return true;
    }

    this.actions.prepare(direction);
    let navigationStarted = false;
    const update = async () => {
      if (this.pending !== pending) return;
      navigationStarted = true;
      pending.requested = true;
      this.actions.navigate(pathname);
      await committed;
    };

    try {
      pending.handle = this.actions.start(update);
      // Skipped/failed visual captures still complete the route update.
      pending.handle.finished.then(
        () => this.finish(pending),
        () => this.finish(pending)
      );
    } catch {
      this.actions.release();
      if (!navigationStarted) {
        pending.requested = true;
        this.actions.navigate(pathname);
      }
    }
    return true;
  }

  commit(pathname: string) {
    const pending = this.pending;
    if (!pending) return false;
    if (pathname !== pending.pathname || !pending.requested) {
      this.cancel();
      return false;
    }
    if (pending.committed) {
      this.cancel();
      return false;
    }

    this.actions.position(pending.edge);
    pending.committed = true;
    pending.resolveCommit();
    if (!pending.handle) this.finish(pending);
    return true;
  }

  cancel() {
    const pending = this.pending;
    if (!pending) return;
    this.pending = null;
    pending.resolveCommit();
    pending.handle?.skipTransition();
    this.actions.release();
  }

  private finish(pending: PendingNavigation) {
    if (this.pending !== pending) return;
    this.pending = null;
    pending.resolveCommit();
    this.actions.release();
  }
}
