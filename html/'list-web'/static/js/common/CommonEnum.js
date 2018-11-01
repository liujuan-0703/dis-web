/**************************************************************************************************
 * 作    者：xiaoyan.zhou       创始时间：2018-4-28
 * 修 改 人：                     修改时间：
 * 描    述： 枚举类,项目中前台用到的所有枚举都在此处维护
 **************************************************************************************************/

/*=========================================公用枚举=================================================*/
/**
 * 是否启用(-1全部、0否、1是)
 */
var InUseEnum = {
	//0 否
	No: 0,
	//1 是
	Yes: 1
};
/**
 * 页面模式枚举(1新增,2编辑,3查看,4配置)
 */
var PageModelEnum = {
	//1 新增
	NewAdd: 1,
	//2 编辑
	Edit: 2,
	//3 查看
	View: 3,
	//配置
	configure: 4
};
/**
 * @type {{Refresh: 1(刷新), Reload: 2(重新加载),NO:(不执行操作)}}
 */
var PageLoadMode = {
	//1 刷新
	Refresh: 1,
	//2 重新加载(从第一页开始加载)
	Reload: 2,
	//3 不执行操作
	None: 3
};

/**
 * 机构单元类型枚举(1生产单位，2职能单位)
 */
var OUTypeEnum = {
	//生产单位
	PrdtCell: 1,
	//职能单位
	FunctionCell: 2
}

/**
 * 物料类型枚举(1：物料，2：辅料，3：公用工程介质，-1：未定义)
 */
var MtrlTypeEnum = {
	//物料
	Materiel: 1,
	//辅料
	Accessories: 2,
	//公用工程介质
	PubEngMed: 3,
	//未定义
	Undefined: -1
}
/**
 * 质检结果枚举(-1：全部，1：合格，0：不合格)
 */
var QualityResultEnum = {
	All: -1,
	Yes: 1,
	No: 0
}
/**
 * 罐区预报警罐对应的颜色
 */
var WarmAlarmColorEnum = {
	NORMAL: 0, //绿
	YELLOW: 1, //黄
	ORANGE: 2, //橙
	RED: 3, //红
}
//系统配置枚举
var ConfigTypeEnum = {
	Number: 0, //数值型 数字什么也能输入
	Time: 1, //时间型
	Enum: 2, // 枚举型0和1
	Float: 3, //浮点型
	String: 4, //字符型
	DateTime: 5, //日期时间型
	Date: 6 //日期型
}

/**
 * 条件等级枚举(枚举值为 0：黄色；1：橙色；2：红色；3：全部，默认选中全部。全部是不作为查询条件)
 */
var WarnAlarmGradeEnum = {
	Yellow: 0, //黄色 
	Orange: 1, //("橙色", "Orange", 1), 
	Red: 2, //("红色", "Red", 2),
	All: '' //("全部", "All", );
}
/**
 * 预报警接警操作配置操作枚举(0:抑制,1:忽略,2:处置)
 */
var WarmAlarmOperateTypeEnum = {
	Restrain: 0, //("抑制", "Restrain", ), 
	Ignore: 1, //("忽略", "Ignore", ), 
	Disposition: 2, //("处置", "Dispose", ),
	All: '' //("全部", "All", 3);
}
/**
*预报警配置
*/
var WarnAlarmTypeEnum  = {
	ALARM: 0, //("报警",1,"Alarm"),
	WARN: 1, //("预警",0,"Warn"),
	INTELLISENSE: 2, // ("智能提示",2,"IntelliSense"),
	All: '' //("全部",3,"All");
}
/**
*预报警看板tab切换枚举
*/
var WarmAlarmDisposeTypeEnum = {
    	WaitDispose: 0,   //("个人待处理", "Wait_Dispose", ), 
    	Disposing : 1, //("个人处理中", "Disposing", 1), 
    	Disposed : 2, //("个人已处理", "Disposed", 2),
    	Other :3 //("其他需关注", "Other", 3);
}