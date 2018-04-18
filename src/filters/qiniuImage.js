import CONSTANTS from '../constants';

export default function (url, options = {}) {
  const { width: w, height: h, q = 50 } = options;
  let newUrl = url || '';
  if (!url) {
    return '';
  }

  if (!url.indexOf) {
    return url;
  }

  if (0 > url.indexOf('/')) {
    newUrl = CONSTANTS.QINIU_IMG_CDN_URL + url;
  }
  else {
    // 后期再处理 cdn 问题。
  }
  let query = 'imageView2/2';
  if (w) {
    query += `/w/${w}`;
  }
  if (h) {
    query += `/h/${h}`;
  }
  query += `/q/${q}`;

  if (newUrl) {
    if (-1 < newUrl.indexOf('?')) {
      return `${newUrl}&${query}`;
    }
    return `${newUrl}?${query}`;
  }
  return newUrl;
}
