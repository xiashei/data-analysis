import React from 'react';
import { Divider, Select, Row, Col, Card, Table, Radio, Button } from 'antd';

import $ from 'jquery';

const { Option } = Select;
export default class SparkIBM extends React.Component {
  state = {
    defv: null,
    list: [],
    uuid: null,
    state: null,
    name: null,
    coresUsed: null,
    running: '0',
    blockedhosts: '0',
    sparkVersion: null,
    memoryUsed: null,
    slots: null,
    hosts: null,
    list1: [],
    value: 'RUNNING',
    listR: [],
    listF: [],
  };

  componentWillMount() {
    this.ajaxV();
  }

  ajaxV = () => {
    var uui = null;
    var name = null;
    var lis = [];
    var defv = null;
    $.ajax({
      type: 'GET',
      url: 'http://10.161.67.206:7071/consumersMessage',
      dataType: 'json',
      success: function(data) {
        var t = [];
        t = data;
        for (var i = 0; i < t.length; i++) {
          uui = t[i].uuidname[0];
          name = t[i].uuidname[1];

          var c = <Option value={uui}>{name}</Option>;
          lis.push(c);
        }
        defv = t[0].uuidname[0];
      },
      async: false,
    });

    this.ajaxA(defv);

    this.ajaxC(defv);
    this.setState({
      list: lis,
      defv: defv,
    });
  };

  ajaxA = uuid => {
    var sparkVersion;
    var EGO;
    var deployed;
    var deploymentDirectory;
    var sparkHomeDirectory;
    var consumer;
    var hosts;
    var slots = [];
    var coresUsed = [];
    var memoryUsed = [];
    var type;
    var URL;
    var restURL;
    var state;
    var running;
    var blocked;
    $.ajax({
      type: 'GET',
      url: 'http://10.161.67.206:7071/overview',
      data: { uuid: uuid },
      dataType: 'json',
      success: function(data) {
        sparkVersion = data.sparkVersion;
        EGO = data.ego;
        deployed = data.deployed;
        deploymentDirectory = data.deploymentDirectory;
        sparkHomeDirectory = data.sparkHomeDirectory;
        consumer = data.consumer;
        hosts = data.hosts;
        slots = data.slots;
        coresUsed = [] = data.coresUsed;
        memoryUsed = [] = data.memoryUsed;
        type = data.type;
        URL = data.url;
        restURL = data.restURL;
        state = data.state;
        running = data.running;
        blocked = data.blocked;
      },
      async: false,
    });

    this.setState({
      uuid: uuid,
      state: state,
      name: consumer,
      coresUsed: coresUsed[0],
      running: running,
      blockedhosts: blocked,
      sparkVersion: sparkVersion,
      memoryUsed: memoryUsed[0],
      hosts: hosts,
      slots: slots[0],
    });
  };

  ajaxC = uuid => {
    var list = [];
    var listR = [];
    var listF = [];
    $.ajax({
      type: 'GET',
      url: 'http://10.161.67.206:7071/sparkUI',
      data: { uuid: uuid },
      dataType: 'json',
      success: function(data) {
        listR = data.running;
        listF = data.finished;
      },
      async: false,
    });

    console.log(this.state.value);
    if (this.state.value == 'RUNNING') {
      list = listR;
    } else {
      list = listF;
    }
    this.setState({
      list1: list,
      listR: listR,
      listF: listF,
    });
  };

  onClick1 = () => {
    this.ajaxA(this.state.uuid);
    this.ajaxC(this.state.uuid);
  };

  handleChange = value => {
    this.ajaxA(value);
    this.ajaxC(value);
  };

  handleSizeChange = e => {
    var valuel = e.target.value;
    console.log(valuel);
    if (valuel == 'RUNNING') {
      this.setState({
        list1: this.state.listR,
        value: 'RUNNING',
      });
      console.log(1);
    } else {
      this.setState({
        list1: this.state.listF,
        value: 'FINISHED',
      });
      console.log(2);
    }
  };

  render() {
    const columns = [
      {
        width: 250,
        title: 'Application ID',
        dataIndex: 'applicationID',
      },
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Demand',
        dataIndex: 'demand',
      },
      {
        title: 'Planned',
        dataIndex: 'planned',
      },
      {
        title: 'Allocated',
        dataIndex: 'allocated',
      },
      {
        title: 'Submitted Time',
        dataIndex: 'submittedTime',
      },
      {
        title: 'User',
        dataIndex: 'user',
      },
      {
        title: 'State',
        dataIndex: 'state',
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
      },
    ];

    const gridStyle = {
      width: '25%',
      textAlign: 'center',
    };

    return (
      <Card style={{ margin: '20px 20px' }}>
        <Row>
          <Col span={10}>
            <h1>Spark Instance Groups for all consumers</h1>
          </Col>
          <Col span={14}>
            <div style={{ margin: '5px 0' }}>
              <Select
                defaultValue={this.state.defv}
                showSearch
                style={{ width: 200 }}
                placeholder="Instance Group List"
                optionFilterProp="children"
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.state.list}
              </Select>
            </div>
          </Col>
        </Row>
        <Divider>Overview</Divider>
        <Row>
          <Card>
            <Col span={6}>
              <h1>{this.state.name}</h1>
              <p>uuid: {this.state.uuid}</p>
            </Col>
            <Col span={18}>
              <Card.Grid style={gridStyle}>SparkVersion: {this.state.sparkVersion}</Card.Grid>
              <Card.Grid style={gridStyle}>Slots: {this.state.slots}</Card.Grid>
              <Card.Grid style={gridStyle}>Hosts: {this.state.hosts}</Card.Grid>
              <Card.Grid style={gridStyle}>
                MemoryUsed: {this.state.memoryUsed}
                MB
              </Card.Grid>
            </Col>
          </Card>
        </Row>

        <div>
          <Card>
            <Col span={6}>
              <div style={{ padding: '30px' }}>
                <p>State</p>
                <h1>{this.state.state}</h1>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ padding: '30px' }}>
                <p>Running applications</p>
                <h1>{this.state.running}</h1>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ padding: '30px' }}>
                <p>Blocked hosts</p>
                <h1>{this.state.blockedhosts}</h1>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ padding: '30px' }}>
                <p>Cores used</p>
                <h1>{this.state.coresUsed}</h1>
              </div>
            </Col>
          </Card>
        </div>
        <Row>
          <div>
            <div style={{ margin: '10px 0px' }}>
              <Row>
                <Col span={8}>
                  <Radio.Group
                    defaultValue="RUUNING"
                    value={this.state.value}
                    onChange={this.handleSizeChange}
                  >
                    <Radio.Button value="RUNNING">Running Applications</Radio.Button>
                    <Radio.Button value="FINISHED">Completed Applications</Radio.Button>
                  </Radio.Group>
                </Col>
                  <Button style={{float:"right"}} type="primary" onClick={this.onClick1}>
                    刷新
                  </Button>

              </Row>
            </div>
            <Table rowKey="applicationID" columns={columns} dataSource={this.state.list1} />
          </div>
        </Row>
      </Card>
    );
  }
}
