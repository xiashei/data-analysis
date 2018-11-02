import { Table, Input, Button, Form } from 'antd';
import React from 'react';

import './Tables.css'
import 'whatwg-fetch'

const Search = Input.Search;





class Tables extends React.Component {
   state = {
            searchText: null,
            filteredInfo: {value:[],category:[],state:[]},

        };
    handleSearch =  (value) => {

        this.setState({ searchText: value});
        this.state.filteredInfo.value=[value]
        this.setState({})
    }

    handleReset = () => {

        this.setState({ searchText: null });
        this.state.filteredInfo.value=null;
        this.setState({})
    }

    render() {
        let {filteredInfo} = this.state;
        filteredInfo = filteredInfo||[]
        let columns = [
            // {title:"序号",
            //     dataIndex:'Index',
            //     width: '3%',
            //     render:(text,record,index)=>index+1,},
            {
                title: '表名',
                dataIndex: 'tableName',
                width: '12%',
                filteredValue: filteredInfo.value || null,
                onFilter: (value, record) => {
                    let data;
                    if(record.children){
                        data=record.children
                    }else{
                        data=record
                    }
                    console.log(data,record)
                    ;return data.tableName &&data.tableName.toLowerCase().includes(value.toLowerCase())
                    || (data.tableInterface&&data.tableInterface.toLowerCase().includes(value.toLowerCase()))}
                ,
                render: (text,record) => {if(text) {
                    const {searchText,exceptionList} = this.state;
                    return searchText ? (
                        <span>
                        {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
                            fragment.toLowerCase() === searchText.toLowerCase()
                                ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                        ))}
                        </span>
                    ) : text;
                }},
            },{
                title: '接口号',
                dataIndex: 'tableInterface',
                width: '6%',
                // filteredValue: filteredInfo || null,
                // onFilter: (value, record) => record.tableInterface.toLowerCase().includes(value.toLowerCase()),
                render: (text) => {if(text){
                    const { searchText } = this.state;
                    return searchText&&text ? (
                        <span>
            {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
                fragment.toLowerCase() === searchText.toLowerCase()
                    ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
            ))}
          </span>
                    ) : text;
                }},
            }, {
                title:"gz文件数",
                dataIndex:"gzNum",
            },{
                title:"chk文件数",
                dataIndex:"chkNum"
            },{
                title:"gz与chk差值",
                dataIndex:"gcDiffer"
            },{
                title:"gz文件接受时间",
                dataIndex:"gzTime"
            },{
                title:"入库文件数",
                dataIndex:"loadFileNum"
            },{
                title:"入库时间",
                dataIndex:"loadTime"
            },{
                title:"格转数据条数",
                dataIndex:"transNum"
            },{
                title:"格转时间",
                dataIndex:"transTime"
            },{
                title:"入alluxio数据条数",
                dataIndex:"alluxioNum"
            },{
                title:"入alluxio时间",
                dataIndex:"alluxioTime"
            }

        ];
        if(this.props.type==="proMonth") {
            columns.splice(0,0,
                {title:"域",
                    dataIndex:'domain',
                    width: '6%'},
                {title:"省分",
                dataIndex:'provInfo',
                width: '6%'})
           }
       const { searchText } = this.state;
        return (
            <Form >
                <Search
                    placeholder="请输入要查询的接口号或者表名"
                    onSearch={value=>this.handleSearch(value)}
                    value={searchText}
                    onChange={e=>this.handleSearch(e.target.value)}
                    enterButton="搜索"
                    style={{margin:"0 2px 20px 0",width:"400px"}}
                />
                <Button onClick={this.handleReset} >重置</Button>
                <Button style={{float:"right"}}type="primary" onClick={this.props.reFresh}>刷新</Button>
                <Table expandRowByClick={true} defaultExpandedRowKeys={[0]} columns={columns} dataSource={this.props.data} />


            </Form>);
    }
}

export default Tables;
