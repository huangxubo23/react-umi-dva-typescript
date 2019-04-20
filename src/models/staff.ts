export default {
  namespace: 'staff',

  state: {
    data: [
      {
        userName: 'FENG123',
        name: '张三',
        phone: '14564345678',
        id: 'DAFADGAGAGDAFADGAGAGDAFADGAGAGDAFADGAGAG',
        role: '管理员',
        createTime: '2019-08-01 03:00:00 '
      },
      {
        userName: 'FENG123',
        name: '张三',
        phone: '14564345678',
        id: 'DAFADGAGAGDAFADGAGAGDAFADGAGAGDAFADGAGAG',
        role: '管理员',
        createTime: '2019-08-01 03:00:00 '
      },
      {
        userName: 'FENG123',
        name: '张三',
        phone: '14564345678',
        id: 'DAFADGAGAGDAFADGAGAGDAFADGAGAGDAFADGAGAG',
        role: '管理员',
        createTime: '2019-08-01 03:00:00 '
      },
      {
        userName: 'FENG123',
        name: '张三',
        phone: '14564345678',
        id: 'DAFADGAGAGDAFADGAGAGDAFADGAGAGDAFADGAGAG',
        role: '管理员',
        createTime: '2019-08-01 03:00:00 '
      }
    ]
  },

  effects: {
    *getList(action, { call, put }) {
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
    }
  },
};
