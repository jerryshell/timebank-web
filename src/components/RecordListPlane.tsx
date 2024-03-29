import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { atoms } from "../atoms";
import LoadingSvg from "./LoadingSvg";
import recordApi from "../api/recordApi";
import Record from "../interfaces/Record";

const timeIndexToTimeStr = (timeIndex: number) => {
  return `${(~~(timeIndex / 2)).toString().padStart(2, "0")}:${timeIndex % 2 === 0 ? "00" : "30"
    }`;
};

const recordTypeEmojiPrefix = (recordType: string) => {
  switch (recordType) {
    case "休息": {
      return "🛏️";
    }
    case "充电": {
      return "🔋";
    }
    case "工作": {
      return "🚀";
    }
    case "摸鱼": {
      return "🐟";
    }
    default: {
      return "❓";
    }
  }
};

const RecordListPlane = ({
  fetchRecordList,
}: {
  fetchRecordList: Function;
}) => {
  const [recordListSearchForm, setRecordListSearchForm] = useRecoilState(
    atoms.recordListSearchForm,
  );
  const [recordList, setRecordList] = useRecoilState(atoms.recordList);
  const [recordListLoading, setRecordListLoading] = useRecoilState(
    atoms.recordListLoading,
  );
  const [newRecord, setNewRecord] = useRecoilState(atoms.newRecord);
  const [recordKeyword, setRecordKeyword] = useState("");
  const recordShowList = useMemo(() => {
    const recordKeywordSplit = recordKeyword
      .split(" ")
      .filter((item) => item.length > 0);
    if (recordKeywordSplit.length <= 0) {
      return recordList;
    }
    return recordList.filter((item) => {
      return Object.values(item).some((value) => {
        return recordKeywordSplit.some(
          (keyword) => value && value.toString().includes(keyword),
        );
      });
    });
  }, [recordList, recordKeyword]);

  const handleTimeIndexEndClick = (timeIndexEnd: number) => {
    setNewRecord({
      ...newRecord,
      timeIndexBegin: timeIndexEnd,
    });
  };

  const handleTypeClick = (type: string) => {
    setNewRecord({
      ...newRecord,
      type,
    });
  };

  const handleRemarkClick = (remark: string) => {
    setNewRecord({
      ...newRecord,
      remark,
    });
  };

  const handleRecordDateClick = (date: string) => {
    setNewRecord({
      ...newRecord,
      date,
    });
  };

  const handleDeleteClick = (record: Record) => {
    recordApi
      .delete(record)
      .then((response) => {
        console.log("record delete response", response);
        // fetchRecordList();
        setRecordList(recordList.filter((item) => `${item.date}_${item.timeIndexEnd}` !== `${record.date}_${record.timeIndexEnd}`));
      })
      .catch((e) => {
        console.error(e);
        alert(e.response.data.message);
      });
  }

  return (
    <details open>
      <summary>记录列表 | 数量：{recordShowList.length}</summary>

      <fieldset>
        <legend>日期范围筛选</legend>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label htmlFor="recordListSearchFormDateBeginInput">开始日期</label>
            <input
              id="recordListSearchFormDateBeginInput"
              type="date"
              value={recordListSearchForm.dateBegin}
              onChange={(e) => {
                setRecordListSearchForm({
                  ...recordListSearchForm,
                  dateBegin: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <label htmlFor="recordListSearchFormDateEndInput">结束日期</label>
            <input
              id="recordListSearchFormDateEndInput"
              type="date"
              value={recordListSearchForm.dateEnd}
              onChange={(e) => {
                setRecordListSearchForm({
                  ...recordListSearchForm,
                  dateEnd: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => {
              const now = dayjs();
              setRecordListSearchForm({
                dateBegin: now.format("YYYY-MM-DD"),
                dateEnd: now.format("YYYY-MM-DD"),
              });
            }}
          >
            今天
          </button>
          <button
            onClick={() => {
              const now = dayjs();
              setRecordListSearchForm({
                dateBegin: now.day(0).format("YYYY-MM-DD"),
                dateEnd: now.format("YYYY-MM-DD"),
              });
            }}
          >
            本周
          </button>
          <button
            onClick={() => {
              const now = dayjs();
              setRecordListSearchForm({
                dateBegin: now.date(1).format("YYYY-MM-DD"),
                dateEnd: now.format("YYYY-MM-DD"),
              });
            }}
          >
            本月
          </button>
          <button
            onClick={() => {
              const now = dayjs();
              setRecordListSearchForm({
                dateBegin: now.subtract(30, "day").format("YYYY-MM-DD"),
                dateEnd: now.format("YYYY-MM-DD"),
              });
            }}
          >
            近 30 天
          </button>
          <button
            onClick={() => {
              const now = dayjs();
              setRecordListSearchForm({
                dateBegin: now.subtract(60, "day").format("YYYY-MM-DD"),
                dateEnd: now.format("YYYY-MM-DD"),
              });
            }}
          >
            近 60 天
          </button>
          <button
            onClick={() => {
              const now = dayjs();
              setRecordListSearchForm({
                dateBegin: now.subtract(90, "day").format("YYYY-MM-DD"),
                dateEnd: now.format("YYYY-MM-DD"),
              });
            }}
          >
            近 90 天
          </button>
          <button
            onClick={() => {
              const now = dayjs();
              setRecordListSearchForm({
                dateBegin: now.subtract(180, "day").format("YYYY-MM-DD"),
                dateEnd: now.format("YYYY-MM-DD"),
              });
            }}
          >
            近 180 天
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend>关键字筛选</legend>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="多个关键字使用空格分割"
            value={recordKeyword}
            onChange={(e) => setRecordKeyword(e.target.value)}
          />
          <button onClick={() => setRecordKeyword("")}>重置</button>
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
            <th>删除</th>
          </tr>
        </thead>
        <tbody>
          {recordShowList.map((record) => (
            <tr
              key={`${record.date}-${record.timeIndexBegin}-${record.timeIndexEnd}`}
            >
              <td onClick={() => handleRecordDateClick(record.date)}>
                {record.date}
              </td>
              <td>{timeIndexToTimeStr(record.timeIndexBegin)}</td>
              <td onClick={() => handleTimeIndexEndClick(record.timeIndexEnd)}>
                {timeIndexToTimeStr(record.timeIndexEnd)}
              </td>
              <td onClick={() => handleTypeClick(record.type)}>
                {recordTypeEmojiPrefix(record.type)} {record.type}
              </td>
              <td onClick={() => handleRemarkClick(record.remark)}>
                {record.remark}
              </td>
              <td>
                <button onClick={() => handleDeleteClick(record)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {recordListLoading ? (
        <div style={{ textAlign: "center" }}>
          <LoadingSvg />
        </div>
      ) : (
        ""
      )}
    </details>
  );
};

export default RecordListPlane;
