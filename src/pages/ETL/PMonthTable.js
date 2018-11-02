import {  Affix, DatePicker,Form,Radio,Select, Checkbox,Button,Tooltip,TreeSelect,Card,Row,Col,Tabs,message } from 'antd';
import React, { Component } from 'react';

import 'antd/dist/antd.css';

import './Monitor.css'
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import Tables from './Tables'
import 'whatwg-fetch'
import NPMonthTable from "./NPMonthTable"
import moment from 'moment';
import 'echarts/map/js/china'
const FormItem = Form.Item;

const{ Option}=Select;
const { MonthPicker } = DatePicker;

const TabPane = Tabs.TabPane
const dict={
  "load":"入库" ,
  "receivegz":"接收",
  "trans":"格转",
  "alluxio":"Alluxio"
};
const domains=['1','2','3','4','5','6','7','8']
const domainProvince={
  '1':["11 北京","34 江苏","38 福建","86 云南"],
  '2':["97 黑龙江","36 浙江","13 天津","31 上海","87 甘肃"],
  '3':["51 广东","81 四川","59 广西","79 西藏"],
  '4':["91 辽宁","74 湖南","89 新疆","75 江西"],
  '5':["76 河南","10 内蒙古","85 贵州","88 宁夏"],
  '6':["17 山东","70 青海"],
  '7':["18 河北","71 湖北","83 重庆"],
  '8':["19 山西","90 吉林","84 陕西","30 安徽","50 海南"]
}


class echatOption{
  constructor(id,chartsType,data){
    this.id = id;
    this.chartsType=chartsType;
    if(this.id==='receivegz'){
      this.legend={
        orient: 'vertical',
        x: 'left',
        data:['未执行','已完成','异常'],
        top:'30px',
      }
    }
    if(this.chartsType==="pie"){
      if(data){
        this.tooltip ={
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)",
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = {top: 60};
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] =0;
            return obj;
          }


        };
        this.data=[{value:data["unexecuted"].length,name:"未执行"},
          {value:data["complete"].length,name:"已完成"},
          {value:data["exception"].length,name:"异常"}
        ];
        // console.log(data["complete"])
      }

      this.title ={
        text: dict[this.id]+'情况',
        x:"center"
      };
      this.series = [
        {
          label:{fontSize:18,show:false},
          name: '表格状态',
          type:'pie',
          radius : '55%',
          center: ['50%', '60%'],
          color:["#f2b19e","#96C4E6","#85a6b5"],
          data:this.data,

          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    } else{
      // console.log(data)
      let thisMonthDatas=[];
      let lastMonthDatas=[];
      let tableNames=[];
      let changeRate=[];
      let changeNum=[];
      if(data[0]&&data[1]){
        for(let table of data[0] ){
          let name
          if(table.provInfo){
            name =table.provInfo+table.tableName
          }else{
            name = table.tableName
          }
          tableNames.push(name)
          thisMonthDatas.push(table.transNum)
        }}
      for(var i=0;i<tableNames.length;i++){
        for(let table of data[1]){
          let name
          if(table.provInfo){
            name =table.provInfo+table.tableName
          }else{
            name = table.tableName
          }
          if (name===tableNames[i]){
            lastMonthDatas.push(table.transNum);
            changeRate.push(table.transNum?((thisMonthDatas[i]-table.transNum)/table.transNum*100).toFixed(2):0);
            changeNum.push((thisMonthDatas[i]-table.transNum===0)?1:Math.abs(thisMonthDatas[i]-table.transNum))
          }
        }

      }
      // console.log(thisMonthDatas,lastMonthDatas,changeRate)
      this.data={tableName:tableNames,thisMonth:thisMonthDatas,lastMonth:lastMonthDatas,changeRate:changeRate,changeNum:changeNum};

      this.title ={
        text: '格转与上月相比情况',
        x:"left"
      };
      this.tooltip = {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow',     // 默认为直线，可选为：'line' | 'shadow'
        }
      },
        this.legend={
          data:['本月格转（条）', '上月格转(条)','环比增长(%)','差异条数'],
          x:"right",
          width:'1600'

        },
        this.grid= {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        this.yAxis = [
          {
            type : 'log',
            logBase:'100',
            name:'数量',
            axisLabel: {
              formatter: (value)=>{
                if(value<10000){
                  return value
                }else if(value<100000000){
                  return (value/10000)+'万'
                }else{
                  return (value/100000000)+'亿'
                }
              }
            }
          },
          {
            type: 'value',
            name: '变化率(%)',
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],

        this.xAxis =[
          {
            type : 'category',
            data : this.data['tableName'],

          }
        ],
        this.series =[
          {
            name:'本月格转（条）',
            type:'bar',
            data:this.data['thisMonth'],
            color:["#C7E1F0"],

          }, {
            name:'上月格转(条)',
            type:'bar',
            data:this.data['lastMonth'],
            color:["#96C4E6"],
          },
          {
            name:'环比增长(%)',
            type:'line',
            yAxisIndex:1,
            data:this.data['changeRate'],
            color:["#f2b19e"],
          },
          {
            name:'差异条数',
            type:'bar',
            // yAxisIndex:1,
            data:this.data['changeNum'],

          }

        ]}

  }

}
class EchartMap extends Component{



