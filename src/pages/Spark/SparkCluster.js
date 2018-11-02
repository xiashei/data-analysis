import React from 'react';
import $ from 'jquery';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/map';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { Card } from 'antd';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文

import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

// export class Tables2 extends React.Component{
//
//     constructor(){
//         super();
//         this.ss = this.ss.bind(this);
//
//     }
//
//     componentDidMount() {
//         this.ss();
//         this.timerID = setInterval(
//             () => this.ss(),
//             10000
//         );
//     }
//
//     componentWillUnmount() {
//         clearInterval(this.timerID);
//     }
//
//
//
//     ss(){
//
//         var myChart = echarts.init(document.getElementById('maino'));
//         var hostStatusClosed;
//         var hostStatusSum;
//         var hostStatusUnavailable;
//         var hostStatusOk;
//
//
//         $.ajax({
//             type: "GET",
//             url:"http://10.0.88.25:7071/hostNumber",
//             dataType: "json",
//             success: function (ff) {
//                 hostStatusClosed = ff.data.hostStatusClosed;
//                 hostStatusSum = ff.data.hostStatusSum;
//                 hostStatusUnavailable = ff.data.hostStatusUnavailable;
//                 hostStatusOk = ff.data.hostStatusOk;
//             },
//             error: function (a) {
//                 console.log(a);
//             },
//             async: false
//         });
//         myChart.setOption({
//             tooltip: {
//                 trigger: 'item',
//                 formatter: "{a} <br/>{b}: {c} ({d}%)"
//             },
//             legend: {
//                 orient: 'vertical',
//                 x: 'left',
//                 data:['hostStatusClosed','hostStatusUnavailable','hostStatusOk']
//             },
//             series: [
//                 {
//                     name:'hostStatus',
//                     type:'pie',
//                     radius: ['50%', '70%'],
//                     avoidLabelOverlap: false,
//                     label: {
//                         normal: {
//                             show: false,
//                             position: 'center'
//                         },
//                         emphasis: {
//                             show: true,
//                             textStyle: {
//                                 fontSize: '20',
//                                 fontWeight: 'bold'
//                             }
//                         }
//                     },
//                     labelLine: {
//                         normal: {
//                             show: false
//                         }
//                     },
//                     data:[
//                         {value:hostStatusClosed, name:'hostStatusClosed'},
//                         {value:hostStatusUnavailable, name:'hostStatusUnavailable'},
//                         {value:hostStatusOk, name:'hostStatusOk'}
//                     ]
//                 }
//             ]
//         });
//     }
//
//
//     render() {
//         return (
//             <div id="maino" style={{ width: 400, height: 400 }}>
//
//             </div>
//         );
//     }
//
//
// }

export default class SparkCluster extends React.Component {
  constructor() {
    super();
    this.ss = this.ss.bind(this);
  }

