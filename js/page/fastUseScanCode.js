//所有plus api都应该在此事件发生后调用，否则会出现plus is undefined
document.addEventListener("plusready", plusReady, false)

 function plusReady() {        
	var main = plus.android.runtimeMainActivity(); //获取activity  
	var context = plus.android.importClass('android.content.Context'); //上下文  
    var  receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {  
		onReceive: getReceive //实现onReceiver回调函数  
	});  
	var IntentFilter = plus.android.importClass('android.content.IntentFilter');
	var filter = new IntentFilter();
	filter.addAction("com.barcode.sendBroadcast"); //广播名
	main.registerReceiver(receiver, filter); //注册广播
}  
function getReceive (context, intent) {  
	//实现onReceiver回调函数
	plus.android.importClass(intent); 
	var m_barcode = intent.getStringExtra("BARCODE");//数据标识

	if(m_barcode != "") {
		if(userName == "scanCode"){
			$("#scanCode").val(m_barcode);
		}else if(userName == "secondCode"){
			$("#secondCode").val(m_barcode);
		}
	
	}
	main.unregisterReceiver(receiver);//取消监听 
}  

var userName = "";
// 高值产品使用新增
var nums =0,arrTmp = [],arrObj = [],objData = {};


// 返回按钮
function back() {
	window.location.href="fastUse.html";
}
// 添加按钮 
function addInfo(){
	ajaxData($.trim($("#scanCode").val()),$.trim($("#secondCode").val()))
}
// 主码的数据请求
function ajaxData(scanCode,secondCode){
	var scanCodeTmp;
	//主副码在一起  0104047075090921 1117102410194233
	if($.trim(scanCode).length >=30){
		scanCodeTmp = $.trim(scanCode).substr(0,16)
	}else{
		scanCodeTmp = $.trim(scanCode)
	}

	$.ajax({
        url:pathUrl()+'/spd-sys/admin/spd/spdWhSerial/fastScanMedInfo',
        beforeSend: function(request) {
            request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
        },
        type:"post",
        data:{"msKinds":JSON.parse(sessionStorage.getItem('parentObj')).msKinds,'scanCode':scanCodeTmp,"secondCode":$.trim(secondCode),"deptCode":JSON.parse(sessionStorage.getItem('parentObj')).deptCode,"whCode":JSON.parse(sessionStorage.getItem('parentObj')).whCode},
        dataType:'json',
        success:function(data) {
        	if(data.code == "200"){
        		if(arrTmp.indexOf(data.data[0].masterCode+"-"+data.data[0].secondCode) == -1){
        			arrTmp.push(data.data[0].masterCode+"-"+data.data[0].secondCode);
        			arrObj.push(data.data[0])
        			nums+=1;
							
							if(data.data[0].produceNo == null || data.data[0].produceNo == ""){
								data.data[0].produceNo = "-";
							}
							if(data.data[0].registerSpecs == null || data.data[0].registerSpecs == ""){
								data.data[0].registerSpecs = "-";
							}
							
							if(data.data[0].specification == null || data.data[0].specification == ""){
								data.data[0].specification = "-";
							}
							if(data.data[0].regNo == null || data.data[0].regNo == ""){
								data.data[0].regNo = "-";
							}
							
							if(data.data[0].produceDate == null || data.data[0].produceDate == ""){
								data.data[0].produceDate = "-";
							}
							if(data.data[0].expDate == null || data.data[0].expDate == ""){
								data.data[0].expDate = "-";
							}
					
        			var targetObj = $('<div class="items" style="margin-top:10px;background: #ccc;padding: 5px 7px;">'+
        					'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: 75px;">主条形码：</span>'+
								'<span style="display: inline-block;" id="scanCodeTwo'+nums+'">'+data.data[0].masterCode+'</span>'+
        					'</div>'+
        					'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: 75px;">副条形码：</span>'+
								'<span style="display: inline-block;" id="secondCodeTwo'+nums+'">'+$.trim(secondCode)+'</span>'+
        					'</div>'+
        					'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: 75px;">名称：</span>'+
								'<span style="display: inline-block;" id="msNameTwo'+nums+'">'+data.data[0].msName+'</span>'+
        					'</div>'+
							/* '<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: 75px;">别名：</span>'+
								'<span style="display: inline-block;" id="msDisNameTwo'+nums+'">'+data.data[0].msDisName+'</span>'+
							'</div>'+ */
							'<div style="display: none;">'+
								'<span type="hidden" style="display:none">系统编号：</span>'+
								'<span type="hidden" style="display:none"  id="msCodeTwo'+nums+'">'+data.data[0].msCode+'</span>'+
							'</div>'+
        			'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: 105px;">规格(特征、参数)：</span>'+
								'<span style="display: inline-block;" id="specificationTwo'+nums+'">'+data.data[0].specification+'</span>'+
        					'</div>'+
							'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="float: left;width: 75px;">生产企业：</span>'+
								'<span style="display: inline-block;" id="manufacturerTwo'+nums+'">'+data.data[0].manufacturer+'</span>'+
							'</div>'+
							'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="float: left;width: 75px;">供货商：</span>'+
								'<span style="display: inline-block;" id="compNameTwo'+nums+'">'+data.data[0].compName+'</span>'+
							'</div>'+
							
							'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: 75px;">注册证编号：</span>'+
								'<span style="display: inline-block;" id="regNoTwo'+nums+'">'+data.data[0].regNo+'</span>'+
							'</div>'+
							'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: 75px;">型号、规格：</span>'+
								'<span style="display: inline-block;" id="registerSpecsTwo'+nums+'">'+data.data[0].registerSpecs+'</span>'+
							'</div>'+
							
        					/* '<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: 60px;">单价：</span>'+
								'<span style="display: inline-block;" id="costPriceTwo'+nums+'">'+data.data[0].costPrice+'</span>'+
        					'</div>'+ */
        			'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: 60px;">批号：</span>'+
								'<span style="display: inline-block;" id="produceNoTwo'+nums+'">'+data.data[0].produceNo+'</span>'+
        			'</div>'+
							
        			'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: 60px;">生产日期：</span>'+
								'<span style="display: inline-block;" id="produceDateTwo'+nums+'">'+data.data[0].produceDate+'</span>'+
							'</div>'+
							'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: 60px;">有效日期：</span>'+
								'<span style="display: inline-block;" id="expDateTwo'+nums+'">'+data.data[0].expDate+'</span>'+
							'</div>'+
							
							'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: 75px;">数量：</span>'+
								'<input value="1" style="width: 50%;border-radius: 5px;border: 1px solid #95B8E7;height: 23px;padding: 0 5px;font-size: 12px;background: #fff;" onclick="useNumClick('+nums+')" id="useNumTwo'+nums+'">'+
        			'</div>'+
        			'</div>').appendTo("#tableCent");
					
        			numData($("#scanCodeTwo"+nums).html(),$("#secondCodeTwo"+nums).html(),"1")
        			
        		}
        		$("#tableCent").show();
						$("#scanCode").val("");
						$("#secondCode").val("")
        	} else {
				
						if($('#toast-container').html() == null || $('#toast-container').html() == ''){
							toastr.warning(data.msg)
						}
        	}
        },
        error:function() {
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('失败!')
					}
        }
    });
}

