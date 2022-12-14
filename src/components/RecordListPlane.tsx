import dayjs from 'dayjs'
import {useRecoilState} from 'recoil'
import {atoms} from '../atoms'
import LoadingSvg from './LoadingSvg'
import {useMemo, useState} from 'react'

const timeIndexToTimeStr = (timeIndex: number) => {
    return `${(~~(timeIndex / 2)).toString().padStart(2, '0')}:${timeIndex % 2 === 0 ? '00' : '30'}`
}

const recordTypeEmojiPrefix = (recordType: string) => {
    switch (recordType) {
        case 'ไผๆฏ': {
            return '๐๏ธ'
        }
        case 'ๅ็ต': {
            return '๐'
        }
        case 'ๅทฅไฝ': {
            return '๐'
        }
        case 'ๆธ้ฑผ': {
            return '๐'
        }
        default: {
            return 'โ'
        }
    }
}

const RecordListPlane = () => {
    const [recordListSearchForm, setRecordListSearchForm] = useRecoilState(atoms.recordListSearchForm)
    const [recordList, setRecordList] = useRecoilState(atoms.recordList)
    const [recordListLoading, setRecordListLoading] = useRecoilState(atoms.recordListLoading)
    const [newRecord, setNewRecord] = useRecoilState(atoms.newRecord)
    const [recordKeyword, setRecordKeyword] = useState('')
    const recordShowList = useMemo(() => {
        const recordKeywordSplit = recordKeyword.split(' ').filter(item => item.length > 0)
        if (recordKeywordSplit.length <= 0) {
            return recordList
        }
        return recordList.filter(item => {
            return Object.values(item).some(value => {
                return recordKeywordSplit.some(keyword => value && value.toString().includes(keyword))
            })
        })
    }, [recordList, recordKeyword])

    const handleTimeIndexEndClick = (timeIndexEnd: number) => {
        setNewRecord({
            ...newRecord,
            timeIndexBegin: timeIndexEnd,
        })
    }

    return (
        <details open>
            <summary>่ฎฐๅฝๅ่กจ | ๆฐ้๏ผ{recordShowList.length}</summary>

            <fieldset>
                <legend>ๆฅๆ่ๅด็ญ้</legend>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}
                >
                    <div>
                        <label htmlFor="recordListSearchFormDateBeginInput">
                            ๅผๅงๆฅๆ
                        </label>
                        <input
                            id="recordListSearchFormDateBeginInput"
                            type="date"
                            value={recordListSearchForm.dateBegin}
                            onChange={e => {
                                setRecordListSearchForm({
                                    ...recordListSearchForm,
                                    dateBegin: e.target.value,
                                })
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="recordListSearchFormDateEndInput">
                            ็ปๆๆฅๆ
                        </label>
                        <input
                            id="recordListSearchFormDateEndInput"
                            type="date"
                            value={recordListSearchForm.dateEnd}
                            onChange={e => {
                                setRecordListSearchForm({
                                    ...recordListSearchForm,
                                    dateEnd: e.target.value,
                                })
                            }}
                        />
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}
                >
                    <button
                        onClick={() => {
                            const now = dayjs()
                            setRecordListSearchForm({
                                dateBegin: now.format('YYYY-MM-DD'),
                                dateEnd: now.format('YYYY-MM-DD'),
                            })
                        }}
                    >ไปๅคฉ
                    </button>
                    <button
                        onClick={() => {
                            const now = dayjs()
                            setRecordListSearchForm({
                                dateBegin: now.day(0).format('YYYY-MM-DD'),
                                dateEnd: now.format('YYYY-MM-DD'),
                            })
                        }}
                    >ๆฌๅจ
                    </button>
                    <button
                        onClick={() => {
                            const now = dayjs()
                            setRecordListSearchForm({
                                dateBegin: now.date(1).format('YYYY-MM-DD'),
                                dateEnd: now.format('YYYY-MM-DD'),
                            })
                        }}
                    >ๆฌๆ
                    </button>
                    <button
                        onClick={() => {
                            const now = dayjs()
                            setRecordListSearchForm({
                                dateBegin: now.subtract(30, 'day').format('YYYY-MM-DD'),
                                dateEnd: now.format('YYYY-MM-DD'),
                            })
                        }}
                    >่ฟ 30 ๅคฉ
                    </button>
                    <button
                        onClick={() => {
                            const now = dayjs()
                            setRecordListSearchForm({
                                dateBegin: now.subtract(180, 'day').format('YYYY-MM-DD'),
                                dateEnd: now.format('YYYY-MM-DD'),
                            })
                        }}
                    >่ฟ 180 ๅคฉ
                    </button>
                </div>
            </fieldset>

            <fieldset>
                <legend>ๅณ้ฎๅญ็ญ้</legend>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}
                >
                    <input
                        type="text"
                        placeholder="ๅคไธชๅณ้ฎๅญไฝฟ็จ็ฉบๆ?ผๅๅฒ"
                        value={recordKeyword}
                        onChange={e => setRecordKeyword(e.target.value)}
                    />
                    <button onClick={() => setRecordKeyword('')}>้็ฝฎ</button>
                </div>
            </fieldset>

            <table>
                <thead>
                <tr>
                    <th>ๆฅๆ</th>
                    <th>ๅผๅงๆถ้ด</th>
                    <th>็ปๆๆถ้ด</th>
                    <th>็ฑปๅ</th>
                    <th>ๅคๆณจ</th>
                </tr>
                </thead>
                <tbody>
                {recordShowList.map(record => (
                    <tr key={`${record.date}-${record.timeIndexBegin}-${record.timeIndexEnd}`}>
                        <td>{record.date}</td>
                        <td>{timeIndexToTimeStr(record.timeIndexBegin)}</td>
                        <td>
                            <button onClick={() => handleTimeIndexEndClick(record.timeIndexEnd)}>
                                {timeIndexToTimeStr(record.timeIndexEnd)}
                            </button>
                        </td>
                        <td>{recordTypeEmojiPrefix(record.type)} {record.type}</td>
                        <td>{record.remark}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {recordListLoading ? <div style={{textAlign: 'center'}}><LoadingSvg/></div> : ''}
        </details>
    )
}

export default RecordListPlane