  componentDidMount() {
    this.ss();
    this.timerID = setInterval(() => this.ss(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  ss() {
    var myChart = echarts.init(document.getElementById('maino'));
    var hostStatusClosed;
    var hostStatusSum;
    var hostStatusUnavailable;
    var hostStatusOk;
    var cput;

    $.ajax({
      type: 'GET',
      url: 'http://10.161.67.206:7071/hostNumber',
      dataType: 'json',
      success: function(ff) {
        cput = ff.data.hostCPUU;
        hostStatusClosed = ff.data.hostStatusClosed;
        hostStatusSum = ff.data.hostStatusSum;
        hostStatusUnavailable = ff.data.hostStatusUnavailable;
        hostStatusOk = ff.data.hostStatusOk;
      },
      error: function(a) {
        console.log(a);
      },
      async: false,
    });
    myChart.setOption({
      title: {
        text: '主机健康情况',
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['关闭', '不可用', '正常'],
      },
      series: [
        {
          color: ['#85a6b5', '#f2b19e', '#96C4E6'],
          name: '主机状况',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            { value: hostStatusClosed, name: '关闭' },
            { value: hostStatusUnavailable, name: '不可用' },
            { value: hostStatusOk, name: '正常' },
          ],
        },
      ],
    });

    var myChart1 = echarts.init(document.getElementById('mainp'));
    console.log(cput);
    myChart1.setOption({
      title: { text: '集群主机CPU使用率' },
      tooltip: {},
      xAxis: {
        name: '使用率',
        data: ['0~20', '20~40', '40~60', '60~80', '80~100'],
      },
      yAxis: {
        name: '主机数',
        type: 'value',
      },

      series: [
        {
          color: ['#96C4E6', '#f2b19e', '#85a6b5'],
          name: '主机数',
          type: 'bar',
          data: cput,
        },
      ],
    });

    var myChart2 = echarts.init(document.getElementById('mainq'));
    var free;
    var total;
    var used;

    $.ajax({
      type: 'GET',
      url: 'http://10.161.67.206:7071/groupMessage',
      dataType: 'json',
      success: function(ff) {
        free = ff.data.freesolt;
        total = ff.data.totalsolt;
        used = total - free;
      },
      error: function(a) {
        console.log(a);
      },
      async: false,
    });
    myChart2.setOption({
      title: {
        text: '资源使用情况',
        subtext: '总节点数: ' + total,
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['空闲', '使用中'],
      },

      series: [
        {
          color: ['#96C4E6', '#f2b19e', '#85a6b5'],
          label: { fontSize: 18 },
          name: 'solt',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [{ value: free, name: '空闲' }, { value: used, name: '使用中' }],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    });
  }

  render() {
    return (
      <div>
        <Card>
          <div
            id="mainp"
            style={{ width: 500, height: 400, float: 'left', position: 'abusolute' }}
          />

          <div
            id="maino"
            style={{ width: 500, height: 400, float: 'left', position: 'abusolute' }}
          />
          <div
            id="mainq"
            style={{ width: 500, height: 400, float: 'left', position: 'abusolute' }}
          />
        </Card>
      </div>
    );
  }
}

// export class Tables3 extends React.Component{
//
//     componentDidMount() {
//         this.ss();
//         this.timerID = setInterval(
//             () => this.ss(),
//             10000
//         );
//     }
//
//     componentWillUnmount() {
//         clearInterval(this.timerID);
//     }
//
//
//     ss(){
//         var myChart = echarts.init(document.getElementById('mainq'));
//         var free;
//         var total;
//         var used;
//         $.ajax({
//             type: "GET",
//             url:"http://10.0.88.25:7071/groupMessage",
//             dataType: "json",
//             success: function (ff) {
//                 free = ff.data.freesolt;
//                 total = ff.data.totalsolt;
//                 used =  total - free;
//             },
//             error: function (a) {
//                 console.log(a);
//             },
//             async: false
//         });
//         myChart.setOption({
//             title : {
//                 text: 'Slot Allocation:Top Level Consumers',
//                 subtext: 'Total Slots: ' + total,
//                 x:'center'
//             },
//             tooltip : {
//                 trigger: 'item',
//                 formatter: "{a} <br/>{b} : {c} ({d}%)"
//             },
//             legend: {
//                 orient: 'vertical',
//                 left: 'left',
//                 data: ['free','spark']
//             },
//             color:['#4169E1','#90EE90'],
//             series : [
//                 {
//                     name: 'solt',
//                     type: 'pie',
//                     radius : '55%',
//                     center: ['50%', '60%'],
//                     data:[
//                         {value:free, name:'free'},
//                         {value:used, name:'spark'}
//                     ],
//                     itemStyle: {
//                         emphasis: {
//                             shadowBlur: 10,
//                             shadowOffsetX: 0,
//                             shadowColor: 'rgba(0, 0, 0, 0.5)'
//                         }
//                     }
//                 }
//             ]
//         });
//     }
//
//     render() {
//         return (
//             <div id="mainq" style={{ width: 400, height: 400 }}>
//
//             </div>
//         );
//     }
//
// }
//
//
