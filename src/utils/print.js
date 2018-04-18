import _ from 'lodash';

// 新窗口，css 写在这。不能写行内。
const printStyle = `
<style>
  body {
    border: 0;
    margin: 0;
    padding: 0;
    font-family: ${_.get(window.getComputedStyle(document.body), 'fontFamily')};
    color: #f0f0f0;
    color: rgba(0,0,0,.65);
  }
  p {
    margin: 0;
    padding: 0;
  }
  @media screen {
    .printPageContainer {
      width: 19cm;
      min-height: 29.7cm;
      padding: 2cm;
      margin: 1cm auto;
      border: 1px #D3D3D3 solid;
      border-radius: 5px;
      background: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }
    .printPageContainer.printPageContainer-turn {
      width: 27.7cm;
      min-height: 21cm;
    }
  }
  .printPageContainer {
    page-break-after:always;
  }
  #print-table hr {
    margin-top: .5em;
    margin-bottom: .5em;
    border: 0;
    border-top: 1px solid #f4f4f4;
  }
  .print-title {
    text-align: center;
    margin: 10px;
    padding: 15px 0;
    text-align: center;
    margin-bottom: 0;
  }
  table.print-table {
    width: 100%;
    max-width: 100%;
  }
  table.print-table, .print-table th, .print-table td {
    border: 1px solid #ccc;
  }
  .print-table th, .print-table td {
    padding: 4px;
  }
  table.print-table {
    border-bottom: 0;
    border-left: 0;
    table-layout: fixed;
    margin-bottom: 0;
    font-size: 12px;
  }
  .print-table td, .print-table th {
    border-top: 0;
    border-right: 0;
    text-align: center;
    width: 40px;
    padding-top: 4px;
    padding-bottom: 4px;
    vertical-align: top;
  }
  table.print-table td.no-border-bottom {
    border-bottom: 0!important;
  }
  .print-table .text-left {
    text-align: left;
  }
  .print-table .text-right {
    text-align: left;
  }
  .print-table .text-right {
    text-align: right;
  }
  // .next-page {
  //   page-break-after:always;
  // }
  .float-left {
    float: left;
  }
  .float-none {
    float: none;
  }
  .float-right {
    float: right;
  }
  .border-none {
    border: 0!important;
  }

  .head {
    width: 98%;
    margin: 10px 0;
  }
  .head:after {
    content: '';
    display: block;
    clear: both;
  }
  .head-left, .head-right {
    width: 50%;
    float: left;
  }
  .head-right {
    text-align: right;
  }

  .letter-padding {
    font-size: 16px;
    padding-top: 0px;
    max-width: 45em;
    margin:  0 auto;
    position: relative;
  }
</style>
`;

export {
  printStyle,
};

export default function ({ data }) {
  try {
    const printWindow = window.open();
    printWindow.document.body.innerHTML = `${printStyle}${data || ''}`;
    try {
      printWindow.document.body.setAttribute('contenteditable', true);
    }
    catch (e) {
      // do nothing
    }

    try {
      printWindow.document.body.className = `${printWindow.document.body.className || ''} print-window-body`;
    }
    catch (e) {
      // do nothing
    }
    // 不要 title 了。
    // printWindow.document.title = title || '打印文件';
    printWindow.document.title = '';
    setTimeout(() => {
      try {
        printWindow.window.focus();
      }
      catch (e) {
        // do nothing
      }
      try {
        printWindow.window.print();
      }
      catch (e) {
        // do nothing
      }
      if (printWindow.confirm('打印操作已完成或者取消，是否关闭窗口?\n你可以编辑该页面，然后使用浏览器的打印功能重新打印。')) {
        printWindow.window.close();
      }
    }, 100);
  }
  catch (err) {
    // 浏览器阻止了弹出窗口，请前往浏览器“设置-高级-内容设置”中修改
    // chrome://settings/contentExceptions#popups
  }
}
