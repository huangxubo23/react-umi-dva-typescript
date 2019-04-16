
export default {
  namespace: 'hotSpaceImage',

  state: {
    visible: false,
    callback: null,
    data: {
      picWidth: 790,
      picHeight: 1009,
      showPoint: false,
      hotSpaces: [],
      url: "//img.alicdn.com/imgextra/i1/549657177/O1CN01OGAnQY22t74mAjo5t_!!549657177.jpg",
    }
  },

  effects: {
    *getProductDetail(action, { call, put }) {
    },
  },

  reducers: {
    init(state) {
    },
    update(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateData(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        }
      }
    }
  },
};
