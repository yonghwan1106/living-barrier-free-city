declare global {
  interface Window {
    naver?: {
      maps?: {
        Map: {
          new (element: HTMLElement | string, options: Record<string, unknown>): NaverMap;
        };
        LatLng: {
          new (lat: number, lng: number): unknown;
        };
        Marker: {
          new (options: Record<string, unknown>): NaverMarker;
        };
        InfoWindow: {
          new (options: Record<string, unknown>): unknown;
        };
      };
    };
  }

  interface NaverMap {
    setCenter(center: unknown): void;
    setZoom(zoom: number): void;
    getZoom(): number;
    panTo(center: unknown): void;
    destroy(): void;
    addListener(event: string, listener: (e: unknown) => void): void;
    removeListener(listener: unknown): void;
  }

  interface NaverMarker {
    setMap(map: NaverMap | null): void;
    getMap(): NaverMap | null;
    setPosition(position: unknown): void;
    setIcon(icon: unknown): void;
  }
}

export {};
