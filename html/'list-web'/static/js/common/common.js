jQuery.support.cors = true;
$(function () {

})

/**
 * 设置localStorage
 * params {Array} arrKey 需要存储的数据的key值
 * params {Array} arrValue 需要存储的数据的value值
 */
function setLocalStorage(arrKey, arrValue) {
    window.localStorage.clear();
    var storage = window.localStorage;
    for (var i = 0; i < arrKey.length; i++) {
        storage[arrKey[i]] = arrValue[i];
    }
}

//增删改查
function getDatas(urlD, dataS) {
    $('#demo-table').bootstrapTable({
        method: "get",
        //使用get请求到服务器获取数据  
        url: urlD,
        responseHandler: function (res) {
            return {
                "total": $.ET.getPageInfo(res)[0] == undefined ? 0 : $.ET.getPageInfo(res)[0].recordCount, //总页数
                "rows": $.ET.toObjectArr(JSON.stringify(res).replace(/\</g, "&lt;").replace(/\>/g, "&gt;")) //数据
            };
        },
        cache: false,
        pagination: true,
        //启动分页  
        pageSize: 5,
        //每页显示的记录数  
        pageNumber: 1,
        //当前第几页  
        pageList: [5, 20, 50, 100],
        //记录数可选列表  
        search: false,
        //是否启用查询 
        sidePagination: "server",
        //表示服务端请求  
        queryParamsType: "undefined",
        queryParams: function queryParams(params) {    //设置查询参数  
            var param = {
                $skip: (params.pageNumber - 1) * params.pageSize,
                $top: params.pageSize
            };
            return param;
        },
        onCheck: function (row, tr, flied) {
            var arr = {
                name: row.appName,
                type: 'line',
                data: [row.orderId, row.orderId + 1, row.orderId + 2, row.orderId + 3, row.orderId + 4, row.orderId + 5,],
                // markPoint: {
                //     data: [
                //         {type: 'max', name: '最大值'},
                //         {type: 'min', name: '最小值'}
                //     ]
                // },
                markLine: {
                    data: [{
                        type: 'average',
                        name: '平均值'
                    }]
                }
            }
            data.push(arr)
            chart2.setOption(option);
        },
        columns: dataS,
        formatLoadingMessage: function () {
            return '';
        }
    });
}

//增删改查
function getDataT(data, columns, oncheckcallback, uncheckcallback, callback, target, onClickCallback) {
    target = target || $('#demo-table');
    var _self;
    target.bootstrapTable('destroy').bootstrapTable({
        data: data,
        columns: columns,
        // height:44,
        onCheck: function (row) {
            oncheckcallback && oncheckcallback(row)
        },
        onClickRow: function (row, element) {
            onClickCallback && onClickCallback(row, element);
        },
        onUncheck: function (row, index) {
            uncheckcallback && uncheckcallback(row, index)
        },
        formatLoadingMessage: function () {
            return '';
        },
        onLoadSuccess: function (data) {
            onLoadSuccess && onLoadSuccess(data)
        },
        onsort: function () {
            _self = $(this)
        }
    });
    callback && callback();
}

//获取应用列表
function getApps() {
    ajaxGet(
        ResourceHttp + 'apps',
        function (data) {
            var str = ""
            for (var i = 0; i < data.length; i++) {
                str = str + '<option value=' + data[i].appCode + '>' + data[i].appName + '</option>';
            }
            $("#appS").html("")
            $("#appS").append(str);
            if (localStorage.getItem("appCode") == "" || localStorage.getItem("appCode") == null) {
                $("#appS option:first").prop("selected", 'selected');
            } else {
                $("#appS").val(localStorage.getItem("appCode"))
            }
        }
    )
}

/**
 * echart图标公共函数,参数为数组结构，数组里面为字符串
 * params {Object} options 参数对象
 */
