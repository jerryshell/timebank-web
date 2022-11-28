import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useRecoilState } from 'recoil';
import { atoms } from '../atoms';
import { useEffect, useState } from 'react';

const recordChart = () => {
  const [recordList, setRecordList] = useRecoilState(atoms.recordList)
  const [recordStatistics, setRecordStatistics] = useState([] as {
    date: string,
    workCount: number,
    readCount: number,
    lazyCount: number,
    sleepCount: number,
  }[])

  const updateRecordStatistics = () => {
    const newRecordStatistics = [] as {
      date: string,
      workCount: number,
      readCount: number,
      lazyCount: number,
      sleepCount: number,
    }[]
    for (const record of recordList) {
      let newRecordStatisticsItem = newRecordStatistics.find(item => item.date === record.date)
      if (!newRecordStatisticsItem) {
        newRecordStatisticsItem = {
          date: record.date,
          workCount: 0,
          readCount: 0,
          lazyCount: 0,
          sleepCount: 0,
        }
        newRecordStatistics.push(newRecordStatisticsItem)
      }
      switch (record.type) {
        case '工作': {
          newRecordStatisticsItem.workCount += 1
          break
        }
        case '充电': {
          newRecordStatisticsItem.readCount += 1
          break
        }
        case '摸鱼': {
          newRecordStatisticsItem.lazyCount += 1
          break
        }
        case '休息': {
          newRecordStatisticsItem.sleepCount += 1
          break
        }
        default: {
          break
        }
      }
    }
    console.log('newRecordStatistics', newRecordStatistics)
    newRecordStatistics.sort((a, b) => a.date.localeCompare(b.date))
    setRecordStatistics(newRecordStatistics)
  }

  useEffect(() => {
    updateRecordStatistics()
  }, [recordList])

  return (
    <>
      {recordStatistics.length > 1 ?
        <details open>
          <summary>统计图表</summary>
          <AreaChart
            width={800}
            height={200}
            data={recordStatistics}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
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
            <Tooltip contentStyle={{ backgroundColor: '#202b38', borderColor: '#202b38' }}/>
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
        </details>
        : ''
      }
    </>
  )
}

export default recordChart
