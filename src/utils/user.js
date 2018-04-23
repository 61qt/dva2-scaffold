import jwtDecode from 'jwt-decode';
import moment from 'moment';

const TokenName = 'jwtToken';
const UserInfoName = 'userInfo';

export class UserService {
  get info() {
    if (this.id) {
      if (this.infoCache) {
        return this.infoCache;
      }
      return this.getInfo();
    }
    return {};
  }

  set info(info) {
    if (!this.setInfo(info)) {
      this.unsetInfo();
    }
  }

  get token() {
    if (this.tokenCache) {
      return this.tokenCache;
    }
    return this.getToken();
  }

  set token(token) {
    if (null === token) {
      this.unsetToken();
    }
    else {
      this.setToken(token);
    }
  }

  get id() {
    const auth = this.decodeToken(this.token);
    return auth.id || '';
  }

  get openId() {
    const auth = this.decodeToken();
    return auth.openid || '';
  }

  get isAuthenticated() {
    return this.validTokenAuth();
  }

  getToken(force = false) {
    const token = localStorage.getItem(TokenName) || null;
    if (true === force) {
      return token;
    }

    if (this.validToken(token)) {
      return token;
    }

    return null;
  }

  setToken(token) {
    if ('string' === typeof token && token && true === this.validToken(token)) {
      this.tokenCache = token;
      localStorage.setItem(TokenName, token);
      return true;
    }

    return false;
  }

  unsetToken() {
    this.tokenCache = null;
    localStorage.removeItem(TokenName);
    return true;
  }

  getInfo() {
    const userInfoStr = localStorage.getItem(UserInfoName);
    let info = {};
    try {
      info = JSON.parse(userInfoStr);
    }
    catch (e) {
      info = {};
    }
    this.infoCache = info;
    return info;
  }

  setInfo(info) {
    if (info && info.id) {
      this.infoCache = info;
      localStorage.setItem(UserInfoName, JSON.stringify(info));
      return true;
    }

    return false;
  }

  unsetInfo() {
    this.infoCache = null;
    localStorage.removeItem(UserInfoName);
    return true;
  }

  decodeToken(token = this.token) {
    try {
      return jwtDecode(token);
    }
    catch (err) {
      return {};
    }
  }

  validToken(token = this.token, options = {}) {
    // offset 是提前了多久，默认提前 60 秒
    const offset = options.offset * 1000 || 1000 * 60;
    if (!token) {
      return false;
    }

    try {
      const { exp } = jwtDecode(token);
      return Date.now() < exp * 1000 - offset;
    }
    catch (error) {
      return false;
    }
  }

  validTokenAuth(token = this.token) {
    if (!this.validToken(token)) {
      return false;
    }

    const auth = this.decodeToken(token);
    return auth && 0 < auth.id;
  }

  getTokenOffset = ({ timestamps = moment().unix() }) => {
    return (timestamps - moment().unix());
  }

  clean() {
    this.unsetInfo();
    this.unsetToken();
  }
}

export default new UserService();
