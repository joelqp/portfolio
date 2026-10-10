export class PageScrollIntent {
  private armed = false;
  private distance = 0;
  private direction: 1 | -1;

  constructor(direction: 'up' | 'down' = 'down') {
    this.direction = direction === 'down' ? 1 : -1;
  }

  startGesture(atBoundary: boolean) {
    this.armed = atBoundary;
    this.distance = 0;
  }

  addDistance(delta: number, atBoundary: boolean): boolean {
    const directedDelta = delta * this.direction;
    if (!atBoundary || directedDelta < 0) {
      this.armed = false;
      this.distance = 0;
      return false;
    }

    if (!this.armed || directedDelta === 0) {
      return false;
    }

    this.distance += directedDelta;
    if (this.distance < 80) {
      return false;
    }

    this.armed = false;
    return true;
  }
}
