import React from 'react';
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import autoHeight from '../autoHeight';
import styles from './index.less';

@autoHeight()
class TimelineChart extends React.Component {
  render() {
    const {
      title,
      height = 400,
      padding = [60, 80, 40, 80],
      titleMap = {
        y1: 'y1',
        y2: 'y2',
      },
      borderWidth = 2,
      data = [
        {
          x: 0,
          y1: 0,
          y2: 0,
        },
      ],
      adjust,
    } = this.props;

    data.sort((a, b) => a.x - b.x);

    let max;
    if (data[0] && data[0].y1 && data[0].y2) {
      max = Math.max(
        [...data].sort((a, b) => b.y1 - a.y1)[0].y1,
        [...data].sort((a, b) => b.y2 - a.y2)[0].y2
      );
    }

    const ds = new DataSet({
      state: {
        start: data[0] ? data[0].x : 0,
        end: data[0] ? data[data.length - 1].x : 0,
      },
    });
    // console.log(ds);
    const dv = ds.createView();
    dv.source(data).transform({
      type: 'fold',
      fields: ['F', 'M'],
      key: 'key',
      value: 'value',
    });
    // .transform({
    //   type: 'filter',
    //   callback: obj => {
    //     const date = obj.x;
    //     return date <= ds.state.end && date >= ds.state.start;
    //   },
    // })
    // .transform({
    //   type: 'map',
    //   callback(row) {
    //     const newRow = { ...row };
    //     newRow[titleMap.y1] = row.y1;
    //     newRow[titleMap.y2] = row.y2;
    //     return newRow;
    //   },
    // })
    // .transform({
    //   type: 'fold',
    //   fields: [titleMap.y1, titleMap.y2], // 展开字段集
    //   key: 'key', // key字段
    //   value: 'value', // value字段
    // });

    const timeScale = {
      type: 'linear',
      // tickInterval: 60 * 60 * 1000,
      // mask: 'YYYY',
      // range: [0, 1],
    };

    const cols = {
      value: {
        max,
        min: 0,
      },
    };

    const SliderGen = () => (
      <Slider
        padding={[0, padding[1] + 20, 0, padding[3]]}
        width="auto"
        height={26}
        xAxis="x"
        yAxis="y1"
        scales={{ x: timeScale }}
        data={data}
        start={ds.state.start}
        end={ds.state.end}
        backgroundChart={{ type: 'line' }}
        onChange={({ startValue, endValue }) => {
          ds.setState('start', startValue);
          ds.setState('end', endValue);
        }}
      />
    );
    return (
      <div className={styles.timelineChart} style={{ height: height + 30 }}>
        <div>
          <Chart height={height} padding={padding} data={dv} scale={cols} forceFit>
            <Axis name="x" />
            <Axis name="y1" />
            <Tooltip />
            {/*<Legend name='y1' position="top" />*/}
            <Legend position="top" />
            <Geom
              type="interval"
              position="x*value"
              color="key"
              adjust={[
                {
                  type: adjust,
                  marginRatio: 1 / 32,
                },
              ]}
            />
            <Geom type="line" position="x*y1" size={borderWidth} color="#fad248" />
            <Geom type="point" position="x*y1" size={borderWidth} color="#fad248" />
          </Chart>
          <div style={{ marginRight: -20 }}>{/*<SliderGen />*/}</div>
        </div>
      </div>
    );
  }
}

export default TimelineChart;
