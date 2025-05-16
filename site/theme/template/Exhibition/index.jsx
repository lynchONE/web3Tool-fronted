import React from 'react';
import PropTypes from 'prop-types';
import TweenOne from 'rc-tween-one';
import DocumentTitle from 'react-document-title';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';
import * as utils from '../utils';
import axios from 'axios';

class Exhibition extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    localizedPageData: PropTypes.object,
  };

  static defaultProps = {
    className: 'exhibition-list',
  };

  state = {
    demoData: null,
    loading: true,
    error: null,
    searchText: ''
  };
  componentDidMount() {
    this.fetchData();
    this.timer = setInterval(() => {
      this.fetchData(); // 每10分钟重新查询
    }, 10 * 60 * 1000); // 10分钟 = 600000毫秒
  }

  componentWillUnmount() {
    clearInterval(this.timer); // 组件卸载时清除定时器
  }
  fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tweets/recent');
      this.setState({
        demoData: response.data,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false
      });
    }
  };

  render() {
    const { locale } = this.props.intl;
    const { demoData, loading, error,searchText } = this.state;

    if (loading) return <div>加载中...</div>;
    if (error) return <div>加载失败: {error}</div>;
    if (!demoData) return null;
    const listChildren = demoData
      .map((item) => {
        const authorName = item.author;
        const content = item.content;
        const createdAt = item.createdAt;
        return (
          <div
            key={`${authorName}-${createdAt}`}
            style={{
              marginBottom: '20px',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #1890ff'
            }}
          >
            <div style={{
              backgroundColor: '#1890ff',
              color: 'white',
              padding: '8px',
              borderRadius: '4px',
              marginBottom: '10px'
            }}>
              <p style={{ margin: 0 }}>作者: {authorName}</p>
            </div>
            <div style={{
              backgroundColor: '#fffbe6',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '10px',
              borderLeft: '3px solid #faad14'
            }}>
              <p style={{ margin: 0 }}>{content}</p>
            </div>
            <div style={{
              backgroundColor: '#fff2f0',
              padding: '8px',
              borderRadius: '4px',
              textAlign: 'right'
            }}>
              <p style={{
                margin: 0,
                color: '#f5222d',
                fontWeight: 'bold'
              }}>
                {new Date(createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        );
      });
    return (
      <div className="page-wrapper">
        <div className="page">
          <TweenOne
            className={this.props.className}
            component="ul"
            animation={{ y: 30, type: 'from', opacity: 0 }}
          >
            {listChildren}
          </TweenOne>
        </div>
        <DocumentTitle title="alpha信息-展示" />
      </div>
    );
  }
}

export default injectIntl(Exhibition);
