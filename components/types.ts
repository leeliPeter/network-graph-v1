export interface Node {
  id: string;
  name: string;
  keywords?: string[];
  type?: string;
  x?: number;
  y?: number;
  color?: string;
  properties?: {
    部門?: string;
    值?: string;
    比較基準?: string;
    表現評估?: string;
    影響?: string[];
    財務?: boolean;
    內部?: boolean;
    市場值?: boolean;
    占比?: boolean;
    影響度?: boolean;
    成長率?: boolean;
    景氣指數?: boolean;
    政策趨勢?: boolean;
  };
  connections?: number;
}
