var searchUrl = DISC.API.URL + '/api/bc/unitRunFlowChartConf';
var tableColums;
//window.pageLoadMode = PageLoadMode.None;
$(function() {
	var page = {
		/**
		 * 初始化
		 */
		init: function() {
			//绑定事件
			this.bindUI();
			//初始化表格
			page.logic.initTable();
			// 获取底部报警数据
			alertMessage();
		},
		/**
		 * 绑定事件
		 */
		bindUI: function() {
			// 新增
//			$('#saveAddModal').click(function() {
//				page.logic.save();
//			})

			//查询
			$('#searched').click(function() {
				page.logic.search();
			})
		},
		data: {
			// 设置查询参数
			param: {}
		},
		/**
		 * 方法
		 */
		logic: {
			/**
			 * 初始化表格
			 */
			initTable: function() {
				$("#table").bootstrapTable({
					striped: false, //是否显示行间隔色
					pagination: true, //是否显示分页（*）
					sortOrder: "asc", //排序方式
					pageNumber: 1, //初始化加载第一页，默认第一页
					pageSize: 10, //每页的记录行数（*）
					pageList: [10, 20, 24, 48], //可供选择的每页的行数（*）
					sidePagination: "client", // 表示服务端请求 后台分页 server
					//设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  
					//设置为limit可以获取limit, offset, search, sort, order  
					//queryParamsType: page.data.param,
					queryParams: page.logic.queryParams,
					contentType: 'application/x-www-form-urlencoded',
					cache: false,
					columns: [ { 
							checkbox: true,
							formatter: function() {
								return '<div class="checks"></div>'
							}
						}, {
						field: 'unitName',
						title: '名称',
						align: 'left',
						width: '100px'
					}, {
						field: 'unitCode',
						title: '编码',
						align: 'left',
						width: '100px'
					}, {
						field: 'des',
						title: '操作',
						align: 'left',
						width: '150px',
						formatter: function() {
							var rowData = arguments[1];
							return [							
								'<div class="box-edit"><a class="edit-style">编辑</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
								'<a class="edit-style" href="javascript:window.page.logic.delSingle(\'' + rowData.prdtCellId + '\')" >删除</a> </div>'
							]
						}
					}],

					formatNoMatches: function() {
						return "";
					},
					responseHandler: function(res) {
						var item = {
							"total": $.ET.toObjectArr(res).length,
							"rows": $.ET.toObjectArr(res)
						};
						console.log('列表', item);
						return item;

					},
//					onLoadSuccess: function(res) {
//						
//						
//					}
				})

			},

			/**
             * 查询参数
             * @param params
             * @returns {{pageSize: *, pageNumber: *}}
             */
            queryParams: function(p) {
                var param = {
                    pageSize: p.pageSize,
                    pageNumber: p.pageNumber,
                    sortOrder: p.sortOrder
                };
                return $.extend(page.data.param, param);
            },
			/**
			 * 搜索
			 */
			search: function() {
			page.data.param = DISC.form.getData("searchForm");
				$.ajax({
					url: searchUrl,
					type: "get",
					async: true,
					data: page.data.param,
					dataType: "json",
					success: function(result) {
						console.log('hahh',result);
						$("#table").bootstrapTable("load", $.ET.toObjectArr(result));
//						page.data.tableData = $.ET.toObjectArr(result);
						//设置鼠标浮动提示
						var tds = $('#table').find('tbody tr td');
						$.each(tds, function(i, el) {
							$(this).attr("title", $(this).text())
						});
						customScroll({
							target: $('.tab-content'),
							width: '100%',
							height: '100%',
							tableHeight: $('.tab-content').find('.bootstrap-table').height()

						});
						var tableColums = $('#table').bootstrapTable('getOptions').columns[0];
						fixdTableHeader($('.table-header'), tableColums, $('.table-content'));
					},
					error: function() {
						console.log('false');
					}
				})
			},
			/**
             * 批量删除
             */
            delAll: function () {
                var idsArray = new Array();
                var rowsArray = $("#table").bootstrapTable('getSelections');
                $.each(rowsArray, function (i, el) {
                    idsArray.push(el.prdtCellId);
                })
                if (idsArray.length == 0) {
                    layer.msg("请选择要删除的数据");
                    return;
                }
                layer.confirm('确定删除吗？', {
                    btn: ['确定', '取消']
                }, function () {
                    $.ajax({
                        url: delUrl,
                        async: false,
                        data: JSON.stringify(idsArray),
                        dataType: "text",
                        contentType: "application/json;charset=utf-8",
                        type: 'DELETE',
                        success: function (result) {
                            if (result.indexOf('collection') < 0) {
                                layer.msg("删除成功");
                                $('#table').bootstrapTable('selectPage', 1);
                            } else {
                                result = JSON.parse(result)
                                layer.msg(result.collection.error.message)
                            }
                        },
                        error: function (result) {
                            var errorResult = $.parseJSON(result.responseText);
                            layer.msg(errorResult.collection.error.message);
                        }
                    })
                }, function (index) {
                    layer.close(index)
                });
            },
            /**
             * 单条删除
             */
            delSingle: function (id) {
                var data = new Array();
                data.push(id);
                layer.confirm('确定删除吗？', {
                    btn: ['确定', '取消']
                }, function () {
                    $.ajax({
                        url: delUrl,
                        async: false,
                        data: JSON.stringify(data),
                        dataType: "text",
                        contentType: "application/json;charset=utf-8",
                        type: 'DELETE',
                        success: function (result) {
                            if (result.indexOf('collection') < 0) {
                                layer.msg("删除成功")
                                $('#table').bootstrapTable('selectPage', 1);
                            } else {
                                result = JSON.parse(result)
                                layer.msg(result.collection.error.message)
                            }
                        },
                        error: function (result) {
                            console.log(data);
                            var errorResult = $.parseJSON(result.responseText);
                            layer.msg(errorResult.collection.error.message);
                        }
                    })
                }, function (index) {
                    layer.close(index)
                });
            },
			
		}
	}
	page.init();
	window.page = page;
})