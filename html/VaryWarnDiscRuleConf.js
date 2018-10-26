var staffLevel, staffCode, warnAlarmMessConfId;
window.pageLoadMode = PageLoadMode.None;
var businessType, deviceUnit,deviceUnitup;
$(function() {
	var page = {
		//初始化参数
		data: {
			//进度步骤key
			stepKey: 2,
			//完成步骤
			finishStepKey: 3, //--
			//顶部表格数据
			topTableData: [],
			firstTableData: [],
			secondTableData: [],
			thirdTableData: [],
			fourTableData: [],
			// 第二步 临时删除数据
			secondDeleteData: [],
			// 第三步 临时删除数据
			thirdDeleteData: []
		},
		/**
		 * 初始化
		 */
		init: function(data) {
			//todo根据业务类型判断上下限单位
			businessType = data.businessType;
			if(businessType == "Unit_Tem_Warn" || businessType == "Tank_Tem_Warn") {
				deviceUnit = '下限(℃)';
                deviceUnitup = '上限(℃)';
			} else if(businessType == "Unit_Pressure_Warn" || businessType == "Tank_Pressure_Warn") {
				deviceUnit = '下限(Pa)';
                deviceUnitup = '上限(Pa)';
			}else if(businessType == "Unit_Flow_Warn") {
				deviceUnit = '下限(Q)';
                deviceUnitup = '上限(Q)';
			} else if(businessType == "Unit_Liquid_Level_Warn") {
				deviceUnit = '下限(m)';
                deviceUnitup = '上限(m)';
			} else if(businessType == "Unit_Elec_Warn") {
				deviceUnit = '下限(A)';
                deviceUnitup = '上限(A)';
			}  else{
				deviceUnit = '下限(%)';
                deviceUnitup = '上限(%)';
			}
			page.logic.iframeParam(data);
			page.logic.initDom(page.data.stepKey);
			page.logic.topTable(page.data.topTableData);
			this.bindUi();
		},
		/**
		 * 绑定事件
		 */
		bindUi: function() {
			$('.steps_dl').on('click', function() { //--
				var index = $(this).data("code"); //--
				var finishStepKey = page.data.finishStepKey; //--
				var stepKey = page.data.stepKey; //--
				if(finishStepKey + 1 >= index) {
					page.data.stepKey = index; //--
					page.logic.initDom(index, true); //--
					page.logic.steps(finishStepKey + 1, index) //--
				}
				console.log("按钮", page.data.stepKey, finishStepKey)
			}); //--
			
			// 新增
			$('.bottom_table_config_box .add_btn').click(function() {
				var stepKey = page.data.stepKey;
				switch(stepKey) {
					case 2:
						secondAdd();
						break;
					case 3:
						page.logic.thirdAdd();
						break;
                    case 5:
                        fifthAdd();
                        break;
				}
			});
			$('body').on('click', '.number_box .add', function() {
				var $this = $(this);
				var input = $this.siblings('input');
				var value = parseInt(input.val()) || 0;
				var inputValue = parseInt(value) + 1;
				input.val(inputValue);
				var name = input.data('name');
				var index = input.data('index');
				console.log(name, index, inputValue);
				page.logic.handleFun(name, index, inputValue);
			});
			$('body').on('click', '.number_box .reduce', function() {
				var $this = $(this);
				var input = $this.siblings('input');
				var value = parseInt(input.val()) || 0;
				var inputValue = parseInt(value) - 1;
				input.val(inputValue);
				var name = input.data('name');
				var index = input.data('index');
				console.log(name, index, inputValue);
				page.logic.handleFun(name, index, inputValue);
			});
			$('#saveBtn').on('click', function() {
				var stepKey = page.data.stepKey;
				var finishStepKey = page.data.finishStepKey; //--
				var allTableData;
				switch(stepKey) {
					case 1: //第一步保存
					case 6 :
						allTableData = $('#first_table').bootstrapTable('getData');;
						var data = JSON.stringify($.ET.toCollectionJson(page.data.firstTableData));
						console.log('allTableData', data);
						var url = DISC.API.URL + '/api/pac/warnAlarmIntelliSenseModelConf/varyWarnDiscRuleConf';
						  getUserCode(function (userCode) {

                              $.ajax({
                                  url: url+"?userCode="+userCode,
                                  type: 'PUT',
                                  dataType: 'text',
                                  contentType: "application/json;charset=utf-8",
                                  data: data,
                                  success: function(data) {
                                      if(data.indexOf('collection') < 0) {
                                          layer.msg("保存成功");
                                          if(finishStepKey < stepKey) //--
										page.logic.initDom(stepKey + 1); //--
                                      } else {
                                          var message = $.parseJSON(data).collection.error.message;
                                          layer.msg(message);
                                      }
                                      console.log('接口成功', data);
                                  },
                                  error: function(data) {
                                      console.log('接口失败');
                                  }
                              });
                          })
						break;
					case 2:
						// 第二步保存
                        if(!secondDeleteData.length){
                           if(finishStepKey < stepKey) //--
								page.logic.initDom(stepKey + 1); //--
							    layer.msg('保存成功'); //--
							return false;
                        }
						var deleteParam = (secondDeleteData).toString();
						console.log('delete', deleteParam);
						var url = DISC.API.URL + '/api/pac/warnAlarmIntelliSenseModelConf/'+ page.data.topTableData[0].entBendConfPage +'?ids=' + deleteParam;
						  getUserCode(function (userCode) {

                              $.ajax({
                                  url: url+"&userCode="+userCode,
                                  async: false,
                                  dataType: "text",
                                  contentType: "application/json;charset=utf-8",
                                  type: 'DELETE',
                                  success: function(result) {
                                      if(result.indexOf('collection') < 0) {
                                          layer.msg('保存成功')
                                          if(finishStepKey < stepKey) //--
										page.logic.initDom(stepKey + 1); //--
                                          secondDeleteData = [];
                                      } else {
                                          result = JSON.parse(result)
                                          layer.msg(result.collection.error.message)
                                      }
                                  },
                                  error: function(result) {
                                      console.log('失败', result);
                                      var errorResult = $.parseJSON(result.responseText);
                                      layer.msg(errorResult.collection.error.message);
                                  }
                              });
                          })
						break;
					case 3:
						// 第三步保存
                        if(!page.data.thirdDeleteData.length){
                            if(finishStepKey < stepKey) //--
								page.logic.initDom(stepKey + 1); //--
								layer.msg('保存成功'); //--
							return false;
                        }
						var deleteParam = (page.data.thirdDeleteData).toString();
						console.log('delete', deleteParam);
						var url = DISC.API.URL + '/api/pac/warnAlarmIntelliSenseModelConf/discRuleAndStaffRels/discRuleAndStaffRels/' + deleteParam;
						  getUserCode(function (userCode) {

                              $.ajax({
                                  url: url+"?userCode="+userCode,
                                  async: false,
                                  dataType: "text",
                                  contentType: "application/json;charset=utf-8",
                                  type: 'DELETE',
                                  success: function(result) {
                                      if(result.indexOf('collection') < 0) {
                                          layer.msg('保存成功')
                                          if(finishStepKey < stepKey) //--
										page.logic.initDom(stepKey + 1); //--
                                          page.data.thirdDeleteData = [];
                                      } else {
                                          result = JSON.parse(result)
                                          layer.msg(result.collection.error.message)
                                      }
                                  },
                                  error: function(result) {
                                      console.log('失败', result);
                                      var errorResult = $.parseJSON(result.responseText);
                                      layer.msg(errorResult.collection.error.message);
                                  }
                              });
                          })
						break;
					case 4:
						// 第四步保存      
						allTableData = $('#four_form').bootstrapTable('getData');
						var fourTableData = page.data.fourTableData;
						fourTableData[0]['restrainDuration'] = $('input[type=number]').val() + $('input[name=grade]').data('message');
						var data = JSON.stringify($.ET.toCollectionJson(fourTableData));
						var url = DISC.API.URL + '/api/pac/warnAlarmIntelliSenseModelConf/preAlarmOpeConf/preAlarmOpeConfs';
						  getUserCode(function (userCode) {

                              $.ajax({
                                  url: url+"?userCode="+userCode,
                                  type: 'PUT',
                                  dataType: 'text',
                                  contentType: "application/json;charset=utf-8",
                                  data: data,
                                  success: function(data) {
                                      if(data.indexOf('collection') < 0) {
                                          layer.msg("保存成功");
                                          if(finishStepKey < stepKey) //--
										page.logic.initDom(stepKey + 1); //--
                                      } else {
                                          var message = $.parseJSON(data).collection.error.message;
                                          layer.msg(message);
                                      }
                                      console.log('接口成功', data);
                                  },
                                  error: function(data) {
                                      console.log('接口失败');
                                  }
                              });
                          })
						break;
                    case 5 :
                        //第五步保存
                        if(!fifthDeleteData.length){
                            if(finishStepKey < stepKey) //--
								page.logic.initDom(stepKey + 1); //--
                            parent.layer.msg('设置完成');
                            setTimeout(function(){
                                page.logic.close();
                            },500);
                            return false;
                        }
                        var deleteParam = (fifthDeleteData).toString();
                        console.log('delete', deleteParam);
                        var url = DISC.API.URL + '/api/pac/warnAlarmIntelliSenseModelConf/handleSchemeConf/discRuleHandleSchemeConfs/'+deleteParam;
                          getUserCode(function (userCode) {

                              $.ajax({
                                  url: url+"?userCode="+userCode,
                                  async: false,
                                  dataType: "text",
                                  contentType: "application/json;charset=utf-8",
                                  type: 'DELETE',
                                  success: function(result) {
                                      if(result.indexOf('collection') < 0) {
                                          layer.msg('保存成功');
                                          fifthDeleteData = [];
                                          if(finishStepKey < stepKey) //--
										page.logic.initDom(stepKey + 1); //--
                                          parent.layer.msg('设置完成');
                                          setTimeout(function(){
                                              page.logic.close();
                                          },500);
                                      } else {
                                          result = JSON.parse(result)
                                          layer.msg(result.collection.error.message)
                                      }
                                  },
                                  error: function(result) {
                                      console.log('失败', result);
                                      var errorResult = $.parseJSON(result.responseText);
                                      layer.msg(errorResult.collection.error.message);
                                  }
                              });
                          })
                        break;
				}
			});
			$('#backBtn').on('click', function() { //返回上一步
				var stepKey = page.data.stepKey;
				page.logic.initDom(stepKey - 1);
			});
			$('body').on('input propertychange', 'input[type="number"]', function() {
				var $this = $(this);
				var name = $this.data('name');
				var index = $this.data('index');
				var inputValue;//创建变量
				//校验保留两位小数或者3位小数，其他输入框不能输入小数点
				var downtest = $("input[data-index=" + index + "].downtest").data("name");
				var uptest = $("input[data-index=" + index + "].uptest").data("name");
				if(isNaN($this.val())) {
					inputValue = 0;
				}else{
					if(name== downtest || name== uptest){
					     inputValue=$this.val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
					}else{
					    inputValue = parseInt($this.val());//其他的转换成整数不带小数点
					}
				}
				$this.val(inputValue);
				page.logic.handleFun(name, index, inputValue);
			});
			$('body').on('change', 'input[type="checkbox"]', function() {
				var $this = $(this);
				var name = $this.data('name');
				var index = $this.data('index');
				var type = $this.prop('checked');
				var checked2name = $("input[data-index=" + index + "].checbox2").data("name");
				var checked1name = $("input[data-index=" + index + "].checbox1").data("name");
				if(type) {
					type = 1;
					if(name == checked1name){
						$("input[data-index=" + index + "].checbox2").prop('checked',
						$("input[data-index=" + index + "].checbox1").prop('checked') || true);
						page.logic.handleFun(checked2name, index, type);
					}
				} else {
					type = 0;
					if(name == checked2name){
						$("input[data-index=" + index + "].checbox1").prop('checked', false);
						page.logic.handleFun(checked1name, index, type);
					}
				}
				page.logic.handleFun(name, index, type);
			});
			$('#pageCancelBtn').on('click', function() {
                page.logic.close();
			});
			$('#bottom_table_search_btn').on('click', function() {
				var value = $(this).parent().find('.search-input').val();
				var allData;
				var filterData;
				var stepKey = page.data.stepKey;
				switch(stepKey) {
					case 3:
						allData = page.data.thirdTableData;
						filterData = allData.filter(function(option) {
							return(option.staffName.indexOf(value) >= 0) || (option.staffLevel.indexOf(value) >= 0);
						});
						$('#third_table').bootstrapTable('load', filterData)
						break;
				}
			});
			$('body').on('click', '.table_third_del_btn', function() {
				var id = $(this).data('id');
				layer.confirm('确定删除吗？', {
					btn: ['确定', '取消']
				}, function() {
					var deleteData = page.data.thirdDeleteData;
					deleteData.push(id);
					page.data.thirdDeleteData = deleteData;
					console.log('delete', deleteData);
					var thirdTableData = page.data.thirdTableData;
					var resultTableData = thirdTableData.filter(function(option) {
						return option.relId != id;
					});
					console.log('resultTableData', resultTableData);
					page.data.thirdTableData = resultTableData;
					$("#third_table").bootstrapTable('load', resultTableData);
					layer.msg('删除成功');
				}, function(index) {
					layer.close(index);
				});
			});
		},

		/**
		 * 定义业务逻辑方法
		 */
		logic: {
			/**
			 * 新增
			 */
			thirdAdd: function() {
				var pageMode = PageModelEnum.NewAdd;
				var title = "新增推送流程";
				page.logic.thirdDetail(title, page.data.id, pageMode, staffLevel, staffCode);
			},
			/**
			 * 第三步装置新增或者编辑详细页面
			 */
			thirdDetail: function(title, warnAlarmMessConfId, pageMode, staffLevel, staffCode) {
				layer.open({
					type: 2,
					title: title,
					closeBtn: 1,
					area: ['99%', '95%'],
					shadeClose: false,
					content: 'AddOrEditPushFlow.html',
					success: function(layero, index) {
						var body = layer.getChildFrame('body', index);
						var iframeWin = window[layero.find('iframe')[0]['name']];
						var data = {
							"pageMode": pageMode,
							"warnAlarmMessConfId": warnAlarmMessConfId,
							'title': title,
							"staffCode": staffCode,
							'staffLevel': staffLevel
						};
						iframeWin.page.logic.setDataInit(data);
					},
					end: function() {
                        var stepKey = page.data.stepKey; //--
						var finishStepKey = page.data.finishStepKey; //--
						if(finishStepKey <= stepKey) { //--
							page.logic.initDom(stepKey); //--
						} else { //--
							page.logic.initDom(stepKey, true); //--
							page.logic.steps(finishStepKey, stepKey) //--
						} //--
					}
				})
			},
			iframeParam: function(data) {
				page.data.topTableData[0] = data;
				page.data.id = data.warnAlarmMessConfId;
				page.data.stepKey = data.currentSetStatus; //--
				page.data.finishStepKey = data.currentSetStatus - 1; //--
				if(data.currentSetStatus < 6) {
					page.data.stepKey = data.currentSetStatus + 1; //--
					page.data.finishStepKey = data.currentSetStatus; //--
				}
			},
			initDom: function(key,flag) { //初始化页面dom
				var stepKey = page.data.stepKey;
				var finishStepKey = page.data.finishStepKey; //--
				var url = DISC.API.URL + '/api/pac/warnAlarmIntelliSenseModelConf/warnAlarmMessConfByCurrentSetStatus';
				var submitData = [{
					'warnAlarmMessConfId' : page.data.id,
					'currentSetStatus' : (key - 1)
				}];
				var  data = JSON.stringify($.ET.toCollectionJson(submitData));
                 getUserCode(function (userCode) {

                     $.ajax({
                         url :url+"?userCode="+userCode,
                         type : 'PUT',
                         dataType : 'text',
                         contentType: "application/json;charset=utf-8",
                         data : data,
                         success:function(data){
                             if(data.indexOf('collection') < 0){
                                 if(flag == null) { //--
								page.logic.steps(key); //--
								page.data.stepKey = key; //--
								page.data.finishStepKey = page.data.stepKey - 1; //--
								console.log("initDom2", stepKey, finishStepKey)
							} //--
                                 $('.bottom_table_box form').html('');
                                 $('.bottom_table_config_box input.search-input').val('');
                                 var bottom_table_config_box = $('.bottom_table_config_box');
                                 var search_box = bottom_table_config_box.find('.search_box');
                                 var add_btn = bottom_table_config_box.find('.add_btn');
                                 if((key == 1) || (key == 6)) {                                $('#first_form').append('<table class="first_table" id="first_table"></table>');
                                     search_box.hide();
                                     add_btn.hide();
                                     page.logic.firstTableData();
                                     $('#saveBtn').text('保存并下一步');
                                 }
                                 if(key == 2) {
                                     $('#second_form').append('<table class="second_table" id="second_table"></table>');
                                     search_box.hide();
                                     add_btn.show();
                                     secondFun(page.data.topTableData[0]);
                                     $('#saveBtn').text('保存并下一步');
                                 }
                                 if(key == 3) {
                                     $('#third_form').append('<table class="third_table" id="third_table"></table>');
                                     search_box.hide();
                                     add_btn.show();
                                     page.logic.thirdTableData();
                                     $('#saveBtn').text('保存并下一步');
                                 }
                                 if(key == 4) {
                                     $('#four_form').append('<table class="four_table" id="four_table"></table>');
                                     search_box.hide();
                                     add_btn.hide();
                                     page.logic.fourTableData();
                                     $('#saveBtn').text('保存并下一步');
                                 }
                                 if(key == 5) {
                                     $('#fifth_form').append('<table class="fifth_table" id="fifth_table"></table>');
                                     search_box.hide();
                                     add_btn.show();
                                     fifthFun(page.data.topTableData[0]);
                                     $('#saveBtn').text('保存并完成');
                                 }
                                 if(finishStepKey == 5 || finishStepKey >= stepKey) { //--
								$('#saveBtn').text('保存'); //--
							} //--
							if(finishStepKey == 5 && stepKey == 6) { //--
								page.logic.steps(6, true); //--
								page.data.stepKey = 1; //--
							} //--
                                 if((key == 1) || (key == 6) ) {
                                     $('#backBtn').hide();
                                 } else {
                                     $('#backBtn').show();
                                 }
                             }else{
                                 var message = $.parseJSON(data).collection.error.message;
                                 layer.msg(message);
                             }
                             console.log('接口成功',data);
                         },
                         error:function(data){
                             console.log('接口失败');
                         }
                   });
                 })
			},
			topTable: function(data) {
				$('#top_table').bootstrapTable({
					data: data,
					columns: [{
						field: 'ruleName',
						title: '规则名称',
						align: 'center',
						width: '90px'
					}, {
						field: 'warnAlarmTypeName',
						title: '事件类型',
						align: 'center',
						width: '90px'
					}, {
						field: 'businessTypeName',
						title: '业务类型',
						align: 'center',
						width: '110px'

					}, {
						field: 'warnAlgorithmTypeName',
						title: '预警算法类型',
						align: 'center',
						width: '150px'
					}, {
						field: 'scanningFrequency',
						title: '扫描频率（分钟/次）',
						align: 'center',
						width: '90px'
					}, {
						field: 'mesPushType',
						title: '信息推送方式',
						align: 'center',
						width: '150px'
					}],
					responseHandler: function(res) {
						return res;
					}
				});
			},
			steps: function(index, index2) {//wp
				$('.steps_dl').each(function() {
					var $this = $(this);
					var key = $this.index() + 1;
					if(key == index) {
						$this.removeClass().addClass('steps_dl steps_dl_current');
					} else if(key < index) {
						$this.removeClass().addClass('steps_dl steps_dl_over');
					} else {
						$this.removeClass().addClass('steps_dl');
					}
					if(key == index2) {//wp
						$this.removeClass().addClass('steps_dl steps_dl_over1');//wp
					}//wp
					if(key == index2 && key == index) {//wp
						$this.removeClass().addClass('steps_dl steps_dl_current');//wp
					}//wp

				});
			},
			firstTableData: function() {
				var url = DISC.API.URL + '/api/pac/warnAlarmIntelliSenseModelConf/varyWarnDiscRuleConf?id=' + page.data.id;
				var url_j = '../../../js/PAC/warnAlarmIntelliSenseModelConf/firstTable.json';
				ajaxGet(url, function(data) {
					for(var i = 0; i < data.length; i++) {
						data[i].warnAlarmMessConfId = page.data.id;
					}
					page.data.firstTableData = data;
					console.log('配置信息数据', data);
					page.logic.firstTable(data);
					var fieldList=["alarmSignal","sampleWindowTime","prepositionCondition"];
                    mergeCells(data, "alarmSignal", 1, $('#first_table'),fieldList);
				});
			},
			firstTable: function(data) {
				$('#first_table').bootstrapTable({
					data: data,
					columns: [
						[{
							title: '是否启用',
							width: '72px',
							colspan: 1
						}, {
							title: ' 预警信号',
							align: 'center',
							width: '73px',
							colspan: 1
						}, {
							title: '样本窗口期（分钟）',
							align: 'center',
							width: '110px',
							colspan: 1
						}, {
							title: '前置条件',
							align: 'center',
							width: '160px',
							colspan: 1
						}, {
							title: '事件等级',
							align: 'center',
							width: '124px',
							colspan: 1
						}, {
							title: deviceUnit,
							align: 'center',
							width: '100px',
							colspan: 1
						}, {
							title: deviceUnitup,
							align: 'center',
							width: '100px',
							colspan: 1
						}, {
							title: '事件级别/限定推送时间(分钟)',
							align: 'center',
							colspan: 3
						}, {
							title: '同一等级事件未消除时再次推送时间(分钟/次)',
							align: 'center',
							width: '160px',
							colspan: 1
						}],
						[{
							field: 'inUse',
							align: 'center',
							formatter: function(value, row, index) {
								var checked = '';
								if(value == 1) {
									checked = 'checked';
								}
								return '<input type="checkbox" ' + checked + ' data-index="' + index + '" data-name="inUse" />'
							}
						}, {
							field: 'alarmSignal',
							align: 'center'
						}, {
							field: 'sampleWindowTime',
							align: 'center',
							formatter: function(value, row, index) {
								var html = '';
								html += '<div class="number_box"><input type="number" value=' + value + ' data-index="' + index + '" data-name="sampleWindowTime" /><p class="add"><span></span></p><p class="reduce"><span></span></p></div>';
								return html;
							}
						}, {
							field: 'prepositionCondition',
							align: 'center'
						}, {
							field: 'warnAlarmGrade',
							align: 'left',
							formatter: function(value, row, index) {
								var name, text;
								switch(index) {
									case 0:
										name = 'event_grade_h';
										break;
									case 1:
										name = 'event_grade_hh';
										break;
									case 2:
										name = 'event_grade_sh';
										break;
									case 3:
										name = 'event_grade_h';
										break;
									case 4:
										name = 'event_grade_hh';
										break;
									case 5:
										name = 'event_grade_sh';
										break;
								}
								return '<span class="event_grade ' + name + '">' + row.warnAlarmGradeShowName + '</span>';
							}
						}, {
                            field: 'downLimit',
                            align: 'center',
                            formatter: function(value, row, index) {
                                var symbol = '≥';
                                switch (index){
                                    case 0 :
                                        symbol = '>';
                                        break;
                                }
                                var html = '';
                                html += '<span>'+ symbol +' </span>';
                                html += '<div class="number_box"><input type="number" class="downtest" value=' + value + ' data-index="' + index + '" data-name="downLimit" /><p class="add"><span></span></p><p class="reduce"><span></span></p></div>';
                                return html;
                            }
                        }, {
                            field: 'upLimit',
                            align: 'center',
                            formatter: function(value, row, index) {
                                var html = '';
                                html += '<span>< </span>';
                                html += '<div class="number_box"><input type="number" class="uptest" value=' + value + ' data-index="' + index + '" data-name="upLimit" /><p class="add"><span></span></p><p class="reduce"><span></span></p></div>';
                                if(index == 1) {
                                    html = '';
                                }
                                return html;
                            }
                        }, {
							field: 'companyLimitPushTime',
							align: 'center',
							formatter: function(value, row, index) {
								var checked = '';
								if(row.inUseCompany == 1) {
									checked = 'checked';
								}
								var html = '';
								html += '<label><input type="checkbox" class="checbox1" ' + value + ' data-index="' + index + '" data-name="inUseCompany"/> ' + row.companyLimitName + '</label> ';
								html += '<div class="number_box"><input type="number" value=' + value + '  data-index="' + index + '" data-name="companyLimitPushTime" /><p class="add"><span></span></p><p class="reduce"><span></span></p></div>';
								return html;
							}
						}, {
							field: 'factoryLimitPushTime',
							align: 'center',
							formatter: function(value, row, index) {
								var checked = '';
								if(row.inUseFactory == 1) {
									checked = 'checked';
								}
								var html = '';
								html += '<label><input type="checkbox" ' + checked + ' class="checbox2" data-index="' + index + '" data-name="inUseFactory" /> ' + row.factoryLimitName + '</label> ';
								html += '<div class="number_box"><input type="number" value=' + value + '  data-index="' + index + '" data-name="factoryLimitPushTime" /><p class="add"><span></span></p><p class="reduce"><span></span></p></div>';
								return html;
							}
						}, {
							field: 'departmentName',
							align: 'center',
							formatter: function(value, row, index) {
								var html = '';
								html += '<label style="color:#595959;"><input type="checkbox" checked  disabled /> ' + value + '</label> ';
								return html;
							}
						}, {
							field: 'againPushIntervalTime',
							align: 'right',
							formatter: function(value, row, index) {
								var html = '';
								html += '<div class="number_box"><input type="number" value=' + value + '  data-index="' + index + '" data-name="againPushIntervalTime" /><p class="add"><span></span></p><p class="reduce"><span></span></p></div>';
								if(index == 0 || index == 1) {
									return html;
								} else {
									return '';
								}
							}
						}]
					],
					responseHandler: function(res) {
						return res;
					}
				});
			},
			handleFun: function(name, index, value) {
				if(!isNaN(value)) {
					var stepKey = page.data.stepKey;
					switch(stepKey) {
						case 1:
                        case 6 :
							var data = page.data.firstTableData;
							data[index][name] = value;
							if((index == 2) && (name == 'downLimit')) {
								data[index]['upLimit'] = value;
							}
							if((index == 5) && (name == 'downLimit')) {
								data[index]['upLimit'] = value;
							}
							page.data.firstTableData = data;
							break;
						case 4:
							var data = page.data.fourTableData;
							data[index][name] = value;
							page.data.fourTableData = data;
					}
				} else {
					layer.msg('请输入正确的数据格式');
				}

			},
			thirdTableData: function() {
				var url = DISC.API.URL + '/api/pac/warnAlarmIntelliSenseModelConf/discRuleAndStaffRels/discRuleAndStaffRels?warnAlarmMessConfId=' + page.data.id + '&keyword=';
				ajaxGet(url, function(data) {
					console.log('表格三数据', data);
                    var thirdDeleteData = page.data.thirdDeleteData;
                    var filterData = data.filter(function(option){
                        var type = true;
                        for( var i = 0;i < thirdDeleteData.length; i++){
                            if( thirdDeleteData[i] == option.relId){
                                type = false;
                                break;
                            }
                        }
                        return type;
                    });
                    page.logic.thirdTable(filterData);
                    page.data.thirdTableData = filterData;
				});
			},
			thirdTable: function(data) {
				$('#third_table').bootstrapTable({
					data: data,
					pagination: true,
					pageNumber: 1,
					pageSize: 5,
					pageList: [],
					sidePagination: "client",
					columns: [{
						field: 'staffName',
						title: '姓名',
						align: 'center'
					}, {
                        field: 'staffLevel',
                        title: '级别',
                        align: 'center'
                    },{
                        field: 'org',
                        title: '所属单位',
                        align: 'center'
                    }, {
						field: 'relId',
						title: '操作',
						align: 'center',
						width: '100px',
						formatter: function(value, row, index) {
							staffLevel = row.staffLevel;
							staffCode = row.staffCode;
							return '<span class="table_del_btn table_third_del_btn" data-id=' + value + '></span>';
						}
					}],
					responseHandler: function(res) {
						return res;
					}
				});
			},
			fourTableData: function() {
				var url = DISC.API.URL + '/api/pac/warnAlarmIntelliSenseModelConf/preAlarmOpeConf/preAlarmOpeConfs?warnAlarmMessConfId=' + page.data.id;
				ajaxGet(url, function(data) {
					for(var i = 0; i < data.length; i++) {
						data[i].warnAlarmMessConfId = page.data.id;
					}
					console.log('表格四数据', data);
					page.data.fourTableData = data;
					page.logic.preAlarmOpeConfUnit();

					page.logic.fourTable(data);

				});
			},
			fourTable: function(data) {
				$('#four_table').bootstrapTable({
					data: data,
					columns: [
						[{
							title: '是否开启操作',
							width: '120px',
							colspan: 1
						}, {
							title: '操作',
							align: 'center',
							width: '110px',
							colspan: 1
						}, {
							title: '说明',
							align: 'center',
							colspan: 2
						}],
						[{
							field: 'inUse',
							align: 'center',
							formatter: function(value, row, index) {
								if(row.operation == '处置') {
									inUseList = row.inUse;
									var checked = '';
									if(value == 1) {
										checked = 'checked';
									}
									return '<input data-id="row." type="checkbox" ' + checked + ' data-index="' + index + '" data-name="inUse" disabled/>'
								} else {
									inUseList = row.inUse;
									var checked = '';
									if(value == 1) {
										checked = 'checked';
									}
									return '<input data-id="row." type="checkbox" ' + checked + ' data-index="' + index + '" data-name="inUse"  />'

								}
							}
						}, {
							field: 'operation',
							align: 'center',
						}, {
							field: 'instruction',
							align: 'center',
						}, {
							field: 'restrainDuration',
							align: 'center',
							formatter: function(value, row, index) {
								if(row.operation == '抑制') {
									var restrainDuration = row.restrainDuration;
									var grade = restrainDuration.charAt(restrainDuration.length - 1);
									var num = 0;
									if(restrainDuration != '') num = restrainDuration.split(grade)[0];
									var value;
									if(grade == 'h') value = '小时';
									else if(grade == 'd') value = '天';
									else if(grade == 'm') value = '分钟'
									var html = '';
									html += '<div class="number_box"><input type="number"  value=' + num + '  data-index="' + index + '" data-name="restrainDuration" /><p class="add upT"><span></span></p><p class="reduce downT"><span></span></p></div>';
									html += '<div class="input-box input-select con_select_classfiy" style="display:inline-block;height:0px;vertical-align:top">' +
										'<span class="select-list option-img" style="margin-left:56px;margin-top:0px;height:27px;"></span>' +
										'<input type="text" class="select-list" style="width:48px;height:27px;margin-top:0px;border-right:0px;margin-left:8px" autocomplete="off" data-message="' + grade + '" id="grade" name="grade" value="' + value + '" readonly />' +
										'<div class="option-box gradeBox">' +
										'</div>' +
										'</div>'
									return html;
								} else {
									return '';
								}

							}
						}]
					],
					responseHandler: function(res) {
						return res;
					},
					onLoadSuccess: function() {

					}
				});
			},

			preAlarmOpeConfUnit: function() {
				var preAlarmOpeConfUnitUrl = DISC.API.URL + "/api/pac/warnAlarmIntelliSenseModelConf/preAlarmOpeConf/preAlarmOpeConfUnit"
				ajaxGet(preAlarmOpeConfUnitUrl, function(data) {
					console.log('meiju', data)
					var exp = "";
					for(var i = 0; i < data.length; i++) {
						exp += '<div class="option-list" data-key="' +
							data[i].key +
							'"  data-message="' +
							data[i].message +
							'">' +
							data[i].value +
							'</div>'
					}
					$('.gradeBox').html(exp);
				});
			},
            close:function(){
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.layer.close(index);
            }
		}
	};
	// page.init();
	window.page = page;
});