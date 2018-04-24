import jQuery from 'jquery';
import _ from 'lodash';
import queryString from 'query-string';
import Cookies from 'js-cookie';

import CONSTANTS from '../constants';

jQuery(window).on(CONSTANTS.EVENT.CAS.JUMP_AUTH, (e, options) => {
  // eslint-disable-next-line no-console
  console.log('e', e, 'options', options);
  window.location.replace(`${CONSTANTS.URL_CONFIG.CAS}?dt=${encodeURIComponent(window.location.href)}`);
});

jQuery(window).on(CONSTANTS.EVENT.CAS.CALLBACK, (e, options) => {
  // eslint-disable-next-line no-console
  const dt = Cookies.get(CONSTANTS.CAS.CALLBACK_URL);
  const parseUrl = queryString.parseUrl(dt);
  let dtHasQuery = true;
  if (_.isEmpty(parseUrl.query)) {
    dtHasQuery = false;
  }

  window.location.replace(`${dt}${dtHasQuery ? '&' : '?'}ticket=${options.ticket}`);
});
