import { atom } from 'recoil'
import Record from './interfaces/Record';
import dayjs from 'dayjs';
import RecordListFilter from './interfaces/RecordListFilter';

const nowTimeIndex = () => {
  const now = dayjs()
  return ~~(now.get('hour') * 2 + now.get('minute') / 30)
}

const initNewRecord = {
  date: dayjs().format('YYYY-MM-DD'),
  timeIndexBegin: Math.max(0, nowTimeIndex() - 1),
  timeIndexEnd: nowTimeIndex(),
  type: '工作',
  remark: '',
} as Record

const initRecordListFilter = {
  dateBegin: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  dateEnd: dayjs().format('YYYY-MM-DD'),
} as RecordListFilter

export const atoms = {
  newRecord: atom({
    key: 'newRecord',
    default: initNewRecord,
  }),
  recordListFilter: atom({
    key: 'recordListFilter',
    default: initRecordListFilter
  }),
  recordList: atom({
    key: 'recordList',
    default: [] as Record[],
  }),
  recordListLoading: atom({
    key: 'recordListLoading',
    default: false,
  })
}
