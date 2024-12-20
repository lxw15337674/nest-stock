import puppeteer, { Browser, Page } from 'puppeteer';
import * as path from 'path';
import { randomSleep } from './utils/sleep';
import fs from 'fs';

export enum MapType {
    hy = 'hy',
    gu = 'gu'
}
export enum Area {
    'hk' = 'hk',
    'us' = 'us',
    'cn' = 'cn'
}
const config = {
    headless: false,
    args: ['--no-sandbox',           // Docker 环境必需
        '--disable-setuid-sandbox', // 配合 no-sandbox
    ]
}
let browser: Browser | null = null;
let page: Page | null = null;
let isProcessing = false;

async function getPage(): Promise<Page> {
    if (!browser) {
        browser = await puppeteer.launch(config);
    }
    if (!page || page.isClosed()) {
        page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080
        });
    }
    return page;
}

async function getFutuStockMap(area: string, mapType: string) {
    const filePath = path.resolve(process.cwd(), `map/futu-${area}-${mapType}.png`);

    if (isProcessing) {
        // 检查文件是否存在
        if (fs.existsSync(filePath)) {
            return filePath;
        }
        return '另一个截图任务正在进行中...';
    }

    try {
        isProcessing = true;

        // 参数校验
        if (!Object.values(Area).includes(area as Area)) {
            area = Area.cn;
        }
        if (!Object.values(MapType).includes(mapType as MapType)) {
            mapType = MapType.gu;
        }

        const currentPage = await getPage();
        await currentPage.goto(`https://www.futunn.com/quote/${area}/heatmap`, {
            waitUntil: 'networkidle2'
        });
        if (mapType === MapType.hy) {
            await currentPage.click('.select-component.heatmap-list-select');
            await currentPage.evaluate(() => {
                const parentElement = document.querySelector('.pouper.max-hgt');
                (parentElement?.children[1] as HTMLElement)?.click();
            });
        }
        await randomSleep(2000, 3000);
        let view = await currentPage.$('.quote-page.router-page');
        await view.screenshot({ path: filePath });
        console.log(`截图成功: ${filePath}`);
        return filePath;
    } finally {
        isProcessing = false;
    }
}

async function getYuntuStockMap() {
    const filePath = path.resolve(process.cwd(), `map/yuntu.png`);

    if (isProcessing) {
        // 检查文件是否存在
        if (fs.existsSync(filePath)) {
            return filePath;
        }
        return '另一个截图任务正在进行中...';
    }

    try {
        isProcessing = true;

        const currentPage = await getPage();
        await currentPage.goto(`https://dapanyuntu.com/`, {
            waitUntil: 'networkidle2'
        });

        await randomSleep(3000, 4000);
        let view = await currentPage.$('#body');
        await view.screenshot({ path: filePath });
        console.log(`截图成功: ${filePath}`);
        return filePath;
    } finally {
        isProcessing = false;
    }
}

export { getFutuStockMap, getYuntuStockMap };