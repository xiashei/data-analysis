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
                <div id={this.props.id} style={{ float:"left",width: 1600, height: 400 }}></div>
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

export  class NPMonthTables extends Component{
    //不分省月表
    state={
        date:'',
        tableData:null,
        receivegzData:null,
        loadData:null,
        transData:null,
        alluxioData:null,
        exception:'default',
        tableType:'npmonth',
        thisMonthTrans:null,
        lastMonthTrans:null,
        domain:null,
        receivegzDataPro:null,
        loadDataPro:null,
        transDataPro:null,
        alluxioDataPro:null,
        cycle:'formal',//账期
        treeValue:[],
        runningTable:[],
        completedTable:[],
        errorTable:[]
    }

    componentWillMount(){
        //初始化及定时刷新
        let defaultDay;
        let dayNow=moment().format("DD")
        let cycle;
        if (this.state.tableType==='day') {
           defaultDay = moment().add(-1, 'month').endOf('month').format('YYYY-MM-DD');
            this.onChange(1,defaultDay)
        }else{

            if(dayNow>20){
                defaultDay = moment().startOf('month').format('YYYY-MM-DD');
                if(dayNow==moment().endOf('month').format('DD')){
                    cycle = 'formal'
                }else{
                    cycle='prep'
                }
            }else{
                defaultDay = moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD');
            cycle='formal'}
            this.onChange(1,defaultDay,cycle)

        }

        this.timer=setInterval(()=>{
            this.reFresh(this.state.exception,this.state.date,this.state.cycle);
            // console.log(this.state)
        },30000)

    }
    //账期变化
    handleCycleChange=(value)=>{
        this.setState({cycle:value})
        this.reFresh(this.state.exception,this.state.date,value)
    }
    reFresh=(exception,time,cycle)=>{
        //根据当前的“exception"判断刷新内容
        if(exception==="default"){
            this.onChange(1,time,cycle)
        }else{
            this.handleExceptionChange({target:{value:exception}},cycle)
        }

    }
    reFreshButton=()=>{
        this.reFresh(this.state.exception,this.state.date,this.state.cycle)
        message.success("刷新成功")
        console.log(2222)
    }
    componentWillUnmount(){
        clearInterval(this.timer)
    }
//获取远程数据

