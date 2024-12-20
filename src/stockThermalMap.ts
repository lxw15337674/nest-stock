import puppeteer, { Browser, Page } from 'puppeteer';
import { randomSleep } from './utils/sleep';

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

// 缓存变量
interface CacheData {
    buffer: Buffer;
    updateTime: number;
}

interface StockMapCache {
    [key: string]: CacheData;
}

let stockMapCache: StockMapCache = {};
const CACHE_EXPIRE_TIME = 2 * 60 * 1000; // 2分钟缓存过期

// 清理过期缓存
function clearExpiredCache() {
    const now = Date.now();
    Object.keys(stockMapCache).forEach(key => {
        if (now - stockMapCache[key].updateTime > CACHE_EXPIRE_TIME) {
            delete stockMapCache[key];
        }
    });
}

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

async function getFutuStockMap(area: string, mapType: string): Promise<Buffer > {
    const cacheKey = `futu-${area}-${mapType}`;
    const now = Date.now();

    // 检查缓存
    if (stockMapCache[cacheKey] && now - stockMapCache[cacheKey].updateTime < CACHE_EXPIRE_TIME) {
        return stockMapCache[cacheKey].buffer;
    }

    if (isProcessing) {
        return stockMapCache[cacheKey].buffer;
    }

    try {
        isProcessing = true;
        clearExpiredCache();

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
        const buffer = await view.screenshot() as Buffer;
        stockMapCache[cacheKey] = {
            buffer,
            updateTime: now
        };
        console.log('截图成功，已更新缓存');
        return buffer;
    } finally {
        isProcessing = false;
    }
}

async function getYuntuStockMap(): Promise<Buffer | null> {
    const cacheKey = 'yuntu';
    const now = Date.now();

    // 检查缓存
    if (stockMapCache[cacheKey] && now - stockMapCache[cacheKey].updateTime < CACHE_EXPIRE_TIME) {
        return stockMapCache[cacheKey].buffer;
    }

    if (isProcessing) {
        return stockMapCache[cacheKey]?.buffer;
    }

    try {
        isProcessing = true;
        clearExpiredCache();

        const currentPage = await getPage();
        await currentPage.goto(`https://dapanyuntu.com/`, {
            waitUntil: 'networkidle2'
        });

        await randomSleep(3000, 4000);
        let view = await currentPage.$('#body');
        const buffer = await view.screenshot() as Buffer;
        stockMapCache[cacheKey] = {
            buffer,
            updateTime: now
        };
        console.log('截图成功，已更新缓存');
        return buffer;
    } finally {
        isProcessing = false;
    }
}

export { getFutuStockMap, getYuntuStockMap };