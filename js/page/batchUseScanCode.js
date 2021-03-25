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
		$("#inHosCode").val(m_barcode);
	
	}

	main.unregisterReceiver(receiver);//取消监听 
}  

var userName = "";
// 高值产品使用新增
var nums =0,arrTmp = [],arrObj = [];


// 返回按钮
function back() {
	window.location.href="batchUse.html";
}
// 添加按钮 
function addInfo(){
	if($.trim($("#inHosCode").val())){
		$.ajax({
			url:pathUrl()+'/spd-sys/admin/spd/spdWhSerial/patientInfo',
			beforeSend: function(request) {
				request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
			},
			type:"post",
			data:{'code':$.trim($("#inHosCode").val())},
			success:function(data) {
				if(data.code == "200"){
					if(arrTmp.indexOf(data.data.patientCardNo) == -1){
						arrTmp.push(data.data.patientCardNo);
						arrObj.push(data.data)
						nums+=1;
						if(arry.length >0){
							arry.push({
								id:"#useNumTwo"+(nums-1),
								val:'1'
							})
						}else{
							for(var i=0;i<nums;i++){
								arry.push({
									id:"#useNumTwo"+i,
									val:'1'
								})
							}
						}
						
						$("#tableCent").html('')
						var str = ""
						for(var i=0;i<nums;i++){
							str+='<div id="items'+i+'" class="items" style="margin-top:10px;background: #ece7e7;padding: 5px 7px;">'+
							'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: auto;">患者ID：</span>'+
								'<span style="display: inline-block;" id="patientIdTwo'+i+'">'+arrObj[i].patientId+'</span>'+
							'</div>'+
							'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: auto;">患者姓名：</span>'+
								'<span style="display: inline-block;" id="patientNameTwo'+i+'">'+arrObj[i].patientName+'</span>'+
							'</div>'+
							'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: auto;">住院号：</span>'+
								'<span style="display: inline-block;" id="inHosCodeTwo'+i+'">'+arrObj[i].inHosCode+'</span>'+
							'</div>'+
							'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: auto;">患者性别：</span>'+
								'<span style="display: inline-block;" id="patientSexTwo'+i+'">'+arrObj[i].patientSex+'</span>'+
							'</div>'+
							'<div style="display: none;">'+
								'<span type="hidden" style="display:none">系统编号：</span>'+
								'<span type="hidden" style="display:none"  id="msCodeTwo'+i+'">'+arrObj[i].msCode+'</span>'+
							'</div>'+
							'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="float: left;width: auto;">患者身份证号：</span>'+
								'<span style="display: inline-block;" id="patientCardNoTwo'+i+'">'+arrObj[i].patientCardNo+'</span>'+
							'</div>'+
							'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
								'<span style="display: inline-block;width: auto;">数量：</span>'+
								'<input style="width: 50px;border-radius: 5px;border: 1px solid #95B8E7;height: 23px;padding: 0 5px;font-size: 12px;background: #fff;" id="useNumTwo'+i+'" value="'+arry[i].val+'" name="selectRadioNamePint" autocomplete="off">'+
								'<a href="javascript:void(0)" onClick="delPro('+i+')" style="color: #fff;background: #3471fa; display: inline-block; border: 1px solid #ccc;border-radius: 5px;line-height: 30px;text-decoration: none;text-align: center;padding: 0 10px;margin-left: 20px;">移除</a>'+
							'</div>'+
						'</div>'
						}
						$("#tableCent").html(str);
								
					}
					$("#tableCent").show();
					$("#inHosCode").val("");
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
	}else{
		if($('#toast-container').html() == null || $('#toast-container').html() == ''){
			toastr.warning('请输入患者信息')
		}
	}
}
// 移除按钮
function delPro(idx){
	nums-=1;
	arrTmp.splice(idx,1);
	arrObj.splice(idx,1);
	arry.splice(idx,1);
	$("#tableCent").html('')
	var str = ""
	var tmpArr = []
	for(var i = 0;i<arry.length;i++){
		tmpArr.push({
			id:"#useNumTwo"+i,
			val:arry[i].val
		})
	}
	arry = tmpArr;
	
	for(var i=0;i<nums;i++){
		str+='<div id="items'+i+'" class="items" style="margin-top:10px;background: #ece7e7;padding: 5px 7px;">'+
		'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
			'<span style="display: inline-block;width: auto;">患者ID：</span>'+
			'<span style="display: inline-block;" id="patientIdTwo'+i+'">'+arrObj[i].patientId+'</span>'+
		'</div>'+
		'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
			'<span style="display: inline-block;width: auto;">患者姓名：</span>'+
			'<span style="display: inline-block;" id="patientNameTwo'+i+'">'+arrObj[i].patientName+'</span>'+
		'</div>'+
		'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
			'<span style="display: inline-block;width: auto;">住院号：</span>'+
			'<span style="display: inline-block;" id="inHosCodeTwo'+i+'">'+arrObj[i].inHosCode+'</span>'+
		'</div>'+
		'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
			'<span style="display: inline-block;width: auto;">患者性别：</span>'+
			'<span style="display: inline-block;" id="patientSexTwo'+i+'">'+arrObj[i].patientSex+'</span>'+
		'</div>'+
		'<div style="display: none;">'+
			'<span type="hidden" style="display:none">系统编号：</span>'+
			'<span type="hidden" style="display:none"  id="msCodeTwo'+i+'">'+arrObj[i].msCode+'</span>'+
		'</div>'+
		'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
			'<span style="float: left;width: auto;">患者身份证号：</span>'+
			'<span style="display: inline-block;" id="patientCardNoTwo'+i+'">'+arrObj[i].patientCardNo+'</span>'+
		'</div>'+
		'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
			'<span style="display: inline-block;width: auto;">数量：</span>'+
			'<input style="width: 50px;border-radius: 5px;border: 1px solid #95B8E7;height: 23px;padding: 0 5px;font-size: 12px;background: #fff;" id="useNumTwo'+i+'" value="'+arry[i].val+'" name="selectRadioNamePint" autocomplete="off">'+
			'<a href="javascript:void(0)" onClick="delPro('+i+')" style="color: #fff;background: #3471fa; display: inline-block; border: 1px solid #ccc;border-radius: 5px;line-height: 30px;text-decoration: none;text-align: center;padding: 0 10px;margin-left: 20px;">移除</a>'+
		'</div>'+
	'</div>'
	}

	$("#tableCent").html(str);
}
var arry = new Array();
$(document).on("change",'input[name="selectRadioNamePint"]',function(e){
	for(var i=0;i<arry.length;i++){
		if(arry[i].id == "#"+e.target.id){
			arry[i].val = $(this).val()
		}
	}
})

// 确定按钮
function saveCont(){
	var obj = {};
	var objTmp = JSON.parse(sessionStorage.getItem('parentObj'));
	obj.hospCode = objTmp.hospCode;
	obj.deptCode = objTmp.deptCode;
	obj.useType = objTmp.useType;
	obj.whCode = objTmp.whCode;
	
	obj.secondCode = objTmp.scanCode;
	// obj.scanCode = objTmp.scanCode;
	obj.msCode =  objTmp.msCode;

	// 使用
	if(obj.useType == "1"){
		var arrParam = [];
		obj.isFree = objTmp.isFree;
		for(var i=0;i<arrObj.length;i++){
			arrParam.push({
				useNum:$("#useNumTwo"+i).val(),
				inHosCode: $("#inHosCodeTwo"+i).html(),
				patientCardNo: $("#patientCardNoTwo"+i).html(),
				patientId: $("#patientIdTwo"+i).html(),
				patientSex: $("#patientSexTwo"+i).html(),
				patientName: $("#patientNameTwo"+i).html(),
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
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是数字!')
					}
					return;
				}
				if(Number($.trim(arrParam[i].useNum)) <=0 ){
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能大于0!')
					}
					return;
				}
				if((arrParam[i].useNum).indexOf('.') > -1){
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是整数')
					}
					return;
				}
				if(parseInt($.trim(arrParam[i].useNum)) === parseFloat($.trim(arrParam[i].useNum))){
				}else{
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
		
		obj.list = arrParam;
	}else{
		// 报损数量
		obj.useNum = $('#badMore').val();
		
		if(obj.useNum == ""){
			if($('#toast-container').html() == null || $('#toast-container').html() == ''){
				toastr.warning('数量不能为空')
			}
			return;
		}else{
			if(isNaN(Number($.trim(obj.useNum)))){
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('数量只能是数字!')
				}
				return;
			}
			if(Number($.trim(obj.useNum)) <=0 ){
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('数量只能大于0!')
				}
				return;
			}
			if((obj.useNum).indexOf('.') > -1){
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('数量只能是整数')
				}
				return;
			}
			if(parseInt($.trim(obj.useNum)) === parseFloat($.trim(obj.useNum))){
			}else{
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('数量只能是整数!')
				}
				return;
				
			}
			
			if(String(Number(obj.useNum)).length >= 10){
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('数量不能超过9位数')
				}
				return;
			}
		}
	}
	
	if(obj.secondCode == ''){
		if($('#toast-container').html() == null || $('#toast-container').html() == ''){
			toastr.warning('请输入贴码标签')
		}
		return;
	}else{
		// if($("#tableCent").find(".items") && $("#tableCent").find(".items").length >0){
		// 	if ($("#tableCent").find(".items")) {
				$.ajax({
					url:pathUrl()+'/spd-sys/admin/spd/spdWhSerial/supsUseToBatchUser',
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
							toastr.warning('使用成功!')
						}
					}
				});
				
		// 	} else{
		// 		if($('#toast-container').html() == null || $('#toast-container').html() == ''){
		// 			toastr.warning('请输入患者信息')
		// 		}
		// 	}
		// }else{
		// 	if($('#toast-container').html() == null || $('#toast-container').html() == ''){
		// 		toastr.warning('无数据')
		// 	}
		// }
	}
}

// 清空
function clearCont(){
	arrTmp = [];
	arrObj = [];
	arry = [];
	nums =0;
	$("#tableCent").html("")
	// $('#scanCode').val("")
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
		$("#inHosCodeBox").show();
		$("#bad").hide();
		
	}else{
		$("#inHosCodeBox").hide();
		$("#bad").show();
	}
	console.log(parentObj)
	// $('#scanCodeTwo').html(parentObj.masterCode);
	$('#secondCodeTwo').html(parentObj.scanCode);
	$('#msNameTwo').html(parentObj.msName);
	$('#specificationTwo').html(parentObj.specification);
	$('#manufacturerTwo').html(parentObj.manufacturer);
	$('#compNameTwo').html(parentObj.compName);
	$('#regNoTwo').html(parentObj.regNo);
	$('#registerSpecsTwo').html(parentObj.registerSpecs);
	$('#produceDateTwo').html(parentObj.produceDate);
	$('#expDateTwo').html(parentObj.expDate);
	$('#surplusNumTwo').html(parentObj.surplusNum);
})
