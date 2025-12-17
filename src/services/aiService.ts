import type { FatePoint } from '../utils/divination'

export interface ApiConfig {
    endpoint: string
    model: string
    apiKey: string
}

const DEFAULT_CONFIG: ApiConfig = {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    apiKey: 'sk-af533ac60b4a42bd916a06c8ee3a4c8a'
}

export class AIService {
    private config: ApiConfig

    constructor(config?: Partial<ApiConfig>) {
        this.config = { ...DEFAULT_CONFIG, ...config }
    }

    async predictFate(userInfo: { name: string; gender: string; place: string; date: string; time: string }): Promise<FatePoint[]> {
        const systemPrompt = `你是一位精通周易八字、紫微斗数的大师，同时也是一位数据分析专家。
你的任务是根据用户的生辰八字，推演其一生的运势起伏，并以“人生K线图”的数据格式输出。

请遵循以下规则：
1. **人生K线**：将人生每一岁看作一根K线。
   - open: 该年龄段开始时的运势评分 (0-100)
   - close: 该年龄段结束时的运势评分 (0-100)
   - high: 该年龄段运势最高点
   - low: 该年龄段运势最低点
   - event: 该岁发生的重大事件或运势描述 (4-10字)
   - quote: 对应的古诗词或人生哲理 (10-20字)
   
2. **数据特征（至关重要）**：
   - **拒绝平庸与规律**：人生是随机行走的，**切勿生成正弦波式、周期性或规律的起伏**。不要“为了波动而波动”，不要让运势在一条水平线上机械震荡。
   - **允许极端与黑天鹅**：人生中会遇到突发的横财、意外的灾难、时代的红利或不可抗力。请在数据中体现出**突然的暴涨（单年涨幅>20分）或暴跌**。
   - **长周期的趋势**：运势应当有惯性。可以是**连续 5-10 年的漫长熊市**（低谷徘徊），也可以是**连续 10 年的黄金牛市**（持续攀升）。不要每年都反转。
   - **包含挫折与停滞**：人生不如意事十之八九。必须包含若干个明显的“平台期”（分数波动极小）或“阴跌期”（每年跌一点，连跌好几年）。
   - **大起大落**：一生中至少要有 2-3 次改变命运轨迹的重大转折。
   - **细节丰富**：K线的影线（high/low）要足够长，体现当年的情绪波动。

3. **数据一致性**：
   - 0岁初始分数为50左右。
   - 下一岁的 open 应该等于（或接近）上一岁的 close。
   - high 必须 >= max(open, close), low 必须 <= min(open, close)。
   - isUp 字段：如果 close >= open 则为 true，否则为 false。

4. **输出格式**：
   - 必须严格返回 JSON 数组格式。
   - 不要包含 markdown 代码块标记 (即不要包含 \`\`\`json ... \`\`\`)。
   - 数组中包含 1 到 80 岁的数据。
   - 字段名必须严格匹配：age, open, close, high, low, isUp, event, quote。
   
   示例格式：
   [
     {
       "age": 1,
       "open": 50,
       "close": 52,
       "high": 55,
       "low": 48,
       "isUp": true,
       "event": "初生牛犊，平安喜乐",
       "quote": "初生之犊不畏虎，万丈高楼平地起"
     }
   ]`

        const userPrompt = `
请为这位缘主推演运势（务必体现波澜壮阔的人生）：
姓名：${userInfo.name}
性别：${userInfo.gender === '1' ? '男' : '女'}
籍贯：${userInfo.place}
生辰：${userInfo.date}
时辰：${userInfo.time}

请生成从 1 岁到 80 岁的运势数据，切记不要一路平稳，要有高峰也有低谷。`

        try {
            const content = await this.callAI(systemPrompt, userPrompt)
            // Clean up the response if it contains markdown code blocks (just in case)
            const cleanContent = content
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim()

            // Try to parse JSON
            let fatePoints: FatePoint[]
            try {
                fatePoints = JSON.parse(cleanContent)
            } catch (e) {
                console.error('JSON Parse Error:', e)
                // Try to find array in the string if parse failed
                const match = cleanContent.match(/\[.*\]/s)
                if (match) {
                    fatePoints = JSON.parse(match[0])
                } else {
                    throw new Error('Invalid JSON format from AI')
                }
            }

            // Validate structure roughly
            if (!Array.isArray(fatePoints) || fatePoints.length === 0) {
                throw new Error('AI returned empty or invalid array')
            }

            return fatePoints
        } catch (error: any) {
            console.error('AI服务调用失败:', error)
            throw error
        }
    }

    private async callAI(systemPrompt: string, userPrompt: string): Promise<string> {
        const response = await fetch(this.config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.95
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content
        } else {
            throw new Error('Invalid response format')
        }
    }
}

