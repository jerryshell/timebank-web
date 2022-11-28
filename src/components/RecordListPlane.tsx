import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import { atoms } from '../atoms';

const timeIndexToTimeStr = (timeIndex: number) => {
  return `${(~~(timeIndex / 2)).toString().padStart(2, '0')}:${timeIndex % 2 === 0 ? '00' : '30'}`
}

const recordTypeEmojiPrefix = (recordType: string) => {
  switch (recordType) {
    case '休息': {
      return '🛏️'
    }
    case '充电': {
      return '🔋'
    }
    case '工作': {
      return '🚀'
    }
    case '摸鱼': {
      return '🐟'
    }
    default: {
      return '❓'
    }
  }
}

const RecordListPlane = () => {
  const [recordListFilter, setRecordListFilter] = useRecoilState(atoms.recordListFilter)
  const [recordList, setRecordList] = useRecoilState(atoms.recordList)

  return (
    <details open>
      <summary>记录列表</summary>

      <fieldset>
        <legend>日期范围筛选</legend>
        <div style={{ display: 'flex' }}>
          <div>
            <label htmlFor='recordListFilterDateBeginInput'>
              开始日期
            </label>
            <input
              id="recordListFilterDateBeginInput"
              type='date'
              value={recordListFilter.dateBegin}
              onChange={e => {
                setRecordListFilter({
                  ...recordListFilter,
                  dateBegin: e.target.value,
                })
              }}
            />
          </div>
          <div>
            <label htmlFor='recordListFilterDateEndInput'>
              结束日期
            </label>
            <input
              id="recordListFilterDateEndInput"
              type='date'
              value={recordListFilter.dateEnd}
              onChange={e => {
                setRecordListFilter({
                  ...recordListFilter,
                  dateEnd: e.target.value,
                })
              }}
            />
          </div>
          <button
            onClick={() => {
              const now = dayjs()
              setRecordListFilter({
                dateBegin: now.format('YYYY-MM-DD'),
                dateEnd: now.format('YYYY-MM-DD'),
              })
            }}
          >今天
          </button>
          <button
            onClick={() => {
              const now = dayjs()
              setRecordListFilter({
                dateBegin: now.day(0).format('YYYY-MM-DD'),
                dateEnd: now.format('YYYY-MM-DD'),
              })
            }}
          >本周
          </button>
          <button
            onClick={() => {
              const now = dayjs()
              setRecordListFilter({
                dateBegin: now.date(1).format('YYYY-MM-DD'),
                dateEnd: now.format('YYYY-MM-DD'),
              })
            }}
          >本月
          </button>
          <button
            onClick={() => {
              const now = dayjs()
              setRecordListFilter({
                dateBegin: now.subtract(30, 'day').format('YYYY-MM-DD'),
                dateEnd: now.format('YYYY-MM-DD'),
              })
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
            <td>{recordTypeEmojiPrefix(record.type)} {record.type}</td>
            <td>{record.remark}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </details>
  )
}

export default RecordListPlane
