import { useRecoilState } from 'recoil';
import { atoms } from '../atoms';
import recordApi from '../api/recordApi';
import { useState } from 'react';
import LoadingButton from './LoadingButton';

let timeClipList = [] as string[]
for (let i = 0; i <= 24; i++) {
  timeClipList.push(`${i.toString().padStart(2, '0')}:00`)
  if (i !== 24) {
    timeClipList.push(`${i.toString().padStart(2, '0')}:30`)
  }
}
console.log('timeClipList', timeClipList)

const RecordCreatePlane = ({ fetchRecordList }: { fetchRecordList: Function }) => {
  const [newRecord, setNewRecord] = useRecoilState(atoms.newRecord)
  const [loading, setLoading] = useState(false)

  const handleRecordCreateBtnClick = () => {
    console.log('newRecord', newRecord)
    if (newRecord.timeIndexEnd < newRecord.timeIndexBegin) {
      alert('创建失败！结束时间不能小于开始时间')
      return
    }
    setLoading(true)
    recordApi.create(newRecord)
      .then(response => {
        console.log('record create response', response)
        fetchRecordList()
      })
      .catch(e => {
        console.error(e)
        alert(e.response.data.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <details open>
      <summary>创建记录</summary>
      <div>
        <label htmlFor='adminTokenInput'>Admin 令牌（如果你没有 Admin 令牌，则没有创建记录权限）</label>
        <input
          id='adminTokenInput'
          type='text'
          defaultValue={localStorage.getItem('adminToken') || ''}
          onChange={e => {
            localStorage.setItem('adminToken', e.target.value)
          }}
        />
      </div>
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
            <option value='工作'>工作</option>
            <option value='充电'>充电</option>
            <option value='摸鱼'>摸鱼</option>
            <option value='休息'>休息</option>
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
        {loading ? <LoadingButton/> : <button onClick={handleRecordCreateBtnClick}>创建</button>}
      </div>
      <p>若旧记录与新记录重叠，则旧记录将会被新记录覆盖</p>
    </details>
  )
}

export default RecordCreatePlane
