import './App.css'
import { useEffect, useState } from "react";
import recordApi from "./api/recordApi";
import Record from './interfaces/Record';
import dayjs from 'dayjs';
import { Header } from './components/Header';
import Footer from './components/Footer';

let timeClipList = [] as string[]
for (let i = 0; i <= 24; i++) {
  timeClipList.push(`${i.toString().padStart(2, '0')}:00`)
  if (i !== 24) {
    timeClipList.push(`${i.toString().padStart(2, '0')}:30`)
  }
}
console.log('timeClipList', timeClipList)

const nowTimeIndex = () => {
  const now = dayjs()
  return ~~(now.get('hour') * 2 + now.get('minute') / 30)
}

const timeIndexToTimeStr = (timeIndex: number) => {
  return `${(~~(timeIndex / 2)).toString().padStart(2, '0')}:${timeIndex % 2 === 0 ? '00' : '30'}`
}

const App = () => {
  const [newRecord, setNewRecord] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    timeIndexBegin: Math.max(0, nowTimeIndex() - 1),
    timeIndexEnd: nowTimeIndex(),
    type: '休息',
    remark: '',
  } as Record)
  const [recordList, setRecordList] = useState([] as Record[])
  const [dateBegin, setDateBegin] = useState(dayjs().format('YYYY-MM-DD'))
  const [dateEnd, setDateEnd] = useState(dayjs().format('YYYY-MM-DD'))

  const fetchRecordList = () => {
    recordApi.search({
      dateBegin,
      dateEnd
    })
      .then(response => {
        const recordList = response.data
        console.log('fetchRecordList', recordList)
        setRecordList(recordList)
      })
      .catch(e => {
        console.error(e)
        alert(e.toString())
      })
  }

  useEffect(() => {
    fetchRecordList()
  }, [dateBegin, dateEnd])

  const handleRecordCreateBtnClick = () => {
    console.log('newRecord', newRecord)
    if (newRecord.timeIndexEnd < newRecord.timeIndexBegin) {
      alert('创建失败！结束时间不能小于开始时间')
      return
    }
    recordApi.create(newRecord)
      .then(response => {
        console.log('record create response', response)
        fetchRecordList()
      })
      .catch(e => {
        console.error(e)
        alert(e.toString())
      })
  }

  return (
    <>
      <Header/>

      <details open>
        <summary>创建记录</summary>
        <div style={{ display: 'flex' }}>
          <div>
            <label htmlFor='newReportDateInput'>日期</label>
            <input
              id='newReportDateInput'
              type='date'
              value={newRecord.date}
              onChange={e => {
                setNewRecord({
                  ...newRecord,
                  date: e.target.value
                })
              }}
            />
          </div>
          <div>
            <label htmlFor='newReportTimeIndexBeginSelect'>开始时间</label>
            <select
              id='newReportTimeIndexBeginSelect'
              value={newRecord.timeIndexBegin}
              onChange={e => {
                const timeIndexBegin = parseInt(e.target.value)
                setNewRecord({
                  ...newRecord,
                  timeIndexBegin,
                })
              }}
            >
              {timeClipList.map((value, index) => (
                <option
                  key={index}
                  value={index}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor='newReportTimeIndexEndSelect'>结束时间</label>
            <select
              id='newReportTimeIndexEndSelect'
              value={newRecord.timeIndexEnd}
              onChange={e => {
                const timeIndexEnd = parseInt(e.target.value)
                setNewRecord({
                  ...newRecord,
                  timeIndexEnd,
                })
              }}
            >
              {timeClipList.map((value, index) => (
                <option
                  key={index}
                  value={index}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor='newReportTypeSelect'>类型</label>
            <select
              id='newReportTypeSelect'
              value={newRecord.type}
              onChange={e => {
                setNewRecord({
                  ...newRecord,
                  type: e.target.value
                })
              }}
            >
              <option value='休息'>休息</option>
              <option value='充电'>充电</option>
              <option value='工作'>工作</option>
              <option value='摸鱼'>摸鱼</option>
            </select>
          </div>
          <div>
            <label htmlFor='newReportRemarkInput'>备注（可选）</label>
            <input
              id='newReportRemarkInput'
              type='text'
              value={newRecord.remark}
              onChange={e => {
                setNewRecord({
                  ...newRecord,
                  remark: e.target.value,
                })
              }}
            />
          </div>
          <button onClick={handleRecordCreateBtnClick}>创建</button>
        </div>
        <p>若旧记录与新记录重叠，则旧记录将会被新记录覆盖</p>
      </details>

      <details open>
        <summary>记录列表</summary>

        <fieldset>
          <legend>日期范围筛选</legend>
          <div style={{ display: 'flex' }}>
            <div>
              <label htmlFor='dateBeginInput'>
                开始日期
              </label>
              <input
                id='dateBeginInput'
                type='date'
                value={dateBegin}
                onChange={e => setDateBegin(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='dateEndInput'>
                结束日期
              </label>
              <input
                id='dateEndInput'
                type='date'
                value={dateEnd}
                onChange={e => setDateEnd(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                const now = dayjs()
                setDateBegin(now.format('YYYY-MM-DD'))
                setDateEnd(now.format('YYYY-MM-DD'))
              }}
            >今天
            </button>
            <button
              onClick={() => {
                const now = dayjs()
                setDateBegin(now.day(0).format('YYYY-MM-DD'))
                setDateEnd(now.format('YYYY-MM-DD'))
              }}
            >本周
            </button>
            <button
              onClick={() => {
                const now = dayjs()
                setDateBegin(now.date(1).format('YYYY-MM-DD'))
                setDateEnd(now.format('YYYY-MM-DD'))
              }}
            >本月
            </button>
            <button
              onClick={() => {
                const now = dayjs()
                setDateBegin(now.subtract(30, 'day').format('YYYY-MM-DD'))
                setDateEnd(now.format('YYYY-MM-DD'))
              }}
            >近 30 天
            </button>
          </div>
        </fieldset>

        <table>
          <thead>
          <tr>
            <th>日期</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>类型</th>
            <th>备注</th>
          </tr>
          </thead>
          <tbody>
          {recordList.map(record => (
            <tr key={`${record.date}-${record.timeIndexBegin}-${record.timeIndexEnd}`}>
              <td>{record.date}</td>
              <td>{timeIndexToTimeStr(record.timeIndexBegin)}</td>
              <td>{timeIndexToTimeStr(record.timeIndexEnd)}</td>
              <td>{record.type}</td>
              <td>{record.remark}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </details>

      <Footer/>
    </>
  )
}

export default App