function InitEchaert(options) {
    var defaults = {
        title: '', // title 图形说明标题
        type: ['line'], // type 图标类型
        echartsId: 'echartsId', // echartsId 绘图id
        xAxisData: [], // xAxisData 横坐标数据
        xName: ['测试'], // x轴坐标说明
        seriesData: [], // series数据源
        smooth: false, // smooth 控制折线图是不是曲线
        color: [], // color 文字颜色
        legend: [], // legend 图标线条说明
        pieData: [], // 饼图数据源
        radius: [], //
        center: [], // 饼图中心圆大小（单位%）
        areaColor: [], // 饼图的区域颜色
        barWidth: '40%', // 柱状图宽度
        textStyle: '#A1C6EA', //
        xType: 'category', // x轴类型
        myChart: '', // 初始化的echart对象
        yInterval: '', // y坐标轴分割间隔
        yMax: '', // y轴坐标最大值
        yMin: '', // y轴坐标最小值
        yName: '', // y轴说明
        yLineColor: '#5180ad', // y轴线的颜色
        yNameColor: '#98BADF', // y轴文字说明的颜色
        yLineTextColor: '#BDD9FA' // y轴刻度文本的颜色
    }
    var obj = $.extend({},
        defaults,
        options
    );
    var option;

    if (obj.type[0] === 'line') {
        option = {
            title: {
                text: obj.title
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: obj.legend,
                selectedMode: false
            },
            grid: {
                left: '3%',
                right: '5%',
                bottom: '30%',
                containLabel: true
            },
            xAxis: initxAxis(obj),
            yAxis: {
                name: obj.yName,
                show: true,
                type: 'value',
                axisLabel: {
                    formatter: ''
                },
                min: obj.yMin,
                interval: obj.yInterval,
                max: obj.yMax,
                splitLine: {
                    show: false
                },
                axisLine: { //坐标轴的颜色
                    lineStyle: {
                        color: obj.yLineColor
                    }
                },
                nameTextStyle: {
                    color: obj.yNameColor,
                    fontSize: 8
                },
                axisLabel: {
                    textStyle: {
                        color: obj.yLineTextColor
                    }
                }
            },
            series: initSeries(obj)
        }

    } else if (obj.type === 'pie') {
        option = {
            tooltip: {
                trigger: 'items',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color: areaColor,
            calculable: true,
            series: initSeries(obj)
        };
    }
    obj.myChart.setOption(option);
}

function mergeCells(data, fieldName, colspan, target, fieldList) {
    // 声明一个map计算相同属性值在data对象出现的次数和
    var sortMap = {};
    for (var i = 0; i < data.length; i++) {
        for (var prop in data[i]) {
            //例如people.unit.name
            var fieldArr = fieldName.split(".");
            page.logic.getCount(data[i], prop, fieldArr, 0, sortMap);
        }
    }
    var index = 0;
    for (var prop in sortMap) {
        var count = sortMap[prop];
        for (var i = 0; i < fieldList.length; i++) {
            $(target).bootstrapTable('mergeCells', {
                index: index,
                field: fieldList[i],
                colspan: colspan,
                rowspan: count
            });
        }
        index += count;
    }
}

function getCount(data, prop, fieldArr, index, sortMap) {
    if (index == fieldArr.length - 1) {
        if (prop == fieldArr[index]) {
            var key = data[prop];
            if (sortMap.hasOwnProperty(key)) {
                sortMap[key] = sortMap[key] + 1;
            } else {
                sortMap[key] = 1;
            }
        }
        return;
    }
    if (prop == fieldArr[index]) {
        var sdata = data[prop];
        index = index + 1;
        getCount(sdata, fieldArr[index], fieldArr, index, sortMap);
    }

}

/**
 * 初始化X轴数据
 * params {Object} options 参数源
 */
function initxAxis(options) {
    var obj = [];
    for (var i = 0; i < options.xAxisData.length; i++) {
        if (options.type[i] === 'line') {
            obj.push({
                type: options.xType,
                name: options.xName[i], // 说明
                axisLine: { //坐标轴的颜色
                    lineStyle: {
                        color: '#5180ad'
                    }
                },
                // nameLocation: 'middle',
                // nameGap: '30',
                boundaryGap: false,
                data: options.xAxisData[i],
                splitLine: {
                    show: false
                }
            })
        } else if (options.type[i] === 'pie') {
            // 暂时不做操作
        } else if (options.type[i] === 'bar') {

        }
    }
    return obj;
}

/**
 * 初始化series
 * params {Object} options 参数源
 */
function initSeries(options) {
    var obj = [];
    for (var i = 0; i < options.seriesData.length; i++) {
        if (options.type[i] === 'line') {
            obj.push({
                type: options.type[i],
                name: options.legend[i],
                smooth: options.smooth,
                label: {
                    emphasis: {
                        show: true,
                        position: 'left',
                        textStyle: {
                            color: options.color[i],
                            fontSize: 16
                        }
                    }
                },
                data: options.seriesData[i],
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 2, [{
                            offset: 0,
                            color: '#319ce0'
                        }, {
                            offset: 0.85,
                            color: 'rgba(255, 255, 255,0)'
                        }])
                    }
                }
            });
        } else if (options.type[i] === 'pie') {
            obj.push({
                name: options.legend[i],
                type: options.type[i],
                radius: options.radius,
                center: options.center,
                roseType: 'area',
                data: options.pieData,
                label: {
                    normal: {
                        textStyle: {
                            color: options.textStyle
                        }
                    }
                },
                // 注释部分暂时不用，后续使用在扩展
                labelLine: {
                    // normal: {
                    //     length: 0,
                    //     length2: 20
                    // }
                }
                // animationType: 'scale',
                // animationEasing: 'elasticOut',
            });
        } else if (options.type[i] === 'bar') {
            obj.push({
                name: options.legend[i],
                type: options.type[i],
                barWidth: options.barWidth,
                data: options.seriesData[i]
            });
        }
    }
    return obj;
}

/**
 * 鼠标滚动加载
 * params {object} target 目标对象
 * params {Function} callback超出高度后的回调函数操作
 */
function mouseWhile(target, callback, targetHeight) {
    var flag = false;
    if (flag) {
        callback && callback();
    } else {
        var newHeight;
        var oldHeight = 0;
        target.scroll(function (e) {
            flag = false;

            if ((target.scrollTop()) >= targetHeight) {
                targetHeight += targetHeight;
                newHeight = target.scrollTop();
                if (newHeight > oldHeight) {
                    oldHeight = newHeight;
                    // 加载数据
                    callback && callback();
                }
            }
        });
    }
}

/**
 * 自定义滚动条
 * params {object} target 需要加滚动条的对象
 * params {string} width 可滚动区域宽度
 * params {string} height 可滚动区域高度
 * params {string} size 滚动条宽度
 * params {string} color 滚动条颜色
 * params {string} railColor 轨道颜色
 * params {string} size 滚动条宽度
 * params {number} wheelStep 滚轮滚动量
 * params {string} borderRadius 滚轮滚动量
 * params {string} railBorderRadius 滚轮滚动量
 * params {number} tableHeight 表格的高度
 */
