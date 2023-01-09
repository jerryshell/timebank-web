import {atom} from 'recoil'
import Record from './interfaces/Record'
import dayjs from 'dayjs'
import RecordListSearchForm from './interfaces/RecordListSearchForm'
import utils from './utils'

const initNewRecord = {
    date: dayjs().format('YYYY-MM-DD'),
    timeIndexBegin: Math.max(0, utils.nowTimeIndex() - 1),
    timeIndexEnd: utils.nowTimeIndex(),
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
        default: initRecordListSearchForm,
    }),
    recordList: atom({
        key: 'recordList',
        default: [] as Record[],
    }),
    recordListLoading: atom({
        key: 'recordListLoading',
        default: false,
    }),
}
