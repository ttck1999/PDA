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
	//var ul = document.getElementById("myList");
	if(m_barcode != "") {
		$("#scanCode").val(m_barcode);
	
	}
	main.unregisterReceiver(receiver);//取消监听 
}  

// 返回按钮
function back() {
	window.location.href="memu.html";
}
// 查询按钮
function seatchInfo(){
	for(var i=0;i<deptListOri.length;i++){
		if(deptListOri[i].deptName == $("#deptPicker").html()){
			var deptCode = deptListOri[i].deptCode
		}
	}

	if($("#userPicker").html() == "正常使用"){
		var useType = "1";
	}else if($("#userPicker").html() == "报损"){
		var useType = "2";
	}else if($("#userPicker").html() == "试剂使用结束"){
		var useType = "3";
	}
	
	if($("#userPicker").html() == "正常使用"){
		if($.trim($("#inHosCode").val()) != ""){
			$.ajax({
				url:pathUrl()+'/spd-sys/admin/spd/spdWhSerial/patientInfo',
				beforeSend: function(request) {
					request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
				},
				type:"post",
				data:{'code':$.trim($("#inHosCode").val())},
				dataType:'json',
				success:function(data) {
					var dataTmp = data;
					
					dataTmp.hospCode = hospObj.hospCode;
					dataTmp.deptCode = deptCode;
					dataTmp.useType = useType;
					
					sessionStorage.setItem("parentObj", JSON.stringify(dataTmp)); 
					sessionStorage.setItem("inHosCode", $.trim($("#inHosCode").val())); 
					window.location.href="diZhiScanCode.html";
				},
				error:function() {
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('失败!')
					}
				}
			});
		}else{
			if($('#toast-container').html() == null || $('#toast-container').html() == ''){
				toastr.warning('请输入患者信息!')
			}
		}
	}else {
		var dataTmp = {};
		
		dataTmp.hospCode = hospObj.hospCode;
		dataTmp.deptCode = deptCode;
		dataTmp.useType = useType;
		sessionStorage.setItem("inHosCode", $.trim($("#inHosCode").val())); 
		sessionStorage.setItem("parentObj", JSON.stringify(dataTmp)); 
		window.location.href="diZhiScanCode.html";
	}
}

// function isInteger(obj) {
// 	 return typeof obj === 'number' && obj%1 === 0
// }
// // 确定按钮
// function seatchInfo(){
// 		for(var i=0;i<deptListOri.length;i++){
// 			if(deptListOri[i].deptName == $("#deptPicker").html()){
// 				var deptCode = deptListOri[i].deptCode
// 			}
// 		}
		
// 		if($("#userPicker").html() == "正常使用"){
// 			var useType = "1";
// 		}else if($("#userPicker").html() == "报损"){
// 			var useType = "2";
// 		}
		
// 		var hospCode = hospObj.hospCode;
// 		var useNum = $.trim($('#useNum').val());
// 		var patientInfo = $.trim($('#patientInfo').val());
// 		var scanCode = $.trim($('#scanCode').val());
		
// 		if(useNum == ""){
// 			if($('#toast-container').html() == null || $('#toast-container').html() == ''){
// 				toastr.warning('使用数量不能为空')
// 			}
// 			return;
// 		}else{
// 			if(useNum == "0"){
// 				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
// 					toastr.warning('使用数量不能为0')
// 				}
// 				return;
// 			}else{
// 				if(Number(useNum) >0){
					
// 					if(!isInteger(Number(useNum))){
// 						if($('#toast-container').html() == null || $('#toast-container').html() == ''){
// 							toastr.warning('使用数量必须是整数')
// 						}
// 						return;
// 					}
// 					if((useNum).indexOf('.') > -1){
// 						if($('#toast-container').html() == null || $('#toast-container').html() == ''){
// 							toastr.warning('数量必须是整数')
// 						}
// 						return;
// 					}
// 					if(String(Number(useNum)).length >= 10){
// 						if($('#toast-container').html() == null || $('#toast-container').html() == ''){
// 							toastr.warning('数量不能超过9位数')
// 						}
// 						return;
// 					}
// 				}else{
// 					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
// 						toastr.warning('使用数量必须是正整数')
// 					}
// 					return;
// 				}
// 			} 
// 		}
// 		var obj ={
// 			'hospCode':hospCode,
// 			'deptCode':deptCode,
// 			'useNum':useNum,
// 			'useType':useType,
// 			'patientInfo':patientInfo,
// 			'scanCode':scanCode,
// 		}
// 		$.ajax({
// 			type: "post",
// 			url: pathUrl()+"/spd-sys/admin/spd/spdWhSerial/supsUseAdd",
// 			beforeSend: function(request) {
// 			 request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
// 			},
// 			data:{
// 				'hospCode':hospCode,
// 				'deptCode':deptCode,
// 				'useNum':useNum,
// 				'useType':useType,
// 				'patientInfo':patientInfo,
// 				'scanCode':scanCode,
// 			},
// 			/* dataType: "json",
// 			contentType:"application/json; charset=utf-8", */
// 			success: function(data){
// 				if(data.code=='200'){
// 					$('#useNum').val("");
// 					$('#patientInfo').val("");
// 					$('#scanCode').val("");
// 					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
// 						toastr.info(data.msg)
// 					}
// 				}else{
// 					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
// 						toastr.warning(data.msg)
// 					}
// 				}
// 			},
// 			error:function() {
// 				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
// 					toastr.warning('网络错误')
// 				}
// 			}
// 		})
		
// }
var hospList= [],hospObj ={};
$(function(){
  //医院
	$.ajax({
		type: "post",
		url: pathUrl()+"/spd-sys/admin/spd/spdWhSerial/allHospInfo",
		beforeSend: function(request) {
		 request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
		},
		dataType: "json",
		contentType:"application/json",
		success: function(data){
			hospObj = data[0];
			$("#hospName").html(data[0].hospName)
		}
	})
	
	//标签码
	// $('#scanCode').change(function(){
	// 	$.ajax({
	// 		url:pathUrl()+'/spd-sys/admin/spd/spdWhSerial/queryScanCodeByCode',
	// 		type:"post",
	// 		data:{'scanCode':$.trim($('#scanCode').val())},
	// 		dataType:"json",
	// 		success:function(data) {
	// 			if(data.code=='405'){//表示是试剂产品 且有存在和当前标签码不一致且正在使用的 需要手动结束用尽
	// 				scanCodesss = data.msg;
	// 				var rs = confirm("同产品标签码为"+scanCodesss+"是否用尽？")
	// 				if(rs){
	// 					isOver()
	// 				}
	// 			}else if(data.code!='200'){
	// 				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
	// 					toastr.warning(data.msg)
	// 				}
	// 				$('#scanCode').val("")	
	// 			}
	// 			},
	// 			error:function() {
	// 				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
	// 					toastr.warning('网络错误')
	// 				}
	// 			}
	// 	});
	// })
})

$(function(){
	toastr.options = {
		"closeButton": false, //是否显示关闭按钮
		"debug": false, //是否使用debug模式
		"positionClass": "toast-center-center",//弹出窗的位置
		"showDuration": "300",//显示的动画时间
		"hideDuration": "1000",//消失的动画时间
		"timeOut": "1000", //展现时间
		"extendedTimeOut": "1000",//加长展示时间
		"showEasing": "swing",//显示时的动画缓冲方式
		"hideEasing": "linear",//消失时的动画缓冲方式
		"showMethod": "fadeIn",//显示时的动画方式
		"hideMethod": "fadeOut" //消失时的动画方式
	};
})