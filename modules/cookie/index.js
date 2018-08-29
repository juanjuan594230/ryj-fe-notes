const cookie = "_ga=GA1.2.2026687510.1521441115; gr_user_id=75b0b7b9-ab51-4140-80fa-c8269f38391a; MEIQIA_EXTRA_TRACK_ID=12280xbR5YC8QGeyEkqMHigEM1e; _gid=GA1.2.903895180.1535339034; Hm_lvt_93bbd335a208870aa1f296bcd6842e5e=1535164836,1535339034,1535345945,1535361036; Hm_lpvt_93bbd335a208870aa1f296bcd6842e5e=1535361036";

/* 
  利用JS实现cookie的读写和删除
*/

const cookieUtil = {
  get (cookie, name) {
    const str = '(^|; )' + name + '=([^;]*)(;|$)';
    const exp = new RegExp(str, 'i');
    const r = cookie.match(exp);
    if (r) {
      return r[2];
    }
    return undefined;
  },
  set (name, value, {expires, path, domain, secure}) {
    let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires && expires instanceof Date) {
      cookieText += '; expires=' + expires.toGMTString();
    }
    if (path) {
      cookieText += '; path=' + path; 
    }
    if (domain) {
      cookieText += '; domain' + domain;
    }
    if (secure) {
      cookieText += '; secure';
    }
    console.log(cookieText);
    // document.cookie = cookieText;
  },
  unset (name, {path, domain, secure}) {
    this.set(name, '', new Date(0), path, domain, secure);
  }
}

// console.log(cookieUtil.get(cookie, '_gid'));
// cookieUtil.set('name', 'renyujuan', {
//   secure: true
// });