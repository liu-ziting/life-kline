export const TIANGAN = '甲乙丙丁戊己庚辛壬癸'.split('')
export const DIZHI = '子丑寅卯辰巳午未申酉戌亥'.split('')

export interface Bazi {
    y: string
    m: string
    d: string
    h: string
}

export interface FatePoint {
    age: number
    open: number
    close: number
    low: number
    high: number
    isUp: boolean
    event: string
    quote: string
}

// 简单的伪随机数生成器 (Linear Congruential Generator)
class Random {
    private seed: number
    constructor(seed: number) {
        this.seed = seed
    }
    // 返回 [0, 1)
    next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280
        return this.seed / 233280.0
    }
    // 返回 [min, max)
    range(min: number, max: number): number {
        return min + this.next() * (max - min)
    }
}

// 伪随机函数 (兼容旧接口，但建议使用 Random 类)
export function seed(s: number): number {
    // 使用简单的哈希混淆，避免正弦波周期性
    let x = Math.sin(s) * 10000
    return x - Math.floor(x)
}

// 排盘
export function getBazi(year: number, s: number): Bazi {
    const p = (i: number) => {
        const tg = TIANGAN[((i % 10) + 10) % 10]
        const dz = DIZHI[((i % 12) + 12) % 12]
        return (tg || '') + (dz || '')
    }
    return { y: p(year - 3), m: p(s), d: p(s >> 2), h: p(s >> 4) }
}

// 生成运势 (Random Walk 算法)
export function generateFate(seedBase: number): FatePoint[] {
    let arr: FatePoint[] = []
    let score = 50
    const rng = new Random(seedBase)
    
    // 趋势因子：当前是处于上升通道还是下降通道
    let trend = 0 
    // 趋势持续时间
    let trendDuration = 0

    const events = [
        '文曲星动，金榜题名',
        '红鸾星动，喜结良缘',
        '驿马星动，奔波劳碌',
        '天德合局，贵人相助',
        '岁破冲身，宜静守成',
        '财库大开，积玉堆金',
        '华盖入命，孤独修身',
        '桃花泛滥，情劫难渡',
        '身体微恙，静养为宜',
        '时来运转，否极泰来',
        '流年不利，破财消灾'
    ]
    const quotes = [
        '大鹏一日同风起，扶摇直上九万里。',
        '山重水复疑无路，柳暗花明又一村。',
        '莫道桑榆晚，为霞尚满天。',
        '沉舟侧畔千帆过，病树前头万木春。',
        '行到水穷处，坐看云起时。',
        '回首向来萧瑟处，归去，也无风雨也无晴。',
        '长风破浪会有时，直挂云帆济沧海。',
        '不经一番寒彻骨，怎得梅花扑鼻香。'
    ]

    for (let i = 1; i <= 80; i++) {
        // 1. 决定当年的趋势
        if (trendDuration <= 0) {
            // 新的趋势周期
            // 随机决定趋势：-1(跌), 0(盘整), 1(涨)
            // 增加随机性：有些趋势是暴涨暴跌
            const r = rng.next()
            if (r < 0.3) trend = -1 // 熊市
            else if (r < 0.6) trend = 1 // 牛市
            else trend = 0 // 震荡
            
            // 趋势持续 1-10 年
            trendDuration = Math.floor(rng.range(1, 10))
        }
        trendDuration--

        // 2. 计算基础波动
        // 基础波动范围
        // let volatility = rng.range(2, 8); 
        
        // 根据趋势计算涨跌幅
        let change = 0
        if (trend === 1) {
             change = rng.range(-2, 12) // 总体向上，但也可能回调
        } else if (trend === -1) {
             change = rng.range(-12, 2) // 总体向下，但也可能反弹
        } else {
             change = rng.range(-5, 5)  // 震荡
        }

        // 3. 黑天鹅事件 (5% 概率)
        if (rng.next() < 0.05) {
            change *= 3 // 剧烈波动
        }

        // 年龄修正 (少年波动小，中年波动大，晚年趋稳)
        if (i < 18) change *= 0.5
        if (i > 60) change *= 0.6

        let open = score
        let close = open + change
        
        // 限制分数范围 10-100
        close = Math.max(10, Math.min(100, close))

        // 计算 High/Low
        // 影线长度随机
        let upperShadow = rng.range(0, 5)
        let lowerShadow = rng.range(0, 5)
        
        let high = Math.max(open, close) + upperShadow
        let low = Math.min(open, close) - lowerShadow
        
        // 确保 high/low 不太离谱
        high = Math.min(100, high)
        low = Math.max(0, low)

        // 涨跌判断
        let isUp = close >= open

        arr.push({
            age: i,
            open: Number(open.toFixed(1)),
            close: Number(close.toFixed(1)),
            low: Number(low.toFixed(1)),
            high: Number(high.toFixed(1)),
            isUp: isUp,
            event: (events[Math.floor(rng.next() * events.length)] || events[0]) as string,
            quote: (quotes[Math.floor(rng.next() * quotes.length)] || quotes[0]) as string
        })
        score = close
    }
    return arr
}