function customScroll(option) {
    var target = option.target,
        width = option.width,
        height = option.height,
        tableHeight = option.tableHeight || '100%';
    var targetHeight = height.indexOf('calc') === -1 ?
        height.substr(0, height.length - 2) :
        target.height();

    target.css({
        'overflow': 'visible'
    });
    target.siblings('.slimScrollBar').hide();
    target.siblings('.scrollBar').hide();
    // 通过高度判断是否显示滚动条
    if (+targetHeight < tableHeight) {

        target.css({
            'overflow': 'hidden'
        });
        target.slimScroll({
            width: width || '100%', //可滚动区域宽度
            height: height || '100%', //可滚动区域高度
            size: '8px', //组件宽度
            color: '#3c3f42', //滚动条颜色
            position: 'right', //组件位置：left/right
            distance: '1px', //组件与侧边之间的距离
            start: 'top', //默认滚动位置：top/bottom
            opacity: 1, //滚动条透明度
            alwaysVisible: true, //是否 始终显示组件
            disableFadeOut: false, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
            railVisible: true, //是否 显示轨道
            railColor: '#1d1f23', //轨道颜色
            railOpacity: 1, //轨道透明度,
            railClass: 'scrollBar',
            railDraggable: true, //是否 滚动条可拖动
            allowPageScroll: true, //是否 使用滚轮到达顶端/底端时，滚动窗口
            wheelStep: '3px', //滚轮滚动量
            borderRadius: '3px', //滚动条圆角
            railBorderRadius: '1px' //轨道圆角
        });
    }
    // 目标高度大于实际内容高度滚动条隐藏
    if (target.height() > tableHeight) {
        target.siblings('.scrollBar').hide();
    }
}

/**
 * ajaxGet请求函数
 * params {Function} yesCallback 请求成功回调函数
 * params {Function} errorCallback 请求失败回调函数
 */
function ajaxGet(url, yesCallback, errorCallback) {

       getUserCode(function (userCode) {
           var str = "?"
           if (url.indexOf('?') > 0) {

               str = "&";
           }
           url += (str + "userCode=" +userCode);
           $.ajax({
               url: url,
               type: 'get',
               success: function (result, status, xhr) {
                   result = JSON.stringify(result).replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
                   var data = $.ET.toObjectArr(result);
                   var page = '';
                   var newResult = JSON.parse(result).collection;
                   for (var k in newResult) {
                       if (k === 'page') {
                           page = newResult.page;
                       }
                   }
                   yesCallback && yesCallback(data, page);
               },
               error: function (data) {
                   errorCallback && errorCallback(data, page);
                   // alert("网络出错啦")
               }
           })
       })





}


function getUserCode(callback) {
    if (GetQueryString("dev")) {
        callback&&callback("zhouxy210");

    } else {
       $.ajax({
            url: DISC.API.getUserCode,
            type: 'get',
           success:function (user) {
               callback&&callback(user.data.userCode);
           },
           error:function () {
               callback&&callback("zhouxy210");
           }

        })
    }


}


/**
 * ajaxGet请求函数
 * params {Function} yesCallback 请求成功回调函数
 * params {Function} errorCallback 请求失败回调函数
 */
function ajaxGetChart(url, yesCallback, errorCallback) {
	 getUserCode(function (userCode) {
           var str = "?"
           if (url.indexOf('?') > 0) {

               str = "&";
           }
           url += (str + "userCode=" +userCode);
    $.ajax({
        url: url,
        async: false,
        type: 'get',
        success: function (result, status, xhr) {
            result = JSON.stringify(result).replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
            var data = $.ET.toObjectArr(result);
            var page = '';
            var newResult = JSON.parse(result).collection;
            for (var k in newResult) {
                if (k === 'page') {
                    page = newResult.page;
                }
            }
            yesCallback && yesCallback(data, page);
        },
        error: function (data) {
            errorCallback && errorCallback(data, page);
            // alert("网络出错啦")
        }
    })
})
}

/**
 * tab切换更新数据（此切换耦合性较大，使用本项目大部分功能，可以节省开发效率）
 * params {object} options本方法需要传的对象
 */