  render(){
    let id=this.props.id;
    if(this.props.data){
      let charts = echarts.init(document.getElementById(this.props.id));

      let data = this.props.data;

      let tableData=[];
      let stateDictChinese={"unexecuted":"未执行",'complete':"已完成","exception":"异常","running":"未完成"};
      let stateDict={"unexecuted":"2",'complete':"1","exception":"3","running":"4"};

      for(var state of ["unexecuted",'complete',"exception","running"]){
        for (var pro of data[state]){
          tableData.push({name:pro,value:[state,stateDict[state]]})
          // tableData.push(["10 内蒙古",'1'])
        }
        // console.log(tableData)
      }

      const option = {

        title: {
          text:`全国${dict[id]}情况`,

          left: 'center'
        },
        tooltip:{
          position:'top',
          formatter:(params)=> {
            if(params.data){
              return (params.data.name + ":" + (stateDictChinese[params.data.value[0]]))}
          }
        },
        dataRange: {
          min: 0,
          max: 5,
          x: '5%',
          y: '80%',

          splitList: [
            {
              start: 3.5,
              end: 4.5,
              label: '未完成',
              color: '#ffa754'
            },
            {
              start: 2.5,
              end: 3.5,
              label: '异常',
              color: '#ff472e'
            }, {
              start: 1.5,
              end: 2.5,
              label: '未执行',
              color: '#80bfff'

            },

            {
              start:0,
              end: 1.5,
              label: '已完成',
              color: '#45d979'
            },

          ],
          color: ['red', 'gold', 'lightgrey'],

        },
        series: [
          {hoverAnimation:true,
            name: '全国',
            type: 'map',
            mapType: 'china',
            roam: false,
            label: {
              show: false,
              emphasis:{show:false}
            },
            data:tableData,

            nameMap:{
              "澳门":null,
              "香港":null,
              "台湾":null,
              "内蒙古":"10 内蒙古",
              "北京":"11 北京",
              "天津":"13 天津",
              "山东":"17 山东",
              "河北":"18 河北",
              "山西":"19 山西",
              "安徽":"30 安徽",
              "上海":"31 上海",
              "江苏":"34 江苏",
              "浙江":"36 浙江",
              "福建":"38 福建",
              "海南":"50 海南",
              "广东":"51 广东",
              "广西":"59 广西",
              "青海":"70 青海",
              "湖北":"71 湖北",
              "湖南":"74 湖南",
              "江西":"75 江西",
              "河南":"76 河南",
              "西藏":"79 西藏",
              "四川":"81 四川",
              "重庆":"83 重庆",
              "陕西":"84 陕西",
              "贵州":"85 贵州",
              "云南":"86 云南",
              "甘肃":"87 甘肃",
              "宁夏":"88 宁夏",
              "新疆":"89 新疆",
              "吉林":"90 吉林",
              "辽宁":"91 辽宁",
              "黑龙江":"97 黑龙江"
            }
          }
        ]
      };
      charts.setOption(option)}

    return(
      <div>
        <div id={this.props.id} style={{ float:"left",width: 400, height: 500 }}></div>
      </div>
    )
  }
}
class EchartPie extends Component{
  //根据option生成Echart组件
  componentDidUpdate(){
    let charts = echarts.init(document.getElementById(this.props.id));
    let option = new echatOption(this.props.id,this.props.chartsType,this.props.data)
    charts.setOption(option);
    // console.log(this.props.data)
  }
  render(){if(this.props.chartsType==='pie'){
    return(
      <div>
        <div id={this.props.id} style={{ float:"left",width: 400, height: 400 }}></div>
      </div>

    )}else{
    return(<div>
      <div id={this.props.id} style={{ float:"left",width: 1500, height: 400 }}></div>
    </div>)
  }
  };

}

const ExceptionRadio =(props)=>{
  //选择异常类型的组件
  return (
    <Radio.Group  buttonStyle="solid" size={'default'} value={props.value} onChange={props.onChange}>
      <Radio.Button value={'receivegzData'}>接收异常</Radio.Button>
      <Radio.Button value={'loadData'}>入库异常</Radio.Button>
      <Radio.Button value={'transData'}>格转异常</Radio.Button>
      <Radio.Button value={'alluxioData'}>Alluxio异常</Radio.Button>
      <Radio.Button value={'none'}>清空</Radio.Button>
    </Radio.Group>)
}

