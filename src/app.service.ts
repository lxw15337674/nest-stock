import { Injectable } from '@nestjs/common';
import { getFutuStockMap, getYuntuStockMap, MapType } from './stockThermalMap';

@Injectable()
export class AppService {
  async getFutuStockMap(area: string, mapType: string): Promise<string> {
    return await getFutuStockMap(area, mapType);
  }

  async getYuntuStockMap(): Promise<string> {
    return await getYuntuStockMap();
  }
}