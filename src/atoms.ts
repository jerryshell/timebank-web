import { atom } from 'recoil'
import Record from './interfaces/Record';
import dayjs from 'dayjs';
import RecordListSearchForm from './interfaces/RecordListSearchForm';

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

const initRecordListSearchForm = {
  dateBegin: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  dateEnd: dayjs().format('YYYY-MM-DD'),
} as RecordListSearchForm

export const atoms = {
  newRecord: atom({
    key: 'newRecord',
    default: initNewRecord,
  }),
  recordListSearchForm: atom({
    key: 'recordListSearchForm',
    default: initRecordListSearchForm
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
