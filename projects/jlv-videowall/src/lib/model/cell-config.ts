import { PlateConfig } from './plate-config';

export interface CellConfig {
    plateConfig: PlateConfig[];
    frozen?: boolean;
}