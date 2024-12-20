import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { MapType } from './stockThermalMap';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
  @Get('/getFutuStockMap/:symbol/:mapType')
  async getFutuStockMap(
    @Param('symbol') symbol: string,
    @Param('mapType') mapType: MapType = MapType.hy,
    @Res() res: Response,
  ) {
    const buffer = await this.appService.getFutuStockMap(symbol, mapType);
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': buffer.byteLength
    });
    res.end(buffer);
  }

  @Get('/getYuntuStockMap')
  async getYuntuStockMap(
    @Res() res: Response,
  ) {
    const buffer = await this.appService.getYuntuStockMap();
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': buffer.byteLength
    });
    res.end(buffer);
  }
}