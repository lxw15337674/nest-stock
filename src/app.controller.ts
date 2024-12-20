import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import { Response } from 'express';
import { MapType } from './stockThermalMap';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getFutuStockMap/:symbol/:mapType')
  async getFutuStockMap(
    @Param('symbol') symbol: string,
    @Param('mapType') mapType: MapType = MapType.hy,
    @Res() res: Response,
  ) {
    const filePath = await this.appService.getFutuStockMap(symbol, mapType);
    if (filePath.includes('正在进行中')) {
      return res.send(filePath);
    }
    const file = fs.createReadStream(filePath);
    res.setHeader('Content-Type', 'image/png');
    return file.pipe(res);
  }

  @Get('/getYuntuStockMap/:symbol')
  async getYuntuStockMap(
    @Param('symbol') symbol: string,
    @Res() res: Response,
  ) {
    const filePath = await this.appService.getYuntuStockMap(symbol);
    if (filePath.includes('正在进行中')) {
      return res.send(filePath);
    }
    const file = fs.createReadStream(filePath);
    res.setHeader('Content-Type', 'image/png');
    return file.pipe(res);
  }
}