function tab(options) {
    var defaults = {
        target: {}, // 点击的对象
        targetSublins: '', // 点击的对象类名或者id(正常为类名)
        dataId: '', // 获取自定义属性的值（data-id="1"）
        addStyle: {}, // 点击添加样式
        removeStyle: {}, // 其他兄弟去除样式
        url: '', // ajax请求的url
        defaultUrl: '', // 默认请求的url
        tabCallback: null, // 切换后的操作函数
        success: null, // 回调函数
        checkbox: false, // tab切换的时候是否多选，url参数多次拼接查询
        beforeClick: null, // 点击后马上执行的方法
        extendUrl: false, // 需要扩展的url,当切换的tab
        flag: true
    };
    var obj = $.extend({}, defaults, options);
    //  var flag = true;
    var targetArr = $(obj.targetSublins);
    // 初始化
    var flag = !options.flag;
    if (flag) {
        if (typeof obj.addStyle !== 'string') {
            targetArr.eq(0).css(obj.addStyle);
        } else {
            targetArr.eq(0).addClass(obj.addStyle);
        }
        // 外面用的时候，obj.target要取索引第一个
        getData(obj, obj.defaultUrl, obj.target);
    }
    // 点击
    obj.target.on('click', function (e) {
        var self = this;
        flag = false;
        e.preventDefault();
        var url = '';
        if (obj.dataId) {
            url = obj.url.indexOf(':code') > -1 ?
                obj.url.replace(':code', $(this).data(obj.dataId)) :
                obj.url + $(this).data(obj.dataId);
        }

        // 样式清除控制
        if (!obj.checkbox) {
            for (var i = 0; i < targetArr.length; i++) {
                if (typeof obj.removeStyle !== 'string') {
                    targetArr.eq(i).css(obj.removeStyle);
                } else {
                    targetArr.eq(i).removeClass(obj.removeStyle);
                }
            }
        }

        // 添加样式
        if (typeof obj.addStyle !== 'string') {
            $(this).css(obj.addStyle);
        } else {
            if (obj.checkbox) {
                $(this).hasClass(obj.addStyle) ? $(this).removeClass(obj.addStyle) : $(this).addClass(obj.addStyle);
            } else {
                $(this).addClass(obj.addStyle);
            }
        }

        //切换成功后的操作，兼容tab切换后布局不同的情况
        obj.tabCallback && obj.tabCallback(self, $(this).hasClass(obj.addStyle), $(this));

        if (url && !obj.extendUrl) {
            getData(obj, url, self);
        }
    });

    // ajax请求数据
    function getData(obj, url, self) {
        if (obj.url) {
            ajaxGet(
                url,
                function (data) {
                    obj.success && obj.success(data, self);
                },
                function () {
                }
            );
        } else {
            // console.error('url没有传递');
        }
    }
}

/**
 * tab切换,本切换耦合性小，功能可以持续优化并添加
 */
function TabView(options) {
    this.obj = $.extend({},
        TabView.defaults,
        options
    );
    this.init();
}

TabView.prototype = {
    init: function () {
        // 点击
        var self = this;
        this.obj.target.on('click', function (e) {
            flag = false;
            e.preventDefault();
            // 样式清除控制
            var targetArr = $(self.obj.targetSublins);
            if (!self.obj.checkbox) {
                for (var i = 0; i < targetArr.length; i++) {
                    if (typeof self.obj.removeStyle !== 'string') {
                        targetArr.eq(i).css(self.obj.removeStyle);
                    } else {
                        targetArr.eq(i).removeClass(self.obj.removeStyle);
                    }
                }
            }

            // 添加样式
            if (typeof self.obj.addStyle !== 'string') {
                $(this).css(self.obj.addStyle);
            } else {
                if (self.obj.checkbox) {
                    $(this).hasClass(self.obj.addStyle) ? $(this).removeClass(self.obj.addStyle) : $(this).addClass(self.obj.addStyle);
                } else {
                    $(this).addClass(self.obj.addStyle);
                }
            }

            //切换成功后的操作，兼容tab切换后布局不同的情况
            self.obj.tabCallback && self.obj.tabCallback($(this), $(this).hasClass(self.obj.addStyle));
        });
    }
}

// 默认设置
TabView.defaults = {
    target: {}, // 点击的对象
    targetSublins: '', // 点击的对象类名或者id(正常为类名)
    addStyle: {}, // 点击添加样式
    removeStyle: {}, // 其他兄弟去除样式
    tabCallback: null, // 切换后的操作函数
    checkbox: false // tab切换的时候是否多选，url参数多次拼接查询
}

$.TabView = function (options) {
    return new TabView(options);
};

/**
 * 前端组装树结构的数据
 * params {Array} data后台返回的所有json数组
 * params {String} 数据的本身的id
 * params {String} 数据父级节点的id
 **/
function treeData(data, id, parentId) {
    var arr = [];
    var childArr = [];
    var obj = {};

    for (var i = 0, len = data.length; i < len; i++) {
        data[i].name = data[i].mtlName;
        obj = data[i];
        // 因为只有一级的是时候id为0
        if (data[i][parentId] !== 0) {
            childArr.push(data[i])
            setChildrenData(arr, childArr, data[i][id]);
        } else {
            arr.push(data[i])
        }
    }

    function setChildrenData(data, childData, parentsId) {
        obj.children = [];
        for (var j = 0, leng = data.length; j < leng; j++) {
            data[j].children = [];
            for (var k = 0, le = childData.length; k < le; k++) {
                if (data[j][id] === childData[k][parentId]) {
                    data[j].children.push(childData[k]);
                }
            }
        }
    }

    return arr;
}

/**
 * table表头固定
 * params {Array} arr表头配置的数据
 * params {Object} target需要渲染到页面的dom
 */
