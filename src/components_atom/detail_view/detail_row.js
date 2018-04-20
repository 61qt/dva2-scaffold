import _ from 'lodash';
import React from 'react';
import { Icon } from 'antd';
import { Link } from 'dva/router';

import styles from './detail_row.less';

class Component extends React.Component {
  static defaultProps = {
    col: 1,
    currentExpand: 9999999,
  };

  componentWillMount = () => {}

  componentWillUnmount = () => {}

  getValue = (elem, dataSource) => {
    const text = _.get(dataSource, elem.dataIndex);
    return 'function' === typeof elem.render ? elem.render(text, dataSource) : text;
  }

  getRows = (col = this.props.col) => {
    const dataSource = this.props.dataSource;
    const showColumn = _.filter(this.props.columns, (elem) => {
      const removeRule = elem.removeRule;
      const text = _.get(dataSource, elem.dataIndex);
      let rowIsRemov = false;

      if ('boolean' === typeof removeRule) {
        rowIsRemov = removeRule;
      }
      else if ('function' === typeof removeRule) {
        rowIsRemov = removeRule(text, dataSource);
      }

      return !rowIsRemov;
    });

    // todo 解决 colSpan 问题。
    const columns = [];
    let columnsIndex = 0;
    let rowColSum = 0;
    const rowMaxCol = col * 2;
    _.each(showColumn, (elem) => {
      columns[columnsIndex] = columns[columnsIndex] || [];
      const colSpan = elem.colSpan || 1;
      if (rowColSum + 1 + colSpan > rowMaxCol) {
        columnsIndex += 1;
        rowColSum = 1 + colSpan;
      }
      else {
        rowColSum += 1 + colSpan;
      }
      columns[columnsIndex] = columns[columnsIndex] || [];
      columns[columnsIndex].push(elem);
    });

    const expandColumn = _.filter(columns, (elem, index) => {
      return index < this.props.currentExpand;
    });
    return expandColumn.map((rowElem, rowIndex) => {
      const tdArr = [];
      let colSpanLength = 0;
      _.each(rowElem, (colElem) => {
        const colSpan = colElem.colSpan || 1;
        const rowSpan = colElem.rowSpan || 1;
        colSpanLength += (colSpan + 1);
        tdArr.push(<td rowSpan={rowSpan} key={`${rowIndex}_${colSpanLength}_1`} style={this.buildLabelStyle()}>{colElem.title}</td>);
        tdArr.push(<td rowSpan={rowSpan} key={`${rowIndex}_${colSpanLength}_2`} colSpan={colSpan}>{this.getValue(colElem, dataSource)}</td>);
      });

      while (2 * col > colSpanLength) {
        colSpanLength += 1;
        tdArr.push(<td key={`${rowIndex}_${colSpanLength}`} />);
      }
      return (<tr key={rowIndex}>
        { tdArr }
      </tr>);
    });
  }

  getShowMoreRow = () => {
    const { columns, expand, currentExpand, col } = this.props;
    if (!expand || expand >= columns.length) {
      return null;
    }

    const expandFlag = currentExpand >= columns.length;

    return (
      <tr key="expand" >
        <td style={this.buildLabelStyle()}>更多信息</td>
        <td onClick={this.props.toggleShowMore}>
          <Link to="#">
            { expandFlag ? '收起' : '展开' } <Icon type={expandFlag ? 'up' : 'down'} />
          </Link>
        </td>
        {
          1 < col ? (<td colSpan={2 * (col - 1)} />) : null
        }
      </tr>
    );
  }

  buildLabelStyle = () => {
    if (this.labelStyles) {
      return this.labelStyles;
    }
    let labelWidth = this.props.labelWidth;
    if (undefined === labelWidth) {
      this.labelStyles = {};
    }
    const labelStyles = {};
    if (`${labelWidth * 1}` === labelWidth) {
      labelWidth = `${labelWidth}px`;
    }

    labelStyles.width = labelWidth;

    this.labelStyles = labelStyles;
    return labelStyles;
  }

  render() {
    const { title, col } = this.props;
    return (
      <div className={styles.normal}>
        <div className="detail-view">
          <table>
            {
              title ? (<thead>
                <tr>
                  <th colSpan={2 * col}>
                    { title }
                  </th>
                </tr>
              </thead>) : null
            }
            <tbody>
              { this.getRows() }
              { this.getShowMoreRow() }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Component;
