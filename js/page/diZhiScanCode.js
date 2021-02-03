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
		}
	
	}
	main.unregisterReceiver(receiver);//取消监听 
}  

var userName = "";
// 高值产品使用新增
var nums =0,arrTmp = [],arrObj = [],objData = {};


// 返回按钮
function back() {
	window.location.href="diZhi.html";
}
// 添加按钮 
function addInfo(){
	ajaxData($.trim($("#scanCode").val()))
}
var scanCodesss;
// 主码的数据请求
function ajaxData(scanCode){
	var scanCodeTmp;
	//主副码在一起  0104047075090921 1117102410194233
	if($.trim(scanCode).length >=30){
		scanCodeTmp = $.trim(scanCode).substr(0,16)
	}else{
		scanCodeTmp = $.trim(scanCode)
	}
		
	$.ajax({
        url:pathUrl()+'/spd-sys/admin/spd/spdWhSerial/queryScanCodeByCode',
        beforeSend: function(request) {
            request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
        },
        type:"post",
        data:{'scanCode':scanCodeTmp,"scanType":JSON.parse(sessionStorage.getItem('parentObj')).useType},
        dataType:'json',
        success:function(data) {
        	if(data.code == "200"){
        		if(arrTmp.indexOf(data.data.scanCode) == -1){
								var isBoolean =  false;
								for(var i =0;i<arrObj.length;i++){
								 if(data.data.msCode==arrObj[i].msCode && data.data.msKind =="试剂"){
									isBoolean = true;
									break;
								}
							}
							if(isBoolean){
								if($('#toast-container').html() == null || $('#toast-container').html() == ''){
									toastr.warning(data.data.regName+'产品已添加,请勿重复添加')
								}
								
								return;
							}
							if(data.data.produceNo == null || data.data.produceNo == ""){
								data.data.produceNo = "-";
							}
							if(data.data.registerSpecs == null || data.data.registerSpecs == ""){
								data.data.registerSpecs = "-";
							}
							
							if(data.data.specification == null || data.data.specification == ""){
								data.data.specification = "-";
							}
							if(data.data.regNo == null || data.data.regNo == ""){
								data.data.regNo = "-";
							}
							
							if(data.data.produceDate == null || data.data.produceDate == ""){
								data.data.produceDate = "-";
							}
							if(data.data.expDate == null || data.data.expDate == ""){
								data.data.expDate = "-";
							}
							arrTmp.push(data.data.scanCode);
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

							if(JSON.parse(sessionStorage.getItem('parentObj')).useType == "3"){
								for(var i=0;i<nums;i++){
									str+='<div id="items'+i+'" class="items" style="margin-top:10px;background: #ece7e7;padding: 5px 7px;">'+
											'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">贴码标签：</span>'+
										'<span style="display: inline-block;" id="scanCodeTwo'+i+'">'+arrObj[i].scanCode+'</span>'+
											'</div>'+
											'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">名称：</span>'+
										'<span style="display: inline-block;" id="msNameTwo'+i+'">'+arrObj[i].msName+'</span>'+
											'</div>'+
									'<div style="display: none;">'+
										'<span type="hidden" style="display:none">系统编号：</span>'+
										'<span type="hidden" style="display:none"  id="msCodeTwo'+i+'">'+arrObj[i].msCode+'</span>'+
									'</div>'+
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">规格(特征、参数)：</span>'+
										'<span style="display: inline-block;" id="specificationTwo'+i+'">'+arrObj[i].specification+'</span>'+
											'</div>'+
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="float: left;width: auto;">生产企业：</span>'+
										'<span style="display: inline-block;" id="manufacturerTwo'+i+'">'+arrObj[i].manufacturer+'</span>'+
									'</div>'+
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="float: left;width: auto;">供货商：</span>'+
										'<span style="display: inline-block;" id="compNameTwo'+i+'">'+arrObj[i].compName+'</span>'+
									'</div>'+
									
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">注册证编号：</span>'+
										'<span style="display: inline-block;" id="regNoTwo'+i+'">'+arrObj[i].regNo+'</span>'+
									'</div>'+
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">型号、规格：</span>'+
										'<span style="display: inline-block;" id="registerSpecsTwo'+i+'">'+arrObj[i].registerSpecs+'</span>'+
									'</div>'+
									'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">批号：</span>'+
										'<span style="display: inline-block;" id="produceNoTwo'+i+'">'+arrObj[i].produceNo+'</span>'+
									'</div>'+
									
									'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">生产日期：</span>'+
										'<span style="display: inline-block;" id="produceDateTwo'+i+'">'+arrObj[i].produceDate+'</span>'+
									'</div>'+
									'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">有效日期：</span>'+
										'<span style="display: inline-block;" id="expDateTwo'+i+'">'+arrObj[i].expDate+'</span>'+
									'</div>'+
									
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;text-align: center;">'+
										'<a href="javascript:void(0)" onClick="delPro('+i+')" style="color: #fff;background: #3471fa; display: inline-block; border: 1px solid #ccc;border-radius: 5px;line-height: 30px;text-decoration: none;text-align: center;padding: 0 10px;">移除</a>'+
									'</div>'+
								'</div>'
								}
								$("#tableCent").html(str);
							//	objData = {msg:"操作成功",code:200};
							}else{
								
								for(var i=0;i<nums;i++){
									str+='<div id="items'+i+'" class="items" style="margin-top:10px;background: #ece7e7;padding: 5px 7px;">'+
											'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">贴码标签：</span>'+
										'<span style="display: inline-block;" id="scanCodeTwo'+i+'">'+arrObj[i].scanCode+'</span>'+
											'</div>'+
											'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">名称：</span>'+
										'<span style="display: inline-block;" id="msNameTwo'+i+'">'+arrObj[i].msName+'</span>'+
											'</div>'+
									'<div style="display: none;">'+
										'<span type="hidden" style="display:none">系统编号：</span>'+
										'<span type="hidden" style="display:none"  id="msCodeTwo'+i+'">'+arrObj[i].msCode+'</span>'+
									'</div>'+
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">规格(特征、参数)：</span>'+
										'<span style="display: inline-block;" id="specificationTwo'+i+'">'+arrObj[i].specification+'</span>'+
											'</div>'+
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="float: left;width: auto;">生产企业：</span>'+
										'<span style="display: inline-block;" id="manufacturerTwo'+i+'">'+arrObj[i].manufacturer+'</span>'+
									'</div>'+
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="float: left;width: auto;">供货商：</span>'+
										'<span style="display: inline-block;" id="compNameTwo'+i+'">'+arrObj[i].compName+'</span>'+
									'</div>'+
									
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">注册证编号：</span>'+
										'<span style="display: inline-block;" id="regNoTwo'+i+'">'+arrObj[i].regNo+'</span>'+
									'</div>'+
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">型号、规格：</span>'+
										'<span style="display: inline-block;" id="registerSpecsTwo'+i+'">'+arrObj[i].registerSpecs+'</span>'+
									'</div>'+
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">批号：</span>'+
										'<span style="display: inline-block;" id="produceNoTwo'+i+'">'+arrObj[i].produceNo+'</span>'+
									'</div>'+
									
									'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">生产日期：</span>'+
										'<span style="display: inline-block;" id="produceDateTwo'+i+'">'+arrObj[i].produceDate+'</span>'+
									'</div>'+
									'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">有效日期：</span>'+
										'<span style="display: inline-block;" id="expDateTwo'+i+'">'+arrObj[i].expDate+'</span>'+
									'</div>'+
									
									'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
										'<span style="display: inline-block;width: auto;">数量：</span>'+
										'<input style="width: 50px;border-radius: 5px;border: 1px solid #95B8E7;height: 23px;padding: 0 5px;font-size: 12px;background: #fff;" id="useNumTwo'+i+'" value="'+arry[i].val+'" name="selectRadioNamePint" autocomplete="off">'+
										'<a href="javascript:void(0)" onClick="delPro('+i+')" style="color: #fff;background: #3471fa; display: inline-block; border: 1px solid #ccc;border-radius: 5px;line-height: 30px;text-decoration: none;text-align: center;padding: 0 10px;margin-left: 20px;">移除</a>'+
									'</div>'+
								'</div>'
								}
								$("#tableCent").html(str);
							/* 	for(var i=0;i<nums;i++){
									numData($("#scanCodeTwo"+i).html(),"1")
								} */
							}
							
        		}
        		$("#tableCent").show();
						$("#scanCode").val("");
        	}else if(data.code=='405'){//表示是试剂产品 且有存在和当前标签码不一致且正在使用的 需要手动结束用尽
						scanCodesss = data.msg;
						var rs = confirm("同产品标签码为"+scanCodesss+"是否用尽？")
						if(rs){
							isOver()
						}
						$("#scanCode").val("");
					}else {
						if($('#toast-container').html() == null || $('#toast-container').html() == ''){
							toastr.warning(data.msg)
						}
						$("#scanCode").val("");
        	}
        },
        error:function() {
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('失败!')
					}
        }
    });
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
			'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
			'<span style="display: inline-block;width: auto;">贴码标签：</span>'+
			'<span style="display: inline-block;" id="scanCodeTwo'+i+'">'+arrObj[i].scanCode+'</span>'+
				'</div>'+
				'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
			'<span style="display: inline-block;width: auto;">名称：</span>'+
			'<span style="display: inline-block;" id="msNameTwo'+i+'">'+arrObj[i].msName+'</span>'+
				'</div>'+
			'<div style="display: none;">'+
				'<span type="hidden" style="display:none">系统编号：</span>'+
				'<span type="hidden" style="display:none"  id="msCodeTwo'+i+'">'+arrObj[i].msCode+'</span>'+
			'</div>'+
			'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
				'<span style="display: inline-block;width: auto;">规格(特征、参数)：</span>'+
				'<span style="display: inline-block;" id="specificationTwo'+i+'">'+arrObj[i].specification+'</span>'+
					'</div>'+
			'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
				'<span style="float: left;width: auto;">生产企业：</span>'+
				'<span style="display: inline-block;" id="manufacturerTwo'+i+'">'+arrObj[i].manufacturer+'</span>'+
			'</div>'+
			'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
				'<span style="float: left;width: auto;">供货商：</span>'+
				'<span style="display: inline-block;" id="compNameTwo'+i+'">'+arrObj[i].compName+'</span>'+
			'</div>'+
			
			'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
				'<span style="display: inline-block;width: auto;">注册证编号：</span>'+
				'<span style="display: inline-block;" id="regNoTwo'+i+'">'+arrObj[i].regNo+'</span>'+
			'</div>'+
			'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
				'<span style="display: inline-block;width: auto;">型号、规格：</span>'+
				'<span style="display: inline-block;" id="registerSpecsTwo'+i+'">'+arrObj[i].registerSpecs+'</span>'+
			'</div>'+
			'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
				'<span style="display: inline-block;width: auto;">批号：</span>'+
				'<span style="display: inline-block;" id="produceNoTwo'+i+'">'+arrObj[i].produceNo+'</span>'+
			'</div>'+
			
			'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
				'<span style="display: inline-block;width: auto;">生产日期：</span>'+
				'<span style="display: inline-block;" id="produceDateTwo'+i+'">'+arrObj[i].produceDate+'</span>'+
			'</div>'+
			'<div style="display: inline-block;width: 50%;height: 0.25rem;line-height: 0.25rem;">'+
				'<span style="display: inline-block;width: auto;">有效日期：</span>'+
				'<span style="display: inline-block;" id="expDateTwo'+i+'">'+arrObj[i].expDate+'</span>'+
			'</div>'+
			
			'<div style="display: inline-block;width: 100%;height: 0.25rem;line-height: 0.25rem;">'+
				'<span style="display: inline-block;width: auto;">数量：</span>'+
				'<input style="width: 50px;border-radius: 5px;border: 1px solid #95B8E7;height: 23px;padding: 0 5px;font-size: 12px;background: #fff;"  id="useNumTwo'+i+'" value="'+arry[i].val+'" name="selectRadioNamePint" autocomplete="off">'+
				'<a href="javascript:void(0)" onClick="delPro('+i+')" style="color: #fff;background: #3471fa; display: inline-block; border: 1px solid #ccc;border-radius: 5px;line-height: 30px;text-decoration: none;text-align: center;padding: 0 10px;margin-left: 20px;">移除</a>'+
			'</div>'+
		'</div>'
	}
	$("#tableCent").html(str);
	/* for(var i=0;i<nums;i++){
		numData($("#scanCodeTwo"+i).html(),"1")
	} */
}
var arry = new Array();
$(document).on("change",'input[name="selectRadioNamePint"]',function(e){
	for(var i=0;i<arry.length;i++){
		if(arry[i].id == "#"+e.target.id){
			arry[i].val = $(this).val()
		}
	}
})
// 点击数量
/* function useNumClick(nums){
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
	 		numData($("#scanCodeTwo"+nums).html(),$(this).val())
	 	}else{
			if($('#toast-container').html() == null || $('#toast-container').html() == ''){
				toastr.warning('数量不能为空!')
			}
	 	}
	})
}

// 数量的数据请求
function numData(scanCode,n){
	$.ajax({
		url:pathUrl()+'/spd-sys/admin/spd/spdWhSerial/lowScanMedStoreNum',
		beforeSend: function(request) {
		    request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
		},
		type:"get",
		data:{"scanCode": scanCode,"deptCode":JSON.parse(sessionStorage.getItem('parentObj')).deptCode,"num":n},
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
} */
// 确定按钮
function saveCont(){
	var objTmp = JSON.parse(sessionStorage.getItem('parentObj'))
	var hospCode = objTmp.hospCode;
	var deptCode = objTmp.deptCode;
	var useType = objTmp.useType;

	// 损耗
	if(useType == "2"){
		var obj = {}, arr = [];
		
		for(var i=0;i<arrObj.length;i++){
			arr.push({
				hospCode: hospCode,
				deptCode:deptCode,
				useType:useType,
				useNum:$("#useNumTwo"+i).val(),
				scanCode: $("#scanCodeTwo"+i).html(),
				msCode: $("#msCodeTwo"+i).html(),
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
				//	objData = {code: 123,msg: "数量只能是数字"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是数字!')
					}
					return;
				}
				if(Number($.trim(arr[i].useNum)) <=0 ){
				//	objData = {code: 123,msg: "数量只能大于0"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能大于0!')
					}
					return;
				}
				if((arr[i].useNum).indexOf('.') > -1){
				//	objData = {code: 123,msg: "数量只能是整数"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是整数')
					}
					return;
				}
				if(parseInt($.trim(arr[i].useNum)) === parseFloat($.trim(arr[i].useNum))){
				}else{
				//	objData = {code: 123,msg: "数量只能是整数"}
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
		obj.inHosCode = sessionStorage.getItem("inHosCode");

		if($("#tableCent").find(".items") && $("#tableCent").find(".items").length >0){
			// 对象是否为空!isEmptyObject(objData) && 
			if ($("#tableCent").find(".items")) {	
				// 如果库存不足 或者其他问题 不能保存
				//if(objData.code == "200"){
					$.ajax({
						url: pathUrl()+"/spd-sys/admin/spd/spdWhSerial/supsUseAdd",
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
				/* }else{
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning(objData.msg)
					}
				} */
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
	}else if(useType == "3"){ 
		//试剂产品结束使用
		var obj = {}, arr = [];
		
		for(var i=0;i<arrObj.length;i++){
			arr.push({
				hospCode: hospCode,
				deptCode:deptCode,
				useType:useType,
				useNum:'',
				scanCode: $("#scanCodeTwo"+i).html(),
				msCode: $("#msCodeTwo"+i).html(),
			})
		}
		
		
		obj.useType = useType;
		obj.records = arr;
		obj.inHosCode = sessionStorage.getItem("inHosCode");
		
		if($("#tableCent").find(".items") && $("#tableCent").find(".items").length >0){
			// 对象是否为空!isEmptyObject(objData) && 
			if ($("#tableCent").find(".items")) {	
				// 如果库存不足 或者其他问题 不能保存
			//	if(objData.code == "200"){
					$.ajax({
						url: pathUrl()+"/spd-sys/admin/spd/spdWhSerial/endOfUseByScanCodeList",
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
				/* }else{
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning(objData.msg)
					}
				} */
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
		for(var i=0;i<arrObj.length;i++){
			arrParam.push({
				hospCode: hospCode,
				deptCode:deptCode,
				useType:useType,
				useNum:$("#useNumTwo"+i).val(),
				scanCode: $("#scanCodeTwo"+i).html(),
				msCode: $("#msCodeTwo"+i).html(),
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
					//objData = {code: 123,msg: "数量只能是数字"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是数字!')
					}
					return;
				}
				if(Number($.trim(arrParam[i].useNum)) <=0 ){
					//objData = {code: 123,msg: "数量只能大于0"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能大于0!')
					}
					return;
				}
				if((arrParam[i].useNum).indexOf('.') > -1){
					//objData = {code: 123,msg: "数量只能是整数"}
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是整数')
					}
					return;
				}
				if(parseInt($.trim(arrParam[i].useNum)) === parseFloat($.trim(arrParam[i].useNum))){
				}else{
				//	objData = {code: 123,msg: "数量只能是整数"}
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
				// 对象是否为空!isEmptyObject(objData) && 
				if ($("#tableCent").find(".items")) {
					// 如果库存不足 或者其他问题 不能保存
					//if(objData.code == "200"){
						$.ajax({
							url: pathUrl()+"/spd-sys/admin/spd/spdWhSerial/supsUseAdd",
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
					/* }else{
						if($('#toast-container').html() == null || $('#toast-container').html() == ''){
							toastr.warning(objData.msg)
						}
					} */
				} else{
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('数量只能是数字!请输入正确的贴码标签')
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
//试剂产品手动结束使用状态
function isOver(){
	$.ajax({
		url: pathUrl()+"/spd-sys/admin/spd/spdWhSerial/endOfUseByScanCode",
		beforeSend: function(request) {
			request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
		},
		type:"post",
		data:{'scanCode':scanCodesss},
		dataType:"json",
		success:function(data) {
			scanCodesss = ''
		},
		error:function() {
			if($('#toast-container').html() == null || $('#toast-container').html() == ''){
				toastr.warning('网络错误')
			}
		}
	});
	
}
// 清空
function clearCont(){
	arrTmp = [];
	arrObj = [];
	arry = [];
	nums =0;
	//objData = {};
	$("#tableCent").html("")
	$('#scanCode').val("")
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
})