    fetchOwn=(url,dataName,flag=false)=>{
        // console.log(url)
         fetch(url)
            .then((response) => {
                if (response.ok) {
                    return( response.json())
                } else {
                    return Promise.reject('Something was wrong')
                }
            })
            .then(flag?(result)=>{
                if(result.data.info){
                    let datas=result.data.info
                    let dataList=[]
                    let count=0
                    for(let key in datas){

                        if(datas.hasOwnProperty(key)){
                            let Key=0
                            for (let tempdata of datas[key]){
                                var childKey=count.toString()+Key.toString()
                                tempdata.key=childKey
                                // tempdata.provInfo=null
                                // console.log(tempdata)
                                Key+=1
                            }

                            dataList.push({key:count,domain:this.state.domain+'域',provInfo:key,children:datas[key]
                            })
                            count+=1}
                    }
                    this.setState({[dataName]:dataList,thisMonthTrans:dataList})
                }else{
                    this.setState({[dataName]:result.data,thisMonthTrans:result.data})
                }
                }:(result)=>{
                if(result.data.info){
                    let datas=result.data.info
                    let dataList=[]
                    let count=0
                    for(let key in datas){
                        if(datas.hasOwnProperty(key)){
                            let Key=0
                            for (let tempdata of datas[key]){
                                var childKey=count.toString()+Key.toString()
                                tempdata.key=childKey
                                tempdata.provInfo=null
                                // console.log(tempdata)
                                Key+=1
                            }

                        dataList.push({key:count,domain:this.state.domain+'域',provInfo:key,children:datas[key]
                        })
                        count+=1}
                    }
                    // console.log(dataList)
                    this.setState({[dataName]:dataList,exceptionList:result.data.exception})
                }else{this.setState({[dataName]:result.data})}})
            .catch(error => console.log('error is', error));
        }
//日期变化
    onChange=(_,dateString,cycle)=>{
        //根据日期和是否分省获取不同的数据
        // console.log(cycle)
        let day=moment(dateString,'YYYY-MM-DD').format('YYYYMMDD')
        let dataCycle=cycle||this.state.cycle
        // let day = dateString.replace(/-/g,"");
        // console.log(day)
        // console.log(day)
        let lastMonth ;
        this.setState({date:day,exception:"default",cycle:cycle})
        if(this.state.tableType==='day'){
            lastMonth= moment(day).add(-1,"month").endOf("month").format('YYYYMMDD')
        }else{
            lastMonth=`${dataCycle}/${moment(day).add(-1,"month").startOf("month").format('YYYYMMDD')}`
            day=`${dataCycle}/${day}`
        }
        if(this.state.domain){
            lastMonth=lastMonth+'/'+this.state.domain
        }


        this.fetchOwn('http://10.161.67.206:38081/srft/etl/'+this.state.tableType+'/'+day+'/detail/receivegz','receivegzData')
        this.fetchOwn('http://10.161.67.206:38081/srft/etl/'+this.state.tableType+'/'+day+'/detail/load','loadData')
        this.fetchOwn('http://10.161.67.206:38081/srft/etl/'+this.state.tableType+'/'+day+'/detail/trans','transData')
        this.fetchOwn('http://10.161.67.206:38081/srft/etl/'+this.state.tableType+'/'+day+'/detail/alluxio','alluxioData')


        if (this.state.domain) {
            day = `${day}/${this.state.domain}`;
            this.fetchOwn('http://10.161.67.206:38081/srft/etl/' + this.state.tableType + '/' + day + '/detail/receivegz', 'receivegzDataPro')
            this.fetchOwn('http://10.161.67.206:38081/srft/etl/' + this.state.tableType + '/' + day + '/detail/load', 'loadDataPro')
            this.fetchOwn('http://10.161.67.206:38081/srft/etl/' + this.state.tableType + '/' + day + '/detail/trans', 'transDataPro')
            this.fetchOwn('http://10.161.67.206:38081/srft/etl/' + this.state.tableType + '/' + day + '/detail/alluxio', 'alluxioDataPro')
            // console.log(`http://10.161.67.206:38081/srft/etl/${this.state.tableType}/${day}/detail/alluxio`,this.state.alluxioDataPro,this.state.tableData)
            this.fetchOwn(`http://10.161.67.206:38081/srft/etl/${this.state.tableType}/${day}/detail`, 'tableData')

        }else{
            this.fetchOwn(`http://10.161.67.206:38081/srft/etl/${this.state.tableType}/${day}`,'tableData')
        }

        this.fetchOwn(`http://10.161.67.206:38081/srft/etl/${this.state.tableType}/${day}`,'thisMonthTrans')
        this.fetchOwn('http://10.161.67.206:38081/srft/etl/'+this.state.tableType+'/'+lastMonth,'lastMonthTrans')


    }
//选择异常类型
    handleExceptionChange=(e,cycle)=>{
        //通过修改state.exception修改表格的数据来源
        let value=e.target.value;
        let dataCycle=cycle||this.state.cycle
        if(value==='none'){
            let day=this.state.date;
            if (this.state.domain){
                day=`${day}/${this.state.domain}/detail`
                // console.log(this.state.tableData,this.state.receivegzDataPro,this.state.receivegzData)
            }
            if(this.state.tableType!=='day'){
                day=`${dataCycle}/${day}`
            }
            this.fetchOwn(`http://10.161.67.206:38081/srft/etl/${this.state.tableType}/${day}`,'tableData');
            console.log(`http://10.161.67.206:38081/srft/etl/${this.state.tableType}/${day}`)
            this.setState({exception:'default'})
            // this.fetchOwn(`http://10.161.67.206:38081/srft/etl/${this.state.tableType}/${day}`,'tableData');
            // console.log(`http://10.161.67.206:38081/srft/etl/${this.state.tableType}/${day}`)

        }else{

            if(this.state.domain){
                let tableData=[]
                let datas = this.state[e.target.value+'Pro']
                let count = 0
                for(let key in datas){

                    if(datas.hasOwnProperty(key)){
                        let Key=0
                        var childKey

                        for (let tempData of datas[key].exception){

                             childKey=count.toString()+Key.toString()
                            tempData.key=childKey
                            // tempdata.provInfo=null
                            // console.log(tempdata)
                            Key+=1
                        }
                        if(datas[key].exception!=false){
                        tableData.push({key:count,domain:this.state.domain+'域',provInfo:key,children:datas[key].exception
                        })}
                        count+=1
                    console.log(tableData)}
                }
                this.setState({ exception: e.target.value,tableData:tableData })
                // console.log(this.state.tableData,this.state.receivegzDataPro,this.state.receivegzData)

            }else{
        this.setState({ exception: e.target.value,tableData:[this.state[e.target.value].exception][0] })
            }
        }
        // console.log(this.state.tableData,this.state.receivegzData)


}
//执行入库操作
    onTreeChange = (value) => {
        console.log('onChange ', value);
        this.setState({ treeValue:value });
    }

