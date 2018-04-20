import LzEditor from 'react-lz-editor';
import styles from './index.less';
import Services from '../../services';
import Filters from '../../filters';

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      responseList: [],
    };
    debugAdd('html_editor', this);
  }

  // 更新传输的 value
  componentWillReceiveProps = (nextProps) => {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  cbReceiver = (value) => {
    // window.console.log('value', value);
    this.setState({
      value,
    });

    const onChange = this.props.onChange;
    if ('function' === typeof onChange) {
      onChange(value);
    }
  }

  uploadToQiniu = (values) => {
    return Services.common.qiniuUpload(values).then((res) => {
      return Filters.qiniuImage(res.hash);
    }).catch((rej) => {
      return Promise.reject(rej);
    });
  }

  render() {
    const uploadProps = {
      action: 'https://up.qbox.me',
      listType: 'picture',
      fileList: this.state.responseList,
      data: (file) => {
        // window.console.log('file', file);
        return {
          file,
          token: this.qiniuToken,
        };
      },
      multiple: true,
      beforeUpload: () => {
        return Services.common.qiniuToken().then((res) => {
          const token = res.data;
          this.qiniuToken = token;
          return token;
        }).catch((rej) => {
          // window.console.log('rej', rej);
          return Promise.reject(rej);
        });
      },
      customRequest: (options) => {
        const { file, onSuccess } = options;
        const formData = new FormData();
        formData.append('token', this.qiniuToken);
        formData.append('file', file);
        const xhr = Services.common.qiniuUpload(formData).then((res) => {
          const imgUrl = `${Filters.qiniuImage(res.hash) || ''}`.replace(/\?.+/, '');
          const newFile = {
            url: imgUrl,
            ...file,
          };
          onSuccess(newFile, xhr);
          return imgUrl;
        });
      },
      showUploadList: true,
      onSuccess: (file) => {
        const responseList = [].concat(this.state.responseList).concat(file);
        this.setState({
          responseList,
        });
        return file;
      },
    };
    return (
      <div className={styles.normal} >
        <LzEditor
          active
          lang="zh-CN"
          uploadProps={uploadProps}
          importContent={this.state.value}
          cbReceiver={this.cbReceiver} />
      </div>
    );
  }
}