function fixdTableHeader(target, arr, bootstrapTable) {
    target.children(".bootstrap-table").hide();
    var exp = '' +
        '<div class="bootstrap-table">' +
        '<div class="fixed-table-toolbar"></div>' +
        '<div class="fixed-table-container" style="padding-bottom: 0px;">' +
        '<div class="fixed-table-header">' +
        ' <table class="table">' +
        '<thead>' +
        '<tr class="js-tr-box">' +
        '</tr>' +
        '</thead>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>';
    target.append(exp);
    var str;
    if (arr[0].checkbox) {
        str = '' +
            '<th class="bs-checkbox " style="width: 36px; " data-field="0">' +
            '<div class="th-inner "><input name="btSelectAll" type="checkbox"></div>' +
            '<div class="fht-cell"></div>' +
            '</th>';
        target.find('.js-tr-box').append(str);
    }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].width) {
            if (arr[i].sortable == true) {
                str = '' +
                    '<th style="text-align: center; vertical-align: middle; width: ' + arr[i].width + ';" data-field="id">' +
                    '<div class="th-inner sortable both">' + arr[i].title + '</div><div class="fht-cell"></div>' +
                    '</th>';
                target.find('.js-tr-box').append(str);
            } else {
                str = '' +
                    '<th style="text-align: center; vertical-align: middle; width: ' + arr[i].width + ';" data-field="id">' +
                    '<div class="th-inner ">' + arr[i].title + '</div><div class="fht-cell"></div>' +
                    '</th>';
                target.find('.js-tr-box').append(str);
            }
        }
    }
    // 排序问题
    target.find('.th-inner').on('click', function () {
        if ($(this).hasClass('sortable')) {
            bootstrapTable.find('.sortable').click();

            if ($(this).hasClass('both') || $(this).hasClass('desc')) {
                $(this).attr('class', 'th-inner sortable asc');
            } else if ($(this).hasClass('asc')) {
                $(this).attr('class', 'th-inner sortable desc');
            }

        }
    })
}

// 随机取数据
// count取出数据的长度
// arr目标数组
function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0),
        i = arr.length,
        min = i - count,
        temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

/**
 * 模糊搜索功能
 * params{keyWords} 需要匹配的关键字
 * params{list} 需要过滤的数据源
 * params{label} 当数组是json对象时，需要过滤的字段
 * return 匹配到的所有数据的数组
 */
function Search(list, label, keyWords) {
    if (keyWords === null) {
        keyWords = label;
        label = null;
    }

    var arr = [];
    var reg = new RegExp(keyWords);
    var flag;
    for (var i = 0, len = list.length; i < len; i++) {

        flag = label ? list[i][label].match(reg) : list[i].match(reg);
        if (flag) {
            arr.push(list[i]);
        }
    }
    return arr;
}

// 日期格式化插件
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
}

/**
 * 精确到时分的日期选择函数
 * params {object} target 目标对象
 */
function myTimePicker(target) {
    var dateTime = target.datetimepicker({ // 添加日期选择功能
        dateFormat: 'yy-mm-dd', // 日期格式
        showSecond: true,
        timeFormat: 'hh:mm:ss',
        stepHour: 1,
        stepMinute: 1,
        stepSecond: 1,
        numberOfMonths: 1, // 显示几个月
        showButtonPanel: true, // 是否显示按钮面板
        clearText: '清除', // 清除日期的按钮名称
        currentText: '此刻',
        isShowCurrent: false,
        closeText: '关闭', // 关闭选择框的按钮名称
        //  altField:'#dates',// 为日期选择器指定一个<input>域
        yearSuffix: '年', // 年的后缀
        showMonthAfterYear: 'true', // 是否把月放在年的后面
        //  defaultDate:str,// 默认日期
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        onSelect: function (selectedDate) { // 日期被选择后执行
            //设置结束日期不得早于开始日期
            var option = this.id === "dateTime" ? "minDate" : "maxDate",
                instance = $(this).data("datepicker"),
                date = $.datepicker.parseDate(
                    instance.settings.dateFormat ||
                    $.datepicker._defaults.dateFormat,
                    selectedDate, instance.settings);
            dateTime.not(this).datepicker("option", option, date);
        }
    })
}

/**
 * 精确到日的日期选择函数
 * params {object} target 目标对象
 */
function myDatePicker(target) {
    var dateDay = target.datepicker({ //添加日期选择功能
        dateFormat: 'yy-mm-dd', //日期格式
        numberOfMonths: 1, //显示几个月
        showButtonPanel: true, //是否显示按钮面板
        clearText: '清除', //清除日期的按钮名称
        closeText: '关闭', //关闭选择框的按钮名称
        // altField:'#dates',//为日期选择器指定一个<input>域
        currentText: '今天',
        yearSuffix: '年', //年的后缀
        showMonthAfterYear: 'true', //是否把月放在年的后面
        // defaultDate:str,//默认日期
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        onSelect: function (selectedDate) { //日期被选择后执行
            //设置结束日期不得早于开始日期
            var option = this.id === 'datesDay' ? 'minDate' : 'maxDate';
            var instance = $(this).data('datepicker');
            var date = $.datepicker.parseDate(
                instance.settings.dateFormat ||
                $.datepicker._defaults.dateFormat,
                selectedDate, instance.settings);
            dateDay.not(this).datepicker('option', option, date);
        }
    })
}

/**
 * 精确到月的日期选择函数
 * params {object} target 目标对象
 */
function myMonthPicker(target) {
    var dateMonth = target.datepicker({
        dateFormat: 'yy-mm', // 日期格式
        numberOfMonths: 1, // 显示几个月
        monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], // 区域化月名为中文
        prevText: '上月', // 前选按钮提示
        nextText: '下月', // 后选按钮提示
        changeMonth: true,
        changeYear: true,
        currentText: '本月',
        showButtonPanel: true, // 是否显示按钮面板
        clearText: '清除', // 清除日期的按钮名称
        closeText: '关闭', // 关闭选择框的按钮名称
        //  altField:'#dates',// 为日期选择器指定一个<input>域
        yearSuffix: '年', // 年的后缀
        showMonthAfterYear: 'true', // 是否把月放在年的后面
        //  defaultDate:str,// 默认日期
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六']
    })
}