    clickHiveButton = () =>{
        this.setState({treeValue:[],runningTable:[...this.state.runningTable,this.state.treeValue.join()]})
        message.success("提交成功")
    }
    render(){
        const treeData = [{
            title: '可运行',
            value: '0-0',
            key: '0-0',
            selectable:false,
            children: [{
                title: '福建',
                value: '0-0-0',
                key: '0-0-0',
                children: [{
                    title: 'tf',
                    value: '福建 tf福建 tf福建 tf福建 tf',
                    key: '0-0-0-0',
                },
                    {
                        title: 'tw',
                        value: '福建 tw福建 tf福建 tf福建 tf福建 tf',
                        key: '0-0-0-1',
                    }]
            }],
        }, {
            title: 'Node2',
            value: '0-1',
            key: '0-1',
            disabled:true,
            children: [{
                title: 'Child Node3',
                value: '0-1-0',
                key: '0-1-0',
            }, {
                title: 'Child Node4',
                value: '0-1-1',
                key: '0-1-1',
            }, {
                title: 'Child Node5',
                value: '0-1-2',
                key: '0-1-2',
            }],
        }];
        const running=this.state.runningTable
        // console.log(running)
        const completed=this.state.completedTable
        const error = this.state.errorTable
        const tProps = {
            treeData,
            value: this.state.treeValue,
            onChange: this.onTreeChange,
            treeCheckable: true,
            showCheckedStrategy: TreeSelect.SHOW_CHILD,
            searchPlaceholder: 'Please select',
            treeNodeLabelProp:'value',
            style: {
                width: 300,
            },
        };
        const allProps={
            running,
            completed,
            error,
            tProps,
            clickHiveButton:this.clickHiveButton}
        return(

            <div >
                <div>
                    <Affix offsetTop={20}>
                        <MonthPicker defaultValue={moment(this.state.date,'YYYYMMDD')}
                                    allowClear={false} onChange={this.onChange} placeholder="选择日期"/>

                        <Select
                            showSearch
                            style={{ margin:'0 0 0 20px',width: 400 }}
                            placeholder="选择账期类型"
                            optionFilterProp="children"
                            defaultValue={this.state.cycle}
                            onChange={this.handleCycleChange}
                            filterOption={(input, option) => option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            // filterOption={(input, option) => console.log(input,option)}>
                        >
                            <Option key={"formal"}>正式出账</Option>
                            <Option key={"prep"}>预出帐</Option>
                        </Select>
                    </Affix></div>
                <div>
                    <EchartPie id ="receivegz" chartsType={"pie"} data={this.state.receivegzData} />
                    <EchartPie id ="load" chartsType={"pie" } data={this.state.loadData}/>
                    <EchartPie id ="trans" chartsType={"pie"} data={this.state.transData}/>
                    <EchartPie id ="alluxio" chartsType={"pie"} data={this.state.alluxioData}/>
                </div>
                {/*<Row>*/}
                    {/*<HiveToAlluxio {...allProps}/>*/}
                {/*</Row>*/}
                <div style={{float:'left',margin:"10px 1000px 0 0"}}>
                    <strong style={{float:'left',color:'#e66673'}}>异常检测:  </strong>
                    <FormItem  >
                        <ExceptionRadio value={this.state.exception} onChange={this.handleExceptionChange}/>
                    </FormItem>
                </div>
                <div>
                    <Tables data={this.state.tableData } reFresh={this.reFreshButton}/></div>
                <EchartPie id ="history" chartsType={"bar"} data={[this.state.thisMonthTrans,this.state.lastMonthTrans]} />

            </div>
        )
    }
}
export  class ProMonthTables extends NPMonthTables{
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

