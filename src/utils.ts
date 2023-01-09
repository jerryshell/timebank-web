import dayjs from 'dayjs'

const nowTimeIndex = () => {
    const now = dayjs()
    return ~~(now.get('hour') * 2 + now.get('minute') / 30)
}

export default {
    nowTimeIndex,
}
