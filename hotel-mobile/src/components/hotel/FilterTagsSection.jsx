import React from 'react';
import { Selector } from 'antd-mobile'

const options = [
  { label: '双床房', value: 'twin' },
  { label: '含早餐', value: 'breakfast' },
  { label: '大床房', value: 'king' },
  { label: '家庭房', value: 'family' },
  { label: '免费取消', value: 'free_cancel' },
  { label: '套房', value: 'suite' },
]

const FilterTagsSection = ({ value = [], onChange }) => {
  return (
    <div style={{
      width: '100%',
      padding: '12px 0 0',
      // 去掉原有的overflow: hidden，避免遮挡滚动容器
    }}>
      <style>
        {`
          /* 滚动容器样式 - 核心修改 */
          .horizontal-scroll-container {
            width: 100%;
            overflow-x: auto;
            overflow-y: hidden; /* 强制隐藏纵向滚动 */
            -webkit-overflow-scrolling: touch; /* 移动端顺滑滚动 */
            scrollbar-width: none; /* 隐藏火狐滚动条 */
            -ms-overflow-style: none; /* 隐藏IE滚动条 */
            white-space: nowrap; /* 兜底确保不换行 */
          }
          /* 隐藏webkit内核滚动条 */
          .horizontal-scroll-container::-webkit-scrollbar {
            display: none;
          }

          /* Selector内容容器 - 核心修改 */
          .horizontal-selector .adm-selector-content {
            display: flex;
            flex-wrap: nowrap !important; /* 强制不换行 */
            gap: 10px;
            padding: 0!important; /* 去掉默认padding，避免布局偏移 */
            align-items: center; /* 垂直居中 */
            min-height: 36px; /* 固定高度，保证布局稳定 */
          }

          /* 选项项样式 - 优化 */
          .horizontal-selector .adm-selector-item {
            flex: 0 0 auto !important; /* 宽度自适应内容，不拉伸 */
            margin-bottom: 0 !important;
            padding: 6px 16px !important; /* 优化内边距，提升点击体验 */
            min-width: 80px;
            height: 32px; /* 固定高度，匹配容器 */
            text-align: center;
            border-radius: 10px !important; /* 优化圆角，和变量统一 */
          }
        `}
      </style>
      
      <div className="horizontal-scroll-container">
        <Selector
          className="horizontal-selector"
          options={options}
          multiple
          value={value}
          onChange={onChange}
          showCheckMark={false}
          // 去掉Selector默认的padding，避免影响布局
          style={{
            '--border-radius': '10px', // 匹配选项圆角
            '--fill-color': '#EEF1F6',
            '--checked-fill-color': '#E8F2FF',
            '--text-color': '#000',
            '--checked-text-color': '#2577E3',
            padding: 0, // 新增：去掉Selector默认内边距
            width: 'max-content', // 新增：让Selector宽度自适应内容，确保滚动生效
          }}
        />
      </div>
    </div>
  );
};

export default FilterTagsSection;