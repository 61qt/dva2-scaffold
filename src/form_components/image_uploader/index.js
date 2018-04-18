import 'cropperjs/dist/cropper.min.css';

import React from 'react';
import Cropper from 'cropperjs';
import { Spin, Upload, Icon, message, Button } from 'antd';
import _ from 'lodash';
import * as qiniuImageUploaderUtil from '../../utils/qiniu_img_uploader';
import Filters from '../../filters';
import styles from './index.less';

const DEFAULT_CROPPER_OPTIONS = {
  responsive: true,
  viewMode: 3,
  checkCrossOrigin: true,
  rotatable: true,
  aspectRatio: 1 / 1,
  minCropBoxWidth: 100,
  minCropBoxHeight: 100,
  minContainerWidth: 400,
  minContainerHeight: 400,
  outputWidth: null,
  outputHeight: null,
  maxOutputWidth: 2000,
  maxOutputHeight: 2000,
  maxSize: 1024 * 1024 * 6,
  // maxFileSize: 1024 * 1024 * 6,
  maxWarningSelectFileSize: 1024 * 1024 * 1,
  autoCropArea: 1,
  cropRate: 2,
};

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: props.initValue,
      preview: false,
      file: false,
      localSrc: '',
      reading: false,
      uploading: false,
      imgType: 'image/jpeg',
    };
    debugAdd('image_uploader', this);
  }

  componentDidMount = () => {
    let aspectRatio = 1;
    const { options = {} } = this.props;
    if (options.width && options.height) {
      aspectRatio = options.width / options.height;
    }

    const cropperOptions = Object.assign({}, DEFAULT_CROPPER_OPTIONS, {
      aspectRatio,
      cropRate: options.cropRate || DEFAULT_CROPPER_OPTIONS.cropRate,
      width: options.width,
      height: options.height,
      minContainerWidth: options.width,
      minContainerHeight: options.height,
      outputWidth: options.width,
      outputHeight: options.height,
      maxOutputWidth: 960,
      maxOutputHeight: (options.height / options.width) * 960,
      maxSize: this.props.maxSize || DEFAULT_CROPPER_OPTIONS.maxSize,
    });

    this.cropperOptions = cropperOptions;
    this.cropper = new Cropper(this.previewImgRef, cropperOptions);
  }

  // 更新传输的 value
  componentWillReceiveProps = (nextProps) => {
    if ('value' in nextProps && this.state.imageUrl !== nextProps.value) {
      this.setState({
        imageUrl: nextProps.value,
      });
    }
  }

  getFileSrc = ({ file = this.state.file, callback }) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const options = {
        localSrc: reader.result,
        reading: false,
        imgType: _.get(reader.result.match(/^data:(image\/.*?);/), '[1]') || 'image/jpeg',
      };
      this.setState(options, () => {
        if ('function' === typeof callback) {
          callback(options);
        }
        if (this.props.originImage) {
          return;
        }
        this.cropper.reset();
        this.cropper.clear();
        this.setState(options, () => {
          this.cropper.replace(reader.result);
          this.cropper.enable();
          if (this.cropper.containerData) {
            this.cropper.resize();
          }
        });
      });
    };
    reader.onload = reader.onloadend;

    reader.readAsDataURL(file);
    this.reader = reader;
  }

  getSize = (size) => {
    const unit = ['B', 'K', 'M', 'G'];
    let unitCount = 1;
    // eslint-disable-next-line no-restricted-properties
    while (3 > unitCount && 1024 < size / Math.pow(1024, unitCount)) {
      unitCount += 1;
    }

    // eslint-disable-next-line no-restricted-properties
    return `${_.floor(size / Math.pow(1024, unitCount), 2)}${unit[unitCount]}`;
  }

  beforeUpload = () => {
    // 大小判断在上传的时候判断。
  }

  customRequest = (options) => {
    const file = options.file;
    if (this.props.originImage || ('image/gif' === file.type && this.props.gifAutoUpload)) {
      this.setState({
        uploading: true,
      });
      this.runQiniuUpload(file);
    }
    else {
      // if (file.size >= this.cropperOptions.maxWarningSelectFileSize) {
      //   const fileSize = this.getSize(file.size);
      //   // eslint-disable-next-line no-alert
      //   window.confirm(`当前图片大小为${fileSize}，原图片过大，可能会造成网页奔溃，建议压缩图片大小后上传。`);
      // }
      this.setState({
        file,
        preview: true,
        reading: true,
      });
      this.getFileSrc({
        file,
      });
    }
  }

  hideModelHandler = () => {
    this.setState({
      preview: false,
    });
  }

  closeUpload = () => {
    this.setState({
      uploading: false,
      reading: false,
      preview: false,
    });
  }

  runQiniuUpload = (blob) => {
    if (this.cropperOptions.maxSize <= blob.size) {
      this.closeUpload();
      return false;
    }

    return qiniuImageUploaderUtil.qiniuImageUploader({
      file: blob,
      onProgress: (percentComplete) => {
        window.console.log('图片上传完成率', percentComplete, '%');
      },
    }).then((res) => {
      const imageUrl = res.data.image;
      if ('function' === typeof this.props.onChange) {
        this.props.onChange(imageUrl);
      }
      this.setState({
        imageUrl,
        uploading: false,
        reading: false,
      });
      this.cropper.reset();
      this.cropper.clear();
    }).catch((rej) => {
      this.cropper.enable();
      message.error(_.get(rej, 'msg') || rej);
      const newState = {
        uploading: false,
        reading: false,
        preview: true,
      };
      if (this.props.originImage) {
        newState.reading = false;
        newState.preview = false;
      }
      this.setState(newState);
    });
  }

  imgOnLoad = (e) => {
    const target = e.target;
    if (target && this.props.originImage) {
      if (_.get(this.props, 'style.minHeight') && target.height && target.height < _.get(this.props, 'style.minHeight')) {
        target.style.position = 'absolute';
      }
      else {
        target.style.position = 'static';
      }
    }
    else {
      target.style.position = 'absolute';
    }
  }

  upload = () => {
    this.cropper.disable();
    this.setState({
      uploading: true,
      reading: false,
      preview: false,
    }, () => {
      this.cropper.getCroppedCanvas({
        width: this.cropperOptions.width * this.cropperOptions.cropRate,
        height: this.cropperOptions.height * this.cropperOptions.cropRate,
      }).toBlob((blob) => {
        this.runQiniuUpload(blob);
      }, this.state.imgType, 0.95);
    });
  }

  previewImgRef = (previewImgRef) => {
    this.previewImgRef = previewImgRef;
  }


  render() {
    const imageUrl = this.state.imageUrl;
    const { options = {} } = this.props;
    let style = {
      ...this.props.style,
      width: options.width,
      height: options.height,
      marginBottom: 8,
    };
    let qiniuImageOptions = {
      width: options.width * 2,
      height: options.height * 2,
    };
    if (this.props.originImage) {
      qiniuImageOptions = {};
      style = {
        ...this.props.style,
      };
    }
    return (<div style={style}><Spin style={style} spinning={this.state.reading || this.state.uploading}>
      <div className={styles.normal}>
        <div style={style} className={`image-uploader ${this.props.className || ''} ${this.props.originImage ? 'image-uploader-origin' : ''}`}>
          <Upload
            accept="image/gif,image/jpeg,image/jpg,image/png"
            name="image_uploader"
            multiple={this.props.multiple || false}
            showUploadList={false}
            style={style}
            customRequest={this.customRequest}
          >
            {
              (!imageUrl) ? (<div className={styles.imageUploadTriggerContainer}>
                <Icon type="plus" className={styles.imageUploaderTrigger} />
              </div>) : (<div className={`image-uploader-content ${this.props.className || ''}`}>
                <img onLoad={this.imgOnLoad} src={Filters.qiniuImage(imageUrl, qiniuImageOptions)} alt="实际图" className={`image-uploader-img ${this.state.uploading ? 'ant-hide' : ''} ${this.props.originImage ? 'image-uploader-img-origin' : ''}`} />
              </div>)
            }
          </Upload>

          <div className={`${styles.preview} ${this.state.uploading || this.state.preview ? '' : styles.previewHidden}`}>
            <div className="img-cropper">
              <img ref={this.previewImgRef} src={this.state.localSrc} alt="预览图" className="cropper-hidden" />
            </div>
            <div className={`operate ${this.state.uploading ? styles.previewHidden : ''}`}>
              <Button onClick={this.upload} type="primary">
                <Icon type="check" />
                <span>&nbsp;确认上传</span>
              </Button>
              <Button onClick={this.closeUpload}>
                <Icon type="close" />
                <span>&nbsp;取消</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Spin></div>);
  }
}
