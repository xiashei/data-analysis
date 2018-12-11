import moment from 'moment';

// mock data
const visitData = [];
const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY[i],
  });
}

const visitData2 = [];
const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
for (let i = 0; i < fakeY2.length; i += 1) {
  visitData2.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY2[i],
  });
}

const salesData = [];
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}
const searchData = [];
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2),
  });
}
const salesTypeData = [
  {
    x: '家用电器',
    y: 4544,
  },
  {
    x: '食用酒水',
    y: 3321,
  },
  {
    x: '个护健康',
    y: 3113,
  },
  {
    x: '服饰箱包',
    y: 2341,
  },
  {
    x: '母婴产品',
    y: 1231,
  },
  {
    x: '其他',
    y: 1231,
  },
];

const salesTypeDataOnline = [
  {
    x: '家用电器',
    y: 244,
  },
  {
    x: '食用酒水',
    y: 321,
  },
  {
    x: '个护健康',
    y: 311,
  },
  {
    x: '服饰箱包',
    y: 41,
  },
  {
    x: '母婴产品',
    y: 121,
  },
  {
    x: '其他',
    y: 111,
  },
];

const salesTypeDataOffline = [
  {
    x: '家用电器',
    y: 99,
  },
  {
    x: '食用酒水',
    y: 188,
  },
  {
    x: '个护健康',
    y: 344,
  },
  {
    x: '服饰箱包',
    y: 255,
  },
  {
    x: '其他',
    y: 65,
  },
];

const offlineData = [];
for (let i = 0; i < 10; i += 1) {
  offlineData.push({
    name: `Stores ${i}`,
    cvr: Math.ceil(Math.random() * 9) / 10,
  });
}
const offlineChartData = [];
for (let i = 0; i < 20; i += 1) {
  offlineChartData.push({
    x: (2000 + i).toString(),
    y1: Math.random() * 100,
    F: Math.random() * 100,
    M: Math.random() * 100,
    // y2: Math.floor(Math.random() * 100) + 10,
  });
}

const productUser = [
  { company: 'Tencent', type: '\u817e\u8baf\u5929\u738b\u5361', value: 5344282 },
  { company: 'Tencent', type: '\u817e\u8baf\u5927\u738b\u5361', value: 112173843 },
  { company: 'Tencent', type: '\u817e\u8baf\u5730\u738b\u5361', value: 2 },
  { company: 'Baidu', type: '\u767e\u5ea6\u8d85\u5723\u5361', value: 42835 },
  { company: 'Baidu', type: '\u767e\u5ea6\u5927\u5723\u5361', value: 361024 },
  { company: 'Baidu', type: '\u767e\u5ea6\u5c0f\u5723\u5361', value: 291791 },
  { company: 'Alibaba', type: '\u8682\u8681\u5927\u5b9d\u5361', value: 2823752 },
  { company: 'Didi', type: '\u6ef4\u6ef4\u5927\u738b\u5361', value: 243622 },
  { company: 'Didi', type: '\u6ef4\u6ef4\u5c0f\u738b\u5361', value: 1607991 },
  { company: 'Jingdong', type: '\u4eac\u4e1c\u5927\u5f3a\u5361', value: 37276 },
  { company: 'Jingdong', type: '\u4eac\u4e1c\u5c0f\u5f3a\u5361', value: 71459 },
  { company: 'Zhaohang', type: '\u62db\u884c\u5c0f\u62db\u5361', value: 84102 },
  { company: 'Zhaohang', type: '\u62db\u884c\u5927\u62db\u5361', value: 24610 },
  { company: 'Alibaba', type: '\u8682\u8681\u5c0f\u5b9d\u5361', value: 906937 },
];
const radarOriginData = [
  {
    name: '个人',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: '团队',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: '部门',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
];

const radarData = [];
const radarTitleMap = {
  ref: '引用',
  koubei: '口碑',
  output: '产量',
  contribute: '贡献',
  hot: '热度',
};
radarOriginData.forEach(item => {
  Object.keys(item).forEach(key => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key],
      });
    }
  });
});

const getFakeChartData = { offlineChartData, productUser };

export default {
  'GET /api/fake_chart_data': getFakeChartData,
};
