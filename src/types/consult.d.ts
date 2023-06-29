import type { GOLBAL_API_STATUS } from './global'

export interface RES_HOME_DATA extends GOLBAL_API_STATUS {
  /**
   * 返回数据
   */
  data?: HOME_DATA
}

/**
 * 返回数据
 */
export interface HOME_DATA {
  /**
   * 总页数
   */
  pageTotal: number
  /**
   * 数据
   */
  rows: HOMEINFO_ROW[]
  /**
   * 总条数
   */
  total: number
}
export interface HOMEINFO_ROW {
  /**
   * 收藏数量
   */
  collectionNumber: number | string
  /**
   * 评论数量
   */
  commentNumber: number
  /**
   * 内容详情
   */
  content: string
  /**
   * 封面地址
   */
  coverUrl: CoverUrl[]
  /**
   * 创建人头像
   */
  creatorAvatar: string
  /**
   * 创建人科室
   */
  creatorDep: string
  /**
   * 创建人医院
   */
  creatorHospatalName: string
  /**
   * 创建人id
   */
  creatorId: string
  /**
   * 创建人姓名
   */
  creatorName: string
  /**
   * 创建人职称
   */
  creatorTitles: string
  /**
   * 文章id
   */
  id: string
  /**
   * 是否关注0未关注1关注
   */
  likeFlag: 0 | 1
  /**
   * 文章标题
   */
  title: string
  /**
   * 百科关联的话题
   */
  topics?: string[]
}

export enum CoverUrl {
  HttpsGimg2BaiducomImageSearchSrchttp3A2F2FcsslDuitangcom2Fuploads2Fblog2F2020092F282F2020092809311161FbdThumb1000_0jpegReferhttp3A2F2FcsslDuitangcomApp2002SizeF999910000QA80N0G0NFmtAutosec1659150598TF2Ccb384417E2E60F8631Ec0A58Fc8F4 = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202009%2F28%2F20200928093111_61fbd.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659150598&t=f2ccb384417e2e60f8631ec0a58fc8f4',
  HttpsGimg2BaiducomImageSearchSrchttp3A2F2FcsslDuitangcom2Fuploads2Fitem2F2020032F102F20200310000210RtndkThumb400_0JpgReferhttp3A2F2FcsslDuitangcomApp2002SizeF999910000QA80N0G0NFmtAutosec1659150667T67C57C386635Cba553E68009E02C0222 = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202003%2F10%2F20200310000210_rtndk.thumb.400_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659150667&t=67c57c386635cba553e68009e02c0222',
  HttpsImg0BaiducomItU19607714781403941227Fm253FmtAutoApp138FJPEGW400H400 = 'https://img0.baidu.com/it/u=1960771478,1403941227&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400'
}
export interface RES_LIKE_DATA extends GOLBAL_API_STATUS {
  /**
   * 返回数据
   */
  data?: LIKE_DATA
}

/**
 * 返回数据
 */
export interface LIKE_DATA {
  /**
   * 总页数
   */
  pageTotal: number
  /**
   * 数据
   */
  rows: FOLLOW_DOCTOR_DATA[]
  /**
   * 总条数
   */
  total: number
}

export interface FOLLOW_DOCTOR_DATA {
  /**
   * 医生头像
   */
  avatar: string
  consultationNum: number | string
  /**
   * 科室名称
   */
  depName: string
  /**
   * 医院等级-名称简写
   */
  gradeName: string
  /**
   * 医院名称
   */
  hospitalName: string
  /**
   * 医生id
   */
  id: string
  /**
   * 未登录用户默认返回0，登录用户实际判断是否关注的标志1已关注0未关注
   */
  likeFlag: 0 | 1
  major: string
  /**
   * 医生姓名
   */
  name: string
  /**
   * 职称
   */
  positionalTitles: string
  score: number | string
  /**
   * 接诊费用
   */
  serviceFee: number | string
}
// props类型 recommend推荐，fatReduction减脂，food健康饮食，like关注医生页面文章
export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food'
export type REQ_KNOWLEDGE_DATA = REQ_DOCTOR_DATA & {
  type: KnowledgeType
}
export type REQ_DOCTOR_DATA = {
  current?: number
  pageSize?: number
}
// 关注的类型，医生|文章|百科话题|疾病
export type FOLLOW_TYPE = 'doc' | 'knowledge' | 'topic' | 'disease'
