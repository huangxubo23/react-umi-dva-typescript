import { getProductDetail } from '@/services/taobao';

export default {
  namespace: 'product',

  state: {
    data: {},
  },

  effects: {
    *getProductDetail(action, { call, put }) {
      debugger;
      const response = yield call(getProductDetail);
      debugger;
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
