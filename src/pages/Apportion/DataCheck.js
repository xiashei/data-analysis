import React from 'react';
import { Select } from 'antd';
import { Table} from 'antd';
import { Row } from 'antd';
import { Button } from 'antd';
import { Input } from 'antd';
import { Modal} from 'antd';
import { Progress ,Card} from 'antd';
import $ from "jquery"

const {Option} = Select
export default class  DataCheck extends React.Component{

  state={
    loading:false,
    kind:"DAY",
    prov:"76",
    ETL1:[],
    ETL2:[],
    list:[],
    area:"http://10.161.67.206:7072/selectArea?area=1",
    path:"",
    visible: false,
    percent:0,
    bt:"更新GP",
    dis:false,
    date:""
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  ajaxUP = () => {
    var message = "";
    $.ajax({
      type: "GET",
      url: "http://10.161.67.206:7072/updata",
      dataType: "json",
      success: function (data) {

        message = data.message;

      },
    });
    console.log(message);
  };


  handleOk = () => {
    this.setState({
      bt:"更新中",
      percent:0,
      visible: false,
      dis:true
    });
    this.ajaxUP();

  };

  ajaxSS = () => {
    var percent = 0;
    var date = "";
    var load = 0;
    $.ajax({
      type: "GET",
      url: "http://10.161.67.206:7072/getSchedule",
      dataType: "json",
      success: function (data) {

        var percentS = data.percent;
        percent = parseInt(percentS);
        date = data.date;
        var loadS =data.load;
        load = parseInt(loadS);
        console.log(load);
      },
      async: false
    });

    if(load == 0){
      this.setState({
        bt:"更新GP",
        dis:false
      });
    }else{
      this.setState({
        bt:"更新中",
        dis:true
      });
    }


    if(percent == 0){
      this.setState({
        percent:percent,
        date:date,
      });
    }else if(percent == 100){
      // clearInterval(this.timerID);
      this.setState({
        percent:percent,
        date:date
      });
    }else{
      this.setState({
        percent:percent,
        date:date
      });
    }


  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  componentDidMount() {
    this.util();
    this.ajaxSS();
    this.timerID = setInterval(
      () => this.ajaxSS(),
      10000
    );
  }

  handleChange1 = (value) => {

    this.setState({
      kind:value
    });
  };

  handleChange3 = (value) => {
    this.setState({
      area:value
    });


  };
  // onClick2 = () => {
  //
  //     var message = "";
  //     var area = this.state.area;
  //     var path = this.state.path;
  //     console.log(path);
  //     $.ajax({
  //         type: "GET",
  //         url: "http://127.0.0.1:7072/selectArea",
  //         data:{area:area,path:path},
  //         dataType: "json",
  //         success: function (data) {
  //
  //             message = data.message;
  //
  //         },
  //         async: false
  //     });
  //
  //     alert(message);
  //
  // };

  handleChange2 = (value) =>  {

    this.setState({
      prov:value
    });

  };
  settrue = () => {

    this.setState({
      loading:true
    });
    console.log(this.state.loading);
  };
  setfalse = () => {

    this.setState({
      loading:false
    });
  };

  changeInput = (e) =>{
    console.log(e.target.value);
    var path = e.target.value;
    this.setState({
      path:path
    });
  };


  onClick1 = () =>{
    var kind = this.state.kind;
    var prov = this.state.prov;

    this.ajaxA(kind,prov);

  };

  ajaxA = (kind,prov) => {

    var list = [];
    $.ajax({
      type: "GET",
      url: "http://10.161.67.206:7072/select",
      data:{kind:kind,prov:prov},
      dataType: "json",
      success: function (data) {

        list = data.list;

      },
      async: false
    });

    this.setState({
      list:list,
    });
  };


  util = () =>{
    var ETL1 = [];
    var ETL2;
    var lis1 = [11,34,38,86,97,36,13,31,87,51,81,59,79,91,74,89,75];
    var lis2 = [76,10,85,88,17,70,18,71,83,19,90,84,30,50];
    for(var i =0; i < lis1.length; i++){

      var c = <Option value={lis1[i]}>{lis1[i]}</Option>;
      ETL1.push(c)
    }
    // for(var i =0; i < lis2.length; i++){
    //      var d = <Option value={lis2[i]}>{lis2[i]}</Option>;
    //      ETL2.push(d)
    //  }
    //

    this.setState({
      ETL1:ETL1,
      ETL2:lis2.map(pro=><Option value={pro}>{pro}</Option>)
    })
  };


  render(){
    const Search = Input.Search;
    const columns = [{
      title:"Id",
      dataIndex: 'id'
    },{
      title:"p_kind",
      dataIndex: 'p_kind'
    },{
      title:"p_name",
      dataIndex: 'p_name'
    },{
      title:"line_num",
      dataIndex: 'line_num'
    },{
      title:"task_status",
      dataIndex: 'task_status'
    },{
      title:"end_time",
      dataIndex: 'end_time'
    },{
      title:"prov_code",
      dataIndex: 'prov_code'
    },{
      title:"GP_count",
      dataIndex: 'count'
    },{
      title:"value",
      dataIndex: 'value'
    },];


    const { Option, OptGroup } = Select;

    return <Card style={{margin:"20px 20px"}}>
      <div>
        <Row>
          <div style={{float:"left"}}>
            <h1>数据核对导出管理</h1>
            <p>提示：更新GP时无法执行查询和导出操作，请更新完成后进行查询</p>
          </div>
          <div style={{float:"right",margin:"0px 0px 3px 0px"}}>
            <Progress type="circle" percent={this.state.percent} width={80} />
          </div>
        </Row>
        <Row>
          <div style={{float:"left"}}>
            <div style={{float:"left"}}>
              <Select defaultValue="DAY" style={{ width: 120 }} onChange={this.handleChange1}>
                <Option value="DAY">DAY</Option>
                <Option value="MONTH">MONTH</Option>
                <Option value="COLLECT">COLLECT</Option>
                <Option value="CALC">CALC</Option>
                <Option value="ACTUAL">ACTUAL</Option>
                <Option value="TRANS">TRANS</Option>
              </Select>
            </div>
            <div style={{float:"left",margin:"0px 5px"}}>
              <Select
                defaultValue="76"
                showSearch
                style={{ width: 160 }}
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={this.handleChange2}
                filterOption={(input, option) => option.props.children.toString().indexOf(input.toString()) >=0}>
                <OptGroup label="ETL1">
                  {this.state.ETL1}
                </OptGroup>
                <OptGroup label="ETL2">
                  {this.state.ETL2}
                </OptGroup>
              </Select>
            </div>
            <div style={{float:"left"}}>
              <Button type="primary" disabled={this.state.dis} onClick={this.onClick1}>查询</Button>
            </div>
          </div>
          <div style={{float:"left",margin:"0px 5px 0px 17px"}}>
            <div style={{float:"left",margin:"0px 5px"}}>
              <Select defaultValue="http://10.161.67.206:7072/selectArea?area=1" style={{ width: 100 }} onChange={this.handleChange3}>
                <Option value="http://10.161.67.206:7072/selectArea?area=1">1域</Option>
                <Option value="http://10.161.67.206:7072/selectArea?area=2">2域</Option>
                <Option value="http://10.161.67.206:7072/selectArea?area=3">3域</Option>
                <Option value="http://10.161.67.206:7072/selectArea?area=4">4域</Option>
                <Option value="http://10.161.67.206:7072/selectArea?area=5">5域</Option>
                <Option value="http://10.161.67.206:7072/selectArea?area=6">6域</Option>
                <Option value="http://10.161.67.206:7072/selectArea?area=7">7域</Option>
                <Option value="http://10.161.67.206:7072/selectArea?area=8">8域</Option>
              </Select>
            </div>
            <div style={{float:"left"}}>
              <Button type="primary" disabled={this.state.dis} href={this.state.area}>导出</Button>
            </div>
          </div>
          <div style={{float:"right"}}>

            <div style={{float:"right"}}>
              <Button type="primary" disabled={this.state.dis} onClick={this.showModal}>
                {this.state.bt}
              </Button>

              <Modal
                title="提示"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <p>更新大约需要5分钟时间，此过程将无法使用查询和导出功能，确定更新？</p>
              </Modal>
            </div>
            <div style={{float:"right",padding:"6px 7px 0px 0px"}}>
              <p>上次更新时间：{this.state.date}</p>
            </div>
          </div>
        </Row>
      </div>
      <Row>
        <div style={{margin:'10px 0px'}}>
          <Table loading={this.state.loading} pagination={false} columns={columns} dataSource={this.state.list}/>
        </div>
      </Row>

    </Card>

  }
}
