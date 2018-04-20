const nationArr = ['汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族', '满族', '侗族', '瑶族', '白族', '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '傈僳族', '佤族', '畲族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族', '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族', '塔吉克族', '怒族', '乌兹别克族', '俄罗斯族', '鄂温克族', '德昂族', '保安族', '裕固族', '京族', '塔塔尔族', '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族', '高山族'];

const nation = {};
nationArr.forEach((elem, index) => {
  nation[`___${elem}`] = elem;
  nation[`${elem}`] = index;
});
export default {
  NATION: nation,
  STUDENT: {
    GENDER: {
      MALE: 1,
      ___MALE: '男',
      FEMALE: 2,
      ___FEMALE: '女',
    },
    SOURCE: {
      UNKNOW: 0,
      ___UNKNOW: '未设置',
      AD: 1,
      ___AD: '户外广告',
      POST: 2,
      ___POST: '宣传单',
      FRIEND: 3,
      ___FRIEND: '亲友推荐',
      NET: 4,
      ___NET: '微信咨询',
      ACTIVITY: 5,
      ___ACTIVITY: '活动邀约',
      OTHER: 6,
      ___OTHER: '其他',
    },
  },
  WEEK: {
    MONDAY: 1,
    ___MONDAY: '周一',
    TUESDAY: 2,
    ___TUESDAY: '周二',
    WEDNESDAY: 3,
    ___WEDNESDAY: '周三',
    THURSDAY: 4,
    ___THURSDAY: '周四',
    FRIDAY: 5,
    ___FRIDAY: '周五',
    SATURDAY: 6,
    ___SATURDAY: '周六',
    SUNDAY: 7,
    ___SUNDAY: '周日',
  },
};
