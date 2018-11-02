import React from 'react';
import { Radio, Table, Row, Col, List, Progress, Card, Divider } from 'antd';
import $ from 'jquery';
// 引入 ECharts 主模块
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export default class AlluxioMonitor extends React.Component {
  state = {
    value: 'Live',
    list: [],
    livelist: [],
    lostlist: [],
    lostcount: 0,
    percent: 0,
    data1: [
      'Master Address:',
      'Started:',
      'Uptime:',
      'Version:',
      'Running Workers:',
      'Startup Consistency Check:',
    ],
    data2: [],
    data3: [
      'Workers Capacity:',
      'Workers Free / Used:',
      'UnderFS Capacity:',
      'UnderFS Free / Used:',
    ],
    data4: [],
    workersCapacity: '',
    workersUsedF: '',
  };

  componentDidMount() {
    this.ajaxA();
  }

  ajaxA() {
    let statusInfo;
    let masterAddress;
    let workersCapacity;
    let UFSUsed;
    let workersFreeF;
    let runningWorkers;
    let UFSFree;
    let started;
    let version;
    let workersUsedF;
    let uptime;
    let UFSCapacity;
    let percent;
    let workersFreeG;
    let workersUsedG;

    $.ajax({
      type: 'GET',
      url: 'http://10.161.67.206:7071/alluxioMessage',
      dataType: 'json',
      success(data) {
        statusInfo = data.statusInfo;
        workersFreeG = data.workersFreeG;
        workersUsedG = data.workersUsedG;
        masterAddress = data.masterAddress;
        workersCapacity = data.workersCapacity;
        UFSUsed = data.UFSUsed;
        workersFreeF = data.workersFreeF;
        runningWorkers = data.runningWorkers;
        UFSFree = data.UFSFree;
        started = data.started;
        version = data.version;
        workersUsedF = data.workersUsedF;
        uptime = data.uptime;
        UFSCapacity = data.UFSCapacity;
        percent = data.percent * 100;
        percent = Math.ceil(percent);

        if (percent === 100) {
          percent = 99;
        }
      },
      async: false,
    });
    let livelis = [];
    let lostlis = [];
    let lostcount = 0;
    $.ajax({
      type: 'GET',
      url: 'http://10.161.67.206:7071/alluxioWorkers',
      dataType: 'json',
      success(data) {
        livelis = data.liveList;
        lostlis = data.lostList;
        lostcount = lostlis.length;
      },
      async: false,
    });

    this.setState({
      list: livelis,
      lostcount,
      livelist: livelis,
      lostlist: lostlis,
      percent,
      data4: [
        workersCapacity,
        `${workersFreeF  }/${  workersUsedF}`,
        UFSCapacity,
        `${UFSFree  }/${  UFSUsed}`,
      ],
      data2: [masterAddress, started, uptime, version, runningWorkers, statusInfo],
      workersCapacity,
      workersUsedF,
    });
  }

  handleSizeChange = e => {
    const valuel = e.target.value;
    if (valuel == 'Live') {
      this.setState({
        list: this.state.livelist,
        value: 'Live',
      });
    } else {
      this.setState({
        list: this.state.lostlist,
        value: 'Lost',
      });
    }
  };

  changeToRadio = e => {
    this.setState({
      list: this.state.lostlist,
      value: 'Lost',
    });
  };

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'Index',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Node Name',
        dataIndex: 'host',
      },
      {
        title: 'Last Heartbeat',
        dataIndex: 'lastContactSec',
      },
      {
        title: 'State',
        dataIndex: 'state',
      },
      {
        title: 'Workers Capacity',
        dataIndex: 'capacityBytes',
      },
      {
        title: 'Space Used',
        dataIndex: 'usedBytes',
        sorter: (a, b) => {
          const aText = a.usedBytes;


          const bText = b.usedBytes;
          console.log(typeof aText, bText);
          return aText.substring(0, aText.length - 1) - bText.substring(0, bText.length - 1);
        },
      },
      {
        width: 200,
        title: 'Space Used',
        dataIndex: 'percent',
        render: text => {
          const percent = text * 100;
          // console.log(text)
          if (text === 1) {
            var $p = (
              <div style={{ width: 100 }}>
                <Progress percent={99} size="small" format={() => '99%'} />
              </div>
            );
          } else {
            var $p = (
              <div style={{ width: 100 }}>
                <Progress percent={percent.toFixed(0)} size="small" />
              </div>
            );
          }
          return $p;
        },
      },
    ];

    return (
      <div style={{ margin: '20px 20px' }}>
        <Card>
          <Row>
            <Col span={9}>
              <h1>Alluxio Workers Overview</h1>
              <Card title="Cluster Usage Summary">
                <div>
                  <Row>
                    <Col span={12}>
                      <div>
                        <List
                          size="large"
                          dataSource={this.state.data3}
                          renderItem={item => <List.Item>{item}</List.Item>}
                        />
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <List
                          size="large"
                          dataSource={this.state.data4}
                          renderItem={item => <List.Item>{item}</List.Item>}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
              <div style={{ margin: '12px 0px 10px 0px' }}>
                <Radio.Group
                  defaultValue="Live"
                  value={this.state.value}
                  onChange={this.handleSizeChange}
                >
                  <Radio.Button value="Live">Live Workers</Radio.Button>
                  <Radio.Button value="Lost">Lost Workers</Radio.Button>
                </Radio.Group>
              </div>
            </Col>
            <Col span={6}>
              <Card title="Storage Usage Summary">
                <div style={{ margin: '10px 0px 9px 0px' }}>
                  <h4>Storage Alias: MEM</h4>
                </div>
                <Divider />
                <h4>Space Used / Space Capacity </h4>
                <h4>
                  {this.state.workersUsedF} / {this.state.workersCapacity}
                </h4>
                <div style={{ margin: '10px 0px 10px 0px' }}>
                  <Progress
                    type="circle"
                    percent={this.state.percent}
                    format={percent => `${percent}%`}
                  />
                </div>
              </Card>
            </Col>
            <Col span={9}>
              <Card title="Alluxio Summary">
                <div>
                  <Row>
                    <Col span={12}>

                      <div>
                        <List
                          size="large"
                          dataSource={this.state.data1}
                          renderItem={item => <List.Item>{item}</List.Item>}
                        />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <List
                          size="large"
                          dataSource={this.state.data2}
                          renderItem={item => <List.Item>{item}</List.Item>}
                        />
                      </div>
                    </Col>

                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Card style={{margin:'5px,0px'}}>
                <Table columns={columns} dataSource={this.state.list} />
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