// 罐区搜索框滚动条添加
/**
 * 添加滚动条
 * params{array} data 数据源
 * params{object} target 需要添加下拉菜单的目标对象
 * params{number} index 点击这一项的父级索引值
 * params{string} url 点击时请求数据源的url路径
 */
function addSelectDom(data, target, index, code, id, name, callback) {

    if (data.length > 0) {

        initSelecHtml(index, target, data, code, id, name, function () {
            // 滚动条
            scroll($('.tabs-list'));
            callback && callback();
        });
    }
}

/**
 * 滚动条的配置
 * params{ulName} 要添加滚动条的目标对象
 */
function scroll(ulName) {
    customScroll(
        $(ulName),
        '140px',
        '228px',
        '8px',
        '#3c3f42',
        '#1d1f23',
        10,
        '0px',
        '0px',
        '2px',
        'scrollBar',
        ($(ulName).children('li').height()) * ($(ulName).children('li').length)
    );
}

/**
 * 渲染select
 * params {number} index 点击这一项的父级索引值
 * params {object} target 需要添加下拉菜单的目标对象
 * params {array} data 数据源
 * params {string} code 每条数据的code
 * params {string} id 每条数据的id
 * params {string} name 数据源里面现实的汉字
 * params {function} callback 渲染后的回调函数
 **/
function initSelecHtml(index, target, data, code, id, name, callback) {
    code = code || 'code';
    id = id || 'id';
    if (data.length > 0) {
        // 其他清空
        target.children().eq(index).nextAll().remove();
        var exp;
        var $parent = $('<ul class="tabs-list"></ul>');
        for (var i = 0, len = data.length; i < len; i++) {
            exp = '<li class="js-tab-list" data-code="' + data[i][code] + '" data-id="' + data[i][id] + '">' + data[i][name] + '</li>';
            $parent.append(exp);
        }
        target.append($parent);

        callback && callback();
    }
}

function setHtmlHeight() {
    var docHeight = $(window).height();
    $('html').height(docHeight - 50);
}

// 日期格式转换
function setTime(time) {
    return new Date(parseInt(new Date(time).getTime())).toLocaleString();
}

// 获取从月初到系统分时间的所有时间
function getMonthTime(date) {
    var date_f = date.split('-');
    var year = date_f[0];
    var month = date_f[1];
    var arr = [];
    var day_length = parseInt(getDaysInOneMonth(year, month));
    for (var i = 0; i < day_length; i++) {
        var str = year + '-' + month + '-' + (i + 1);
        arr.push(str);
    }

    function getDaysInOneMonth(year, month) {
        month = parseInt(month, 10);
        var d = new Date(year, month, 0);
        return d.getDate();
    }

    return arr;
}

// var aa = getMonthTime(setTime(new Date()));
// console.log(aa)

//下拉框
$(function () {
    var select_list;
    $(document).on('click', '.input-select', function () {
        $('body').css({
            'overflow': 'hidden'
        });
        var _this = $(this);
        var option_box = _this.find('.option-box');
        var option_box_html = option_box.html();
        var option = option_box.find('.option-list');
        var option_id = _this.attr('id');
        if (option_id) {
            option_id = option_id + '_alert';
        } else {
            option_id = '';
        }
        if (!option.length) {
            return false;
        }
        var option_arr = [];
        for (var i = 0; i < option.length; i++) {
            option_arr.push(option.html());
        }
        select_list = _this.find('input.select-list');
        var offset = select_list.offset();
        var top = offset.top - $(window).scrollTop() + select_list.height() + 3;
        var left = offset.left;
        var width = select_list.width() + 42;
        $('body').remove('div.option-box-alert')
        .append('<div class="option-box-alert" id="' + option_id + '"><div class="option-box-cover" style="top:' + top + 'px;left:' + left + 'px;min-width:' + width + 'px"><div class="slimer">' + option_box_html + '</div></div></div>');
        customScroll({
            target: $(".slimer"),
            width: '100%',
            height: '210px',
            tableHeight: $(".option-box-cover").height()

        });
    });
    $(document).on('click', '.option-box-cover .slimer> .option-list', function () {
        select_list.val($(this).text());
        if ($(this).data('message')) {
            select_list.attr('data-message', $(this).data('message'));
        }
    });
    $(document).on('click', '.option-box-alert', function () {
        $(this).remove();
        $('body').css({
            'overflow': 'inherit'
        });
    });
});

//搜索框 
$(function () {
    $(document).on('keyup', '.search_box input.search-input', function () {
        var $this = $(this);
        var value = $this.val();
        var search_delete_btn = $this.siblings('.search_delete');
        if (value.toString()) {
            search_delete_btn.show();
        } else {
            search_delete_btn.hide();
        }
    });
    $(document).on('click', '.search_box .search_delete', function () {
        var $this = $(this);
        var search_input = $this.siblings('.search-input');
        search_input.val('');
        $this.hide();
    });
});

//后台数据处理
function initFilterData(datas) {
    var showData = "";
    if (datas === "" || datas.length == 0 || datas == "[]") {
        showData = datas;
    } else if (datas != "") {
        showData = JSON.parse(datas)
    }
    return showData;
}

//数组去重
Array.prototype.unique = function () {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}

//获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