// 点击数量
function useNumClick(nums){
	// change事件请求多次的问题 先off change 再on change
	// 数量够不够
	$("#useNumTwo"+nums).off("change").on("change",function(){
	 	// 在切换 使用和损耗的时候  不请求
	 	if($.trim($(this).val()) != "" && $.trim($(this).val()) != "0"){
			if(isNaN(Number($.trim($(this).val())))){
				objData = {code: 123,msg: "数量只能是数字"}
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('数量只能是数字!')
				}
				return;
			}
			if(Number($.trim($(this).val())) <=0 ){
				objData = {code: 123,msg: "数量只能大于0"}
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('数量只能大于0!')
				}
				return;
			}
			if($.trim($(this).val()).indexOf('.') > -1){
				objData = {code: 123,msg: "数量只能是整数"}
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('数量只能是整数')
				}
				return;
			}
			if(parseInt($.trim($(this).val())) === parseFloat($.trim($(this).val()))){
			}else{
				objData = {code: 123,msg: "数量只能是整数"}
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('数量只能是整数!')
				}
				return;
				
			}
			if(String(Number($.trim($(this).val()))).length >= 10){
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('数量不能超过9位数')
				}
				return;
			}			
	 		numData($("#scanCodeTwo"+nums).html(),$("#secondCodeTwo"+nums).html(),$(this).val())
	 	}else{
			if($('#toast-container').html() == null || $('#toast-container').html() == ''){
				toastr.warning('数量不能为空!')
			}
	 	}
	})
}

