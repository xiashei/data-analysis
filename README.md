

<h1 align="center">数据分析</h1>

<div align="center">

历史话费查询




</div>


## 数据分析！! 🎉🎉🎉

展示历年话费信息

## Features




### Use bash

```bash
$ git clone https://github.com/xiashei/data-analysis.git data-analysis
$ cd data-analysis
$ npm install
$ npm start         # visit http://localhost:8000
```

## 使用帮助
找到"data-analyze/src/services/api.js" 的fakeChartData函数，将地址改为真实端口
```
export async function fakeChartData() {
  return request('/api/fake_chart_data');
}
更改"'/api/fake_chart_data'"地址
```