$.fn.textScroll = function () {
    var p = $(this);
    var c = p.children();
    var speed = 3000; // 值越大，速度越小
    var pw = p.width(); // 父盒子的宽度
    // console.log(c)
    var li = c.children(); // 获取ul中的li
    var realWidth = 0; //计算得到的真实宽度,即所有li加其间距的宽度
    for (var i = 0, len = li.length; i < len; i++) {
        realWidth += li[i].clientWidth + 40;
    }
    var t = (realWidth / 100) * speed;
    var f = null
    var t1 = 0;

    function ani(tm) { //移动的函数
        counttime();
        c.animate({
            left: -realWidth
        }, tm, "linear", function () {
            c.css({
                left: pw
            });
            clearInterval(f);
            t1 = 0;
            t = ((realWidth + pw) / 100) * speed;
            ani(t);
        });
    }

    function counttime() { // 计算时间
        f = setInterval(function () {
            t1 += 10;
        }, 10);
    }

    p.on({
        mouseenter: function () {
            c.stop(false, false);
            clearInterval(f);
            //          console.log(t1);
        },
        mouseleave: function () {
            ani(t - t1);
            //          console.log(t1);
        }
    });
    ani(t);
};

//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

//处置方案 全局替换变量方法
function replaceDisText(str, arr) {
    if ($.isArray(arr) && arr.length) {
        for (var i = 0; i < arr.length; i++) {
            var name = arr[i].name;
            var value = arr[i].value;
            str = str.replace(new RegExp(name, 'g'), value);
        }
    }
    return str;
}

//时间戳转时间
function getMyDate(str) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen); //最后拼接时间
    function getzf(num) {
        if (parseInt(num) < 10) {
            num = '0' + num;
        }
        return num;
    }

    return oTime;
};

//底部报警
function alertMessage() {
    var getWarmAlarmTabUrl = DISC.API.URL + '/api/rm/tankAreaMonitor/getWarmAlarmTab';
    ajaxGet(getWarmAlarmTabUrl, function (data) {
        console.log('底部报警数据', data);
        var scrollBars = [];
        if (data[0].informMsg) {
            var item = $.parseJSON(data[0].informMsg);
            var items = $.ET.toObjectArr(item);
//			console.log('底部',items);
            for (var i = 0; i < items.length; i++) {
                var str = items[i].warnAlarmTime + " " + items[i].eventDscp;
                scrollBars.push(str);
            }
        }
        var result = {
            alertCount: data[0].alarmNumber,
            preAlertCount: data[0].warmNumber,
            remindCount: data[0].intelliSenseNumber,
            scrollBars: scrollBars
        };
        var text_arr = result.scrollBars;
        var obj = $('.alert-message');
        var html = '';
        html += '<div class="alert-box" onclick="javascript:location.href=\'../../../html/WAB/WarnAlarmBoard/index.html\';"><img src="../../../images/common/icon_warning.png" /><span>报警</span>';
        if (result.alertCount) {
            html += '<span class="alert-num">' + result.alertCount + '</span>';
        }
        html += '</div>';
        html += '<div class="alert-box" onclick="javascript:location.href=\'../../../html/WAB/WarnAlarmBoard/index.html\';"><img src="../../../images/common/icon_early.png" /><span>预警</span>';
        if (result.preAlertCount) {
            html += '<span class="alert-num">' + result.preAlertCount + '</span>';
        }
        html += '</div>';
        html += '<div class="alert-box" onclick="javascript:location.href=\'../../../html/WAB/WarnAlarmBoard/index.html\';"><img src="../../../images/common/icon_hint.png" /><span>智能提示</span>';
        if (result.remindCount) {
            html += '<span class="alert-num yellow">' + result.remindCount + '</span>';
        }
        html += '</div>';
        html += '<div class="alert-descrip">';
        html += '<audio src="../../../images/common/ALARM8.WAV" loop="loop">';
        html += '您的浏览器不支持 audio 标签。';
        html += '</audio>';
        html += '<img src="../../../images/common/icon_voice_close.png" id="audioPlayer">';
        html += '<div class="des-content">';
        html += '<ul class="alert-txt">';
        for (var i = 0; i < text_arr.length; i++) {
            if (text_arr[i]) {
                html += '<li><i class="li-str4-i"></i> ' + text_arr[i] + '</li>';
            }
        }
        html += '</ul>';
        html += '</div>';
        html += '</div>';
        obj.html(html);
        obj.find(".des-content").textScroll();
    });

}

// 报警音效控制
$(document).on('click', '#audioPlayer', function () {
    var _this = $(this);
    var warning = _this.parent('div').find('audio')[0];
    if (warning.paused) {
        // 开始播放当前点击的音频
        warning.play();
        _this.attr('src', '../../../images/common/icon_voice_open.png');
    } else {
        warning.pause();
        _this.attr('src', '../../../images/common/icon_voice_close.png');
    }
});

/**
 * @author xuelei.wang 2017-10-23
 * 字符串转日期对象
 * @param dateStr  日期时间字符串
 * @returns {Date} 日期对象
 */
function strToDate(dateStr) {
    if (dateStr == undefined) return dateStr;
    if ($.isNumeric(dateStr)) {
        return new Date(dateStr);
    }
    if (dateStr instanceof Date) return dateStr;
    if (dateStr instanceof Object) return dateStr;
    return new Date(dateStr.replace(/-/g, "/"));
}

/**
 * 校验时间控件选择时间是否合法;
 *
 * @param config
 * @returns {boolean}
 * @author xuelei.wang 2017-11-30
 */
