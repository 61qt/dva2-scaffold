import _ from 'lodash';

class DetectError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg;
    const subfix = '';
    this.name = `DetectError${subfix}`;
  }
}

class LogoutError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg;
    const user = _.get(msg, 'user') || '';
    const subfix = user ? `_${user}` : '';
    this.name = `LogoutError${subfix}`;
  }
}

class PageNotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg;
    const path = _.get(msg, 'path') || '';
    const subfix = path ? `_${path}` : '';
    this.name = `PageNotFoundError${subfix}`;
  }
}

class NotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg;
    const path = _.get(msg, 'path') || '';
    const subfix = path ? `_${path}` : '';
    this.name = `NotFoundError${subfix}`;
  }
}

class RequestUncatchError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg;
    const path = _.get(msg, 'path') || '';
    const subfix = path ? `_${path}` : '';
    this.name = `RequestUncatchError${subfix}`;
  }
}

class NetworkRequestFailedError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg;
    const path = _.get(msg, 'path') || '';
    const status = _.get(msg, 'status_code') || '';
    let subfix = status ? `_${status}` : '';
    subfix = path ? `${subfix}_${path}` : subfix;
    this.name = `NetworkRequestFailedError${subfix}`;
  }
}

class NetworkRequestOfflineError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg;
    const path = _.get(msg, 'path') || '';
    const status = _.get(msg, 'status_code') || '';
    let subfix = status ? `_${status}` : '';
    subfix = path ? `${subfix}_${path}` : subfix;
    this.name = `NetworkRequestOfflineError${subfix}`;
  }
}

class SystemSyntaxError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg;
    const path = _.get(msg, 'path') || '';
    const subfix = path ? `_${path}` : '';
    this.name = `SystemSyntaxError${subfix}`;
  }
}

class ServerRequestError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg;
    const path = _.get(msg, 'path') || '';
    const status = _.get(msg, 'status_code') || '';
    let subfix = status ? `_${status}` : '';
    subfix = path ? `${subfix}_${path}` : subfix;
    this.name = `ServerRequestError${subfix}`;
  }
}

class UserRequestError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg;
    const path = _.get(msg, 'path') || '';
    const status = _.get(msg, 'status_code') || '';
    let subfix = status ? `_${status}` : '';
    subfix = path ? `${subfix}_${path}` : subfix;
    this.name = `UserRequestError${subfix}`;
  }
}

export {
  DetectError,
  LogoutError,
  PageNotFoundError,
  NotFoundError,
  RequestUncatchError,
  NetworkRequestFailedError,
  ServerRequestError,
  SystemSyntaxError,
  UserRequestError,
  NetworkRequestOfflineError,
};
