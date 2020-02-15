import { PlateConfig } from './plate-config';

export interface CellConfig {
    plateConfig: PlateConfig[];
    freezed?: boolean;
}