// 数量的数据请求
function numData(scanCode,secondCode,n){
	$.ajax({
		url:pathUrl()+'/spd-sys/admin/spd/spdWhSerial/fastScanMedStoreNum',
		beforeSend: function(request) {
		    request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
		},
		type:"get",
		data:{"msKinds":JSON.parse(sessionStorage.getItem('parentObj')).msKinds,"scanCode": scanCode,"secondCode":secondCode,"deptCode":JSON.parse(sessionStorage.getItem('parentObj')).deptCode,"num":n,"whCode":JSON.parse(sessionStorage.getItem('parentObj')).whCode},
		dataType:"json",
		success:function(data) {
			objData = data;

			if(data.code!='200'){
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning(data.msg)
				}
				return;
			}
		},
		error:function() {
			if($('#toast-container').html() == null || $('#toast-container').html() == ''){
				toastr.warning('失败!')
			}
		}
	});
}
// 确定按钮
function saveCont(){
	var objTmp = JSON.parse(sessionStorage.getItem('parentObj'))
	var deptCode = objTmp.deptCode;
	var useType = objTmp.useType;
	var whCode = objTmp.whCode;
  var mskind = objTmp.msKinds;

	// 损耗
	if(useType == "2"){
		var obj = {}, arr = [];
		
		for(var i=0;i<arrObj.length;i++){
			arr.push({
				deptCode:deptCode,
				useType:useType,
				whCode:whCode,
				useNum:$("#useNumTwo"+(i+1)).val(),
				scanCode: $("#scanCodeTwo"+(i+1)).html(),
				secondCode: $("#secondCodeTwo"+(i+1)).html(),
				msCode: $("#msCodeTwo"+(i+1)).html(),
			})
		}

		for(var i=0;i<arr.length;i++){
			if(arr[i].useNum == ""){
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('数量不能为空')
				}
				return;
			}else{
				if(isNaN(Number($.trim(arr[i].useNum)))){
					objData = {code: 123,msg: "数量只能是数字"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是数字!')
					}
					return;
				}
				if(Number($.trim(arr[i].useNum)) <=0 ){
					objData = {code: 123,msg: "数量只能大于0"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能大于0!')
					}
					return;
				}
				if((arr[i].useNum).indexOf('.') > -1){
					objData = {code: 123,msg: "数量只能是整数"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是整数')
					}
					return;
				}
				if(parseInt($.trim(arr[i].useNum)) === parseFloat($.trim(arr[i].useNum))){
				}else{
					objData = {code: 123,msg: "数量只能是整数"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是整数!')
					}
					return;
					
				}
				
				if(String(Number(arr[i].useNum)).length >= 10){
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量不能超过9位数')
					}
					return;
				}
			}
		}
		obj.useType = useType;
		obj.records = arr;
		obj.mskind = mskind;
		obj.inHosCode = sessionStorage.getItem("inHosCode");

		if($("#tableCent").find(".items") && $("#tableCent").find(".items").length >0){
			// 对象是否为空
			if (!isEmptyObject(objData) && $("#tableCent").find(".items")) {	
				// 如果库存不足 或者其他问题 不能保存
				if(objData.code == "200"){
					$.ajax({
						url:pathUrl()+'/spd-sys/admin/spd/spdWhSerial/insertFastUse',
						beforeSend: function(request) {
							request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
						},
						type:"post",
						data:JSON.stringify(obj),
						dataType:"json",
						contentType:"application/json; charset=utf-8",
						success:function(data) {
							if(data.code !='200'){
								if($('#toast-container').html() == null || $('#toast-container').html() == ''){
									toastr.warning(data.msg)
								}
								return;
							}else{
								if($('#toast-container').html() == null || $('#toast-container').html() == ''){
									toastr.warning('使用成功!')
								}
								window.location.href="memu.html";
							}
						},
						error:function() {
							if($('#toast-container').html() == null || $('#toast-container').html() == ''){
								toastr.warning('网络错误!')
							}
						}
					});
				}else{
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning(objData.msg)
					}
				}
			}else{
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning("请输入")
				}
			}
		}else{
			if($('#toast-container').html() == null || $('#toast-container').html() == ''){
				toastr.warning('无数据')
			}
		}
	}else{
		// 使用
		var obj = {},arrParam = [];
		obj.patientId = $('#patientId').html();
		obj.patientName = $('#patientName').html();
		obj.patientCardNo = $('#patientCardNo').html();
		obj.patientSex = $('#patientSex').html();
		obj.useType = useType;
		obj.mskind = mskind;
		for(var i=0;i<arrObj.length;i++){
			arrParam.push({
				deptCode:deptCode,
				useType:useType,
				whCode:whCode,
				useNum:$("#useNumTwo"+(i+1)).val(),
				scanCode: $("#scanCodeTwo"+(i+1)).html(),
				secondCode: $("#secondCodeTwo"+(i+1)).html(),
				msCode: $("#msCodeTwo"+(i+1)).html(),
			})
		}

		for(var i=0;i<arrParam.length;i++){
			if(arrParam[i].useNum == ""){
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('数量不能为空')
				}
				return;
			}else{
				if(isNaN(Number($.trim(arrParam[i].useNum)))){
					objData = {code: 123,msg: "数量只能是数字"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是数字!')
					}
					return;
				}
				if(Number($.trim(arrParam[i].useNum)) <=0 ){
					objData = {code: 123,msg: "数量只能大于0"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能大于0!')
					}
					return;
				}
				if((arrParam[i].useNum).indexOf('.') > -1){
					objData = {code: 123,msg: "数量只能是整数"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是整数')
					}
					return;
				}
				if(parseInt($.trim(arrParam[i].useNum)) === parseFloat($.trim(arrParam[i].useNum))){
				}else{
					objData = {code: 123,msg: "数量只能是整数"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是整数!')
					}
					return;
					
				}
				
				if(String(Number(arrParam[i].useNum)).length >= 10){
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量不能超过9位数')
					}
					return;
				}
			}
		}
		
		obj.records = arrParam;
		obj.inHosCode = sessionStorage.getItem("inHosCode");

		if(obj.inHosCode == ''){
			if($('#toast-container').html() == null || $('#toast-container').html() == ''){
				toastr.warning('请输入患者信息')
			}
			return;
		}else{
			if($("#tableCent").find(".items") && $("#tableCent").find(".items").length >0){
				// 对象是否为空
				if (!isEmptyObject(objData) && $("#tableCent").find(".items")) {
					// 如果库存不足 或者其他问题 不能保存
					if(objData.code == "200"){
						$.ajax({
							url:pathUrl()+'/spd-sys/admin/spd/spdWhSerial/insertFastUse',
							beforeSend: function(request) {
								request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
							},
							type:"post",
							data:JSON.stringify(obj),
							dataType:"json",
							contentType:"application/json; charset=utf-8",
							success:function(data) {
								if(data.code !='200'){
									if($('#toast-container').html() == null || $('#toast-container').html() == ''){
										toastr.warning(data.msg)
									}
									return;
								}else{
									if($('#toast-container').html() == null || $('#toast-container').html() == ''){
										toastr.info('使用成功!')
									}
									window.location.href="memu.html";
								}
							},
							error:function() {
								if($('#toast-container').html() == null || $('#toast-container').html() == ''){
									toastr.warning('网络错误')
								}
							}
						});
					}else{
						if($('#toast-container').html() == null || $('#toast-container').html() == ''){
							toastr.warning(objData.msg)
						}
					}
				} else{
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是数字!请输入正确的主条形码和副条形码')
					}
				}
			}else{
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('无数据')
				}
			}
		}
	}
}
// 判断对象是否为空
function isEmptyObject(obj) {
	 for (var key in obj) {
	  return false;
	 }
	 return true;
}
// 清空
function clearCont(){
	arrTmp = [];
	arrObj = [];
	nums =0;
	objData = {};
	$("#tableCent").html("")
	$('#scanCode').val("")
	$('#secondCode').val("")
}
$(function(){
	toastr.options = {
		"closeButton": false, //是否显示关闭按钮
		"debug": false, //是否使用debug模式
		"positionClass": "toast-center-center",//弹出窗的位置
		"showDuration": "300",//显示的动画时间
		"hideDuration": "300",//消失的动画时间
		"timeOut": "3000", //展现时间
		//"extendedTimeOut": "1000",//加长展示时间
		"showEasing": "swing",//显示时的动画缓冲方式
		"hideEasing": "linear",//消失时的动画缓冲方式
		"showMethod": "fadeIn",//显示时的动画方式
		"hideMethod": "fadeOut" //消失时的动画方式
	};
	
	var parentObj = JSON.parse(sessionStorage.getItem('parentObj'))

	if(parentObj.useType =="1"){
		$("#aaaaa").show()
		$('#patientId').html(parentObj.data.patientId);
		$('#patientName').html(parentObj.data.patientName);
		$('#patientSex').html(parentObj.data.patientSex);
		$('#patientCardNo').html(parentObj.data.patientCardNo);
		
	}else{
		$("#aaaaa").hide()
	}
	
	$("#scanCode").on("click",function(){
		userName = "scanCode";
	}) 
	$("#secondCode").on("click",function(){
		userName = "secondCode";
	}) 
})