function checkDateIsValid(config) {
    var startTime = config.startTime;
    var endTime = config.endTime;
    if (startTime == "" || endTime == "" || endTime == undefined || startTime == undefined) {
        layer.msg("开始时间和结束时间不能为空");
        return false;
    }
    var startDate = strToDate(startTime);
    var endDate = strToDate(endTime);
    var maxDate = strToDate(new Date);
    if ((maxDate - startDate) <= 0) {
        layer.msg("结束日期不能大于当前系统日期！");
        return false;
    }
    if ((maxDate - endDate) <= 0) {
        layer.msg("结束日期不能大于当前系统日期！");
        return false;
    }
    if ((endDate - startDate) < 0) {
        layer.msg("开始时间不能大于结束时间！");
        return false;
    }
    if ((endDate - startDate) > 86400000 * 365) {
        layer.msg("查询时间范围不能超过365天");
        return false;
    }

    return true;
}

//获取指定名称的cookie的值
function getcookie(objname) {
    var arrstr = document.cookie.split("; ");
    for (var i = 0; i < arrstr.length; i++) {
        var temp = arrstr[i].split("=");
        if (temp[0] == objname) return unescape(temp[1]);
    }
}

//判断是否是number
function isNumber(obj) {
    return obj === +obj
}

function timingLoad(callback) {
    setInterval(callback, 1000 * 60)
}

function dataFormat(value, rs) {
    if (value == null || value == undefined || value == '--' || value == "") {
        if (rs != undefined)
            return rs;
        else
            return '--';

    }
    if (!isNaN(value)) {

        if (typeof value != "number")
            value = parseFloat(value)
        value = value.toFixed(2)
    }
    ;

    return value;
}

//获取 用户信息
function getUser(codeYesCallback, userYesCallback) {
    $.ajax({
        url: 'http://promace.pcitc.com/web/userCode',
        type: 'get',
        success: function (resultCode) {
            codeYesCallback && codeYesCallback(resultCode);
            $.ajax({
                url: 'http://promace.pcitc.com/web/users/zhouxy210',
                type: 'get',
                success: function (resultUser) {
                    userYesCallback && userYesCallback(resultUser);
                }
            })
        },
        error: function () {
            console.log('获取用户code出错');
        }
    })
}

function mergeCells(data, fieldName, colspan, target, fieldList) {
    // 声明一个map计算相同属性值在data对象出现的次数和
    var sortMap = {};
    for (var i = 0; i < data.length; i++) {
        for (var prop in data[i]) {
            //例如people.unit.name
            var fieldArr = fieldName.split(".");
            getCount(data[i], prop, fieldArr, 0, sortMap);
        }
    }
    var index = 0;
    for (var prop in sortMap) {
        var count = sortMap[prop];
        for (var i = 0; i < fieldList.length; i++) {
            $(target).bootstrapTable('mergeCells', {
                index: index,
                field: fieldList[i],
                colspan: colspan,
                rowspan: count
            });
        }
        index += count;
    }
}

/**
 * 递归到最后一层 统计数据重复次数
 * 比如例如people.unit.name 就一直取到name
 * 类似于data["people"]["unit"]["name"]
 */
function getCount(data, prop, fieldArr, index, sortMap) {
    if (index == fieldArr.length - 1) {
        if (prop == fieldArr[index]) {
            var key = data[prop];
            if (sortMap.hasOwnProperty(key)) {
                sortMap[key] = sortMap[key] + 1;
            } else {
                sortMap[key] = 1;
            }
        }
        return;
    }
    if (prop == fieldArr[index]) {
        var sdata = data[prop];
        index = index + 1;
        getCount(sdata, fieldArr[index], fieldArr, index, sortMap);
    }

}

//去重
Array.prototype.distinct = function () {
    var arr = this,
        result = [],
        i,
        j,
        len = arr.length;
    for (i = 0; i < len; i++) {
        for (j = i + 1; j < len; j++) {
            if (arr[i] === arr[j]) {
                j = ++i;
            }
        }
        result.push(arr[i]);
    }
    return result;

}

function getAjax(url, callback) {
    $.ajax({
        url: DISC.API.URL + url,
        type: 'get',
        success: function (result, status, xhr) {

            callback && callback(result);
        },
        error: function (data) {

        }
    })

}

function checkValueType(value) {

    if (!isNaN(value) && value != null && value != "") {

        if (typeof value != "number") {
            return parseFloat(value);
        }

    } else {
        return 0;
    }
}

//平铺转树形结构
function convert(rows) {
    function exists(rows, parentOrgCode) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].orgCode == parentOrgCode) return true;
        }
        return false;
    }

    var nodes = [];
    // get the top level nodes
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!exists(rows, row.parentOrgCode)) {
            nodes.push({
                id: row.orgCode,
                text: row.orgAlias
            });
        }
    }

    var toDo = [];
    for (var i = 0; i < nodes.length; i++) {
        toDo.push(nodes[i]);
    }
    while (toDo.length) {
        var node = toDo.shift(); // the parent node
        // get the children nodes
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.parentOrgCode == node.id) {
                var child = {
                    id: row.orgCode,
                    text: row.orgAlias
                };
                if (node.nodes) {
                    node.nodes.push(child);
                } else {
                    node.nodes = [child];
                }
                toDo.push(child);
            }
        }
    }
    return nodes;
}

