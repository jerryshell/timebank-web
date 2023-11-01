import Record from "../interfaces/Record";
import api from "./api";

const recordApi = {
  list: () => {
    return api.get("/record/list");
  },
  search: (data: { dateBegin: string; dateEnd: string }) => {
    return api.post("/record/search", data);
  },
  create: (data: Record) => {
    return api.post("/record/create", data);
  },
  delete: (data: Record) => {
    return api.post("/record/delete", data);
  }
};

export default recordApi;
