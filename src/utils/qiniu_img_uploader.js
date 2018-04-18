// 七牛上传组件，不进行压缩。要想压缩，需要在在传入之前进行压缩，所以可以另外增加组件。
import _ from 'lodash';
import { message } from 'antd';
import Services from '../services';

const QINIU_UPLOAD_URL = 'https://up.qbox.me';

const DEFAULTS = {
  maxFileSize: 1024 * 1024 * 20,
  uploadUrl: QINIU_UPLOAD_URL,
  autoGetToken: () => {
    return new Promise((resolve) => {
      resolve('');
    });
  },
};

let ServiceOptions = _.defaultsDeep({}, DEFAULTS);

// uploadMake ，创建上传方法。
function uploadMake(argsOptions) {
  const options = _.defaultsDeep(argsOptions || {}, ServiceOptions);

  const promise = new Promise((resolve, reject) => {
    if (!(options.token && _.isString(options.token))) {
      reject({
        code: -101,
        msg: '缺失七牛Token',
      });
    }

    if (!options.file) {
      reject({
        code: -110,
        msg: '请选择上传文件',
      });
    }

    getFileSize(options.file, (fileSize) => {
      const K = 1024;
      const M = K * K;
      const maxSize = options.maxFileSize || 0;
      const showSize = M < maxSize
        ? `${(maxSize / M).toFixed(2)}Mb`
        : `${(maxSize / K).toFixed(2)}Kb`;

      /**
       * 判断文件大小
       */
      if (fileSize > maxSize) {
        reject({
          code: -120,
          msg: `上传文件大小不能超过${showSize}`,
        });

        return;
      }

      upload(options.file, options).then((response) => {
        resolve(response);
      }).catch((rejection) => {
        reject(rejection);
      });
    });
  });

  return promise;
}

function upload(file, options) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (_.isFunction(options.onProgress)) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded * 100) / event.total);
          options.onProgress(percentComplete);
        }
      }, false);
    }

    xhr.onreadystatechange = () => {
      if (4 === xhr.readyState && 200 === xhr.status && '' !== xhr.responseText) {
        try {
          const blkRet = JSON.parse(xhr.responseText);

          resolve({
            code: 0,
            data: {
              image: blkRet.key,
              data: blkRet,
            },
            msg: '上传成功',
          });
        }
        catch (error) {
          reject({
            code: -21,
            msg: '程序回调过程出错',
          });
        }
      }
      else if (200 !== xhr.status && xhr.responseText) {
        reject({
          code: -22,
          msg: '网络服务有误, 请重新尝试',
        });
      }
    };

    // 开始发送。
    const formData = new FormData();
    if (options.key && _.isString(options.key)) {
      formData.append('key', options.key);
    }

    formData.append('token', options.token);
    formData.append('file', file);

    xhr.open('POST', options.uploadUrl, true);
    xhr.send(formData);
  });
}

function getFileSize(file, callback) {
  const reader = new FileReader();
  reader.onload = function onload(event) {
    callback(event.total);
  };

  reader.readAsDataURL(file);
}

function configure(optionsArgs) {
  ServiceOptions = _.defaultsDeep({}, optionsArgs, ServiceOptions);
}

// 默认 export ，用来上传数据的方法，调用时候必须穿 {file: FileObject}
function qiniuImageUploader(options) {
  const autoGetToken = (ServiceOptions || {}).autoGetToken;
  return new Promise((resolve, reject) => {
    autoGetToken().then((token) => {
      const newOptions = {};
      if (token) {
        newOptions.token = token;
      }
      uploadMake(_.defaultsDeep(newOptions, _.defaultsDeep(options, ServiceOptions))).then((response) => {
        resolve(response);
      }).catch((rejection) => {
        reject(rejection);
      });
    }).catch((rejection) => {
      reject({
        code: -100,
        msg: '无法获取七牛token',
        origin: rejection,
      });
    });
  });
}

// 初始化，设置一次获取 token 的。应该脱离这个文件填写。
configure({
  autoGetToken: () => {
    return Services.common.qiniuToken().then((qiniuTokenRes) => {
      const token = qiniuTokenRes.data;
      return token;
    }).catch(() => {
      message.error('获取七牛 token 失败!');
    });
  },
});

export default qiniuImageUploader;
export {
  configure,
  upload,
  qiniuImageUploader,
};
