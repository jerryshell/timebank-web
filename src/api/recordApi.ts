import api from './api'
import Record from '../interfaces/Record'

const recordApi = {
    list: () => {
        return api.get('/record/list')
    },
    search: (data: {
        dateBegin: string,
        dateEnd: string,
    }) => {
        return api.post('/record/search', data)
    },
    create: (data: Record) => {
        return api.post('/record/create', data)
    },
}

export default recordApi
