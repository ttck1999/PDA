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
		$("#inHosCode").val(m_barcode);
	
	}
	main.unregisterReceiver(receiver);//取消监听 
}  

// 返回按钮
function back() {
	window.location.href="memu.html";
}
// 查询按钮
function seatchInfo(){
	var deptListOri = JSON.parse(sessionStorage.getItem("deptListOri"));
	for(var i=0;i<deptListOri.length;i++){
		if(deptListOri[i].deptName == $("#deptPicker").html()){
			var deptCode = deptListOri[i].deptCode
		}
	}
	
	var whListOri = JSON.parse(sessionStorage.getItem("whListOri"));
	for(var i=0;i<whListOri.length;i++){
		if(whListOri[i].whName == $("#whPicker").html()){
			var whCode = whListOri[i].whCode
		}
	}
	
	if($("#userPicker").html() == "正常使用"){
		var useType = "1";
	}else if($("#userPicker").html() == "报损"){
		var useType = "2";
	}
	
	if($("#typePicker").html() == "高值"){
		var msKinds = "2";
	}else if($("#typePicker").html() == "低值"){
		var msKinds = "1";
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
					
					dataTmp.hospCode = $("#hospName").html();
					dataTmp.deptCode = deptCode;
					dataTmp.whCode = whCode;
					dataTmp.useType = useType;
					dataTmp.msKinds = msKinds;
					sessionStorage.setItem("parentObj", JSON.stringify(dataTmp)); 
					sessionStorage.setItem("inHosCode", $.trim($("#inHosCode").val())); 
					window.location.href="fastUseScanCode.html";
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
		
		dataTmp.hospCode = $("#hospName").html();
		dataTmp.deptCode = deptCode;
		dataTmp.whCode = whCode;
		dataTmp.useType = useType;
		dataTmp.msKinds = msKinds;
		sessionStorage.setItem("inHosCode", $.trim($("#inHosCode").val())); 
		sessionStorage.setItem("parentObj", JSON.stringify(dataTmp)); 
		window.location.href="fastUseScanCode.html";
	}
}

var userName = "";
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
	
	$("#inHosCode").on("click",function(){
		userName = "inHosCode";
	})
	//$("#hospName").html(sessionStorage.getItem("hospName"))
	
})