            <div >
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
                <div style={{margin:'20px 0 0 0 '}}>
                    {/*<EchartPie id ="receivegz" chartsType={"pie"} data={this.state.receivegzData} tableType={'province'}  />*/}
                    {/*<EchartPie id ="load" chartsType={"pie" } data={this.state.loadData} tableType={'province'}/>*/}
                    {/*<EchartPie id ="trans" chartsType={"pie"} data={this.state.transData} tableType={'province'}/>*/}
                    <EchartMap id={"receivegz"} data={this.state.receivegzData} />
                    <EchartMap id={"load"} data={this.state.loadData} />
                    <EchartMap id={"trans"} data={this.state.transData} />
                    <EchartMap id={"alluxio"} data={this.state.alluxioData} />
                </div>
                <div style={{float:'left',margin:"10px 1000px 0 0"}}>
                    <strong style={{float:'left',color:'#e66673'}}>异常检测:  </strong>
                    <FormItem  >
                        <ExceptionRadio value={this.state.exception} onChange={this.handleExceptionChange}/>
                    </FormItem>
                </div>
                <div>
                    <Tables data={this.state.tableData } type={'proMonth'} reFresh={this.reFreshButton}/></div>
                <EchartPie id ="history" chartsType={"bar"} data={[this.state.thisMonthTrans,this.state.lastMonthTrans]} />

            </div>
        )
    }
}
export  class DayTables extends NPMonthTables{
    //日表
    constructor(){
        super();
        this.state.tableType='day';
    }
    render(){

        return(

            <div >
                <div>
                    <Affix offsetTop={20}>
                        <DatePicker defaultValue={moment(this.state.date,'YYYYMMDD')}
                                    allowClear={false} onChange={this.onChange} placeholder="选择日期"/>
                    </Affix>
                </div>
                <div>
                    <EchartPie id ="receivegz" chartsType={"pie"} data={this.state.receivegzData} />
                    <EchartPie id ="load" chartsType={"pie" } data={this.state.loadData}/>
                    <EchartPie id ="trans" chartsType={"pie"} data={this.state.transData}/>
                    <EchartPie id ="alluxio" chartsType={"pie"} data={this.state.alluxioData}/>
                </div>

                <div style={{float:'left',margin:"10px 1000px 0 0"}}>
                    <strong style={{float:'left',color:'#e66673'}}>异常检测:  </strong>
                    <FormItem  >
                        <ExceptionRadio value={this.state.exception} onChange={this.handleExceptionChange}/>
                    </FormItem>
                </div>
                <div>
                    <Tables data={this.state.tableData } reFresh={this.reFreshButton}/>
                </div>
                    <EchartPie id ="history" chartsType={"bar"} data={[this.state.thisMonthTrans,this.state.lastMonthTrans]} />

            </div>
        )
    }
}


