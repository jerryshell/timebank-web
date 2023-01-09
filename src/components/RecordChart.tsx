import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import {useRecoilState} from 'recoil'
import {atoms} from '../atoms'
import {useMemo} from 'react'

const recordChart = () => {
    const [recordList, setRecordList] = useRecoilState(atoms.recordList)
    const recordStats = useMemo(() => (
        [...new Set(recordList.map(item => item.date))]
            .map(date => {
                const recordListByDate = recordList.filter(recordListItem => recordListItem.date === date)
                return {
                    date,
                    workCount: recordListByDate.filter(recordListItem => recordListItem.type === '工作').length,
                    readCount: recordListByDate.filter(recordListItem => recordListItem.type === '充电').length,
                    lazyCount: recordListByDate.filter(recordListItem => recordListItem.type === '摸鱼').length,
                    sleepCount: recordListByDate.filter(recordListItem => recordListItem.type === '休息').length,
                }
            })
            .sort((a, b) => a.date.localeCompare(b.date))
    ), [recordList])

    return (
        <>
            {recordStats.length > 1 ?
                <details open>
                    <summary>统计图表</summary>
                    <ResponsiveContainer height={200}>
                        <AreaChart
                            // width={windowSize.innerWidth - 30}
                            // height={200}
                            data={recordStats}
                        >
                            <XAxis
                                hide={true}
                                dataKey="date"
                            />
                            <YAxis
                                hide={true}
                                type="number"
                                domain={['dataMin', 'dataMax']}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#202b38',
                                    borderColor: '#202b38',
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="workCount"
                                stackId="1"
                                stroke="#F37878"
                                fill="#F37878"
                                name="🚀 工作"
                            />
                            <Area
                                type="monotone"
                                dataKey="readCount"
                                stackId="1"
                                stroke="#D9F8C4"
                                fill="#D9F8C4"
                                name="🔋 充电"
                            />
                            <Area
                                type="monotone"
                                dataKey="lazyCount"
                                stackId="1"
                                stroke="#47B5FF"
                                fill="#47B5FF"
                                name="🐟 摸鱼"
                            />
                            <Area
                                type="monotone"
                                dataKey="sleepCount"
                                stackId="1"
                                stroke="#FAD9A1"
                                fill="#FAD9A1"
                                name="🛏️ 休息"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </details>
                : ''
            }
        </>
    )
}

export default recordChart
