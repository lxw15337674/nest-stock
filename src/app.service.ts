import { Injectable } from '@nestjs/common';
import { getFutuStockMap, getYuntuStockMap, MapType } from './stockThermalMap';

@Injectable()
export class AppService {
  async getFutuStockMap(symbol: string, mapType: MapType): Promise<string> {
    return await getFutuStockMap(symbol, mapType);
  }

  async getYuntuStockMap(symbol: string): Promise<string> {
    return await getYuntuStockMap(symbol);
  }
}