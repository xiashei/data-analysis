import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Divider,
  Menu,
  Dropdown,
} from 'antd';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from '@/components/Charts';
import Trend from '@/components/Trend';
import NumberInfo from '@/components/NumberInfo';
import numeral from 'numeral';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Yuan from '@/utils/Yuan';
import { getTimeDistance } from '@/utils/utils';

import styles from './Analysis.less';

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class productNumber extends Component {
  constructor(props) {
    super(props);
    this.rankingListData = [];
    for (let i = 0; i < 7; i += 1) {
      this.rankingListData.push({
        title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
        total: 323234,
      });
    }
  }

  state = {
    loading: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 600);
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  render() {
    const { loading: propsLoding } = this.state;
    const { chart, loading: stateLoading } = this.props;
    console.log(chart);
    const { productUser } = chart;

    const colorMap = {
      Tencent: G2.Global.colors[0],
      Baidu: G2.Global.colors[1],
      Alibaba: G2.Global.colors[2],
      Didi: G2.Global.colors[3],
      Jingdong: G2.Global.colors[4],
      Zhaohang: G2.Global.colors[5],
    };
    const cols = {
      company: {
        alias: '公司',
      },
      type: {
        alias: '卡种',
      },
      value: {
        type: 'log',
        base: 10,
        alias: '使用量',
        tickCount: 10,
        min: 10000,
      },
    };
    console.log(productUser);

    return (
      <GridContent>
        <Card title="产品使用量分析">
          <Chart height={500} data={productUser} padding={[60, 60, 120, 60]} scale={cols} forceFit>
            <Tooltip />
            <Axis name="company" />
            <Axis
              name="value"
              label={{
                formatter: value => {
                  return (value / 10000).toFixed(0) + '万';
                }, // 格式化坐标轴的显示
              }}
            />
            <Legend />
            <Geom
              type="point"
              position="company*value"
              color={[
                'company',
                val => {
                  return colorMap[val];
                },
              ]}
              tooltip="company*value*type"
              opacity={0.65}
              shape="circle"
              size={['value', [10, 60]]}
              style={[
                'company',
                {
                  lineWidth: 1,
                  strokeOpacity: 1,
                  fillOpacity: 0.3,
                  opacity: 0.65,
                },
              ]}
            />
          </Chart>
        </Card>
      </GridContent>
    );
  }
}

export default productNumber;
