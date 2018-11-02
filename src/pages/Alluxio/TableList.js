import { Breadcrumb } from 'antd';
import { Table } from 'antd';
import { Icon, Button, Input, AutoComplete, Card } from 'antd';
import React from 'react';
import 'antd/dist/antd.css';
import './tableList.css';
import $ from 'jquery';

export default class TableList extends React.Component {
  state = {
    //模糊查询的数据源
    dataSource: [],
    //所有数据的集合
    list: [],
    //路径面包屑组件
    pathsome: null,
    temppath: [],
    defpathfrom: null,
  };

  onSelect = value => {
    var c = value;

    this.setState({
      defpathfrom: c,
    });
  };

  componentDidMount() {
    this.ajxaA('/');
  }

  pathsplit(url) {
    var tablepath;
    if (url.toString() == '/') {
      tablepath = '/';
    } else {
      var urlto = url.toString();
      var tablelist = [];
      tablelist = urlto.split('/');
      var num = tablelist.length - 1;
      tablepath = tablelist[num];
    }
    return tablepath;
  }

  handleSearch = value => {
    var tablepath1 = this.pathsplit(value);
    var list = this.state.temppath;
    var newlis = [];
    for (var tablepath of list) {
      var tablepath2 = this.pathsplit(tablepath);
      if (tablepath2.indexOf(tablepath1) >= 0) {
        newlis.push(tablepath);
      }
    }
    this.setState({ dataSource: newlis });
  };

  ajxaA = url => {
    var pathpp = [];
    var lis1 = [];
    $.ajax({
      type: 'GET',
      url: 'http://10.161.67.206:7071/reactList',
      data: { path: url },
      dataType: 'json',
      success: function(data) {
        lis1 = data.lis;
        for (var i = 0; i < lis1.length; i++) {
          pathpp.push(lis1[i].pathname[1]);
        }
      },
      async: false,
    });

    var oos = url;
    var pathsplit = url.split('/');
    pathsplit.splice(0, 1);

    var tat = [];
    var temp = '';
    tat.push(
      <Breadcrumb.Item>
        <a onClick={this.ajxaB.bind(this, '/')}>root</a>
      </Breadcrumb.Item>
    );
    for (var c of pathsplit) {
      temp = temp + '/' + c;
      tat.push(
        <Breadcrumb.Item>
          <a onClick={this.ajxaB.bind(this, temp)}>{c}</a>
        </Breadcrumb.Item>
      );
    }
    var pathsomeee = tat;

    this.setState({
      temppath: pathpp,
      dataSource: pathpp,
      list: lis1,
      pathsome: pathsomeee,
      defpathfrom: oos,
    });
  };

  handleAutoCompleteChange = e => {
    this.setState({
      defpathfrom: e,
    });
  };

  ajxaC = () => {
    var path = this.state.defpathfrom;
    this.ajxaA(path);
  };

  ajxaD = e => {
    if (e.keyCode == 13) {
      this.ajxaC();
    }
  };

  ajxaB = (path, e) => {
    this.ajxaA(path);
  };

  render() {
    const columns = [
      {
        title: 'File Name',
        dataIndex: 'pathname',
        render: text => {
          console.log(text);
          var path = text[1];
          var name = text[0];
          var mode = text[2];
          var $c;
          if (mode == 493) {
            $c = <a href="javascript:">{name}</a>;
          } else {
            $c = <p>{name}</p>;
          }

          return $c;
        },
        onCell: record => ({
          onClick: e => {
            if (record.pathname[2] == 493) {
              var path = record.pathname[1];
              this.ajxaA(path);
            }
          },
        }),
      },
      {
        width: 80,
        title: 'Size',
        dataIndex: 'size',
      },
      {
        width: 80,
        title: 'Block Size',
        dataIndex: 'blockSizeBytes',
      },
      {
        width: 100,
        title: 'In Alluxio',
        dataIndex: 'inAlluxioPercentage',
        render: text => {
          var alluxio = text + '%';
          return alluxio;
        },
      },
      {
        width: 100,
        title: 'MODE',
        dataIndex: 'mode',
        render: text => {
          if (text == '493') {
            return 'drwxr-xr-x';
          } else {
            return '-rw-r--r--';
          }
        },
      },
      {
        width: 80,
        title: 'Owner',
        dataIndex: 'owner',
      },
      {
        width: 80,
        title: 'Group',
        dataIndex: 'group',
      },
      {
        width: 140,
        title: 'Persistence State',
        dataIndex: 'persistenceState',
      },
      {
        width: 80,
        title: 'Pin',
        dataIndex: 'pinned',
      },
      {
        width: 160,
        title: 'Creation Time',
        dataIndex: 'creationTimeMs',
      },
      {
        width: 160,
        title: 'Modification Time',
        dataIndex: 'lastModificationTimeMs',
      },
    ];
    return (
      <div style={{ margin: '20px 20px' }}>
        <Card style={{ margin: '5px 0 5px 0' }} onKeyDown={this.ajxaD}>
          <AutoComplete
            dataSource={this.state.dataSource}
            style={{ width: 400 }}
            onSelect={this.onSelect}
            onSearch={this.handleSearch}
            value={this.state.defpathfrom}
            onChange={this.handleAutoCompleteChange}
          />
          <Button
            className="search-btn"
            type="primary"
            onClick={this.ajxaC.bind()}
            style={{ margin: '0 0 0 5px' }}
          >
            <Icon type="search" />
          </Button>
        </Card>
        <div className="demo-nav" style={{ margin: '10px 0px 0px 0px' }}>
          <Breadcrumb>{this.state.pathsome}</Breadcrumb>
        </div>
        <Card style={{ margin: '10px 0px 0px 0px' }}>
          <Table columns={columns} dataSource={this.state.list} />
        </Card>
      </div>
    );
  }
}