const HiveToAlluxio =(props)=>{
  return(
    <Card style={{float:'left'}} title={"执行入库"} >
      <TreeSelect {...props.tProps}/>
      <Button  onClick={props.clickHiveButton} disabled={props.tProps.value.length===0}style={{margin:"10px 0 10px 20px"}}>开始入库</Button>
      <Tabs>
        <TabPane tab="正在运行" key="1">{props.running}</TabPane>
        <TabPane tab="已完成" key="2">{props.completed}</TabPane>
        <TabPane tab="异常" key="3">{props.error}</TabPane>
      </Tabs>
    </Card>
  )
}
export default class ProMonthTable extends NPMonthTable{
  //分省月表
  constructor(){
    super();
    this.state.tableType='pmonth';
    this.state.domain='8';
  }
  // handleCycleChange=(value)=>{
  //     this.setState({cycle:value})
  // }
  handleDomainChange=(value)=> {
    let pro = value.substring(0,2)
    this.setState({domain:pro,exception:"default"});
    let day = this.state.date
    let lastMonth=this.state.cycle+'/'+moment(day).add(-1,"month").startOf("month").format('YYYYMMDD')+'/'+pro
    day =`${this.state.cycle}/${day}/${pro}`;
    this.fetchOwn(`http://10.161.67.206:38081/srft/etl/${this.state.tableType}/${day}/detail`,'tableData')
    // console.log(this.state.tableData)
    this.fetchOwn(`http://10.161.67.206:38081/srft/etl/${this.state.tableType}/${day}`,'thisMonthTrans')
    this.fetchOwn('http://10.161.67.206:38081/srft/etl/'+this.state.tableType+'/'+lastMonth,'lastMonthTrans')
    this.fetchOwn('http://10.161.67.206:38081/srft/etl/'+this.state.tableType+'/'+day+'/detail/receivegz','receivegzDataPro')
    this.fetchOwn('http://10.161.67.206:38081/srft/etl/'+this.state.tableType+'/'+day+'/detail/load','loadDataPro')
    this.fetchOwn('http://10.161.67.206:38081/srft/etl/'+this.state.tableType+'/'+day+'/detail/trans','transDataPro')
    console.log('http://10.161.67.206:38081/srft/etl/'+this.state.tableType+'/'+day+'/detail/trans')
    this.fetchOwn('http://10.161.67.206:38081/srft/etl/'+this.state.tableType+'/'+day+'/detail/alluxio','alluxioDataPro')



  }
  render(){
    const children=[];
    const provinces=[
      "10 内蒙古",
      "11 北京",
      "13 天津",
      "17 山东",
      "18 河北",
      "19 山西",
      "30 安徽",
      "31 上海",
      "34 江苏",
      "36 浙江",
      "38 福建",
      "50 海南",
      "51 广东",
      "59 广西",
      "70 青海",
      "71 湖北",
      "74 湖南",
      "75 江西",
      "76 河南",
      "79 西藏",
      "81 四川",
      "83 重庆",
      "84 陕西",
      "85 贵州",
      "86 云南",
      "87 甘肃",
      "88 宁夏",
      "89 新疆",
      "90 吉林",
      "91 辽宁",
      "95 智网科技",
      "97 黑龙江"
    ]
    const domainOptions=domains.map
    ((domain)=><Option key={domain}>{domain}域  ({domainProvince[domain].join(',')})</Option>)
    // const cityOptions=
    for (var pro of provinces){
      children.push(<Option key = {pro}>{pro}</Option>)
    }

    return(

      <Card>
        <div>
          <Affix offsetTop={20}>
            <MonthPicker defaultValue={moment(this.state.date,'YYYYMMDD')}
                         allowClear={false} onChange={this.onChange} placeholder="选择日期"/>
            <Select
              showSearch
              style={{ margin:'0 0 0 20px',width: 400 }}
              placeholder="选择域"
              optionFilterProp="children"
              onChange={this.handleDomainChange}
              defaultValue={'8' }
              filterOption={(input, option) => option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0}
              // filterOption={(input, option) => console.log(input,option)}>
            >
              {domainOptions}
            </Select>
            <Select
              showSearch
              style={{ margin:'0 0 0 20px',width: 400 }}
              placeholder="选择账期类型"
              optionFilterProp="children"
              onChange={this.handleCycleChange}
              defaultValue={this.state.cycle}
              filterOption={(input, option) => option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0}
              // filterOption={(input, option) => console.log(input,option)}>
            >
              <Option key={"formal"}>正式出账</Option>
              <Option key={"prep"}>预出帐</Option>
            </Select>
          </Affix></div>
        <Row>
          <Col span={6}>
            <EchartMap id ="receivegz" chartsType={"pie"} data={this.state.receivegzData} />
          </Col>
          <Col span={6}>
            <EchartMap id ="load" chartsType={"pie" } data={this.state.loadData}/>
          </Col>
          <Col span={6}>
            <EchartMap id ="trans" chartsType={"pie"} data={this.state.transData}/>
          </Col >
          <Col span={6}>
            <EchartMap id ="alluxio" chartsType={"pie"} data={this.state.alluxioData}/>
          </Col>
        </Row>
        <div style={{float:'left',margin:"10px 1000px 0 0"}}>
          <strong style={{float:'left',color:'#e66673'}}>异常检测:  </strong>
          <FormItem  >
            <ExceptionRadio value={this.state.exception} onChange={this.handleExceptionChange}/>
          </FormItem>
        </div>
        <Row>
          <Tables data={this.state.tableData } type={'proMonth'} reFresh={this.reFreshButton}/></Row>
        <EchartPie id ="history" chartsType={"bar"} data={[this.state.thisMonthTrans,this.state.lastMonthTrans]} />

      </Card>
    )
  }
}
