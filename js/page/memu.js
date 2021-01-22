// 返回按钮
function back() {
	window.location.href="../index.html";
}

$(function(){
	$.ajax({
	  type: "post",
	  url: pathUrl()+"/spd-sys/admin/spd/common/getUserPermissions",
	  beforeSend: function(request) {
	   request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
	  },
	  data: JSON.stringify("1"),
	  dataType: "json",
	  contentType:"application/json",
	  success: function(data){
	   if(data.userType=="1"){
			 //表示是医院权限
	    document.getElementById("pulsometera").style.display = "none";
			document.getElementById("diZhi").style.display = "none";
			document.getElementById("fastUse").style.display = "none";
	    document.getElementById("oneShou").style.display = "block";
	   }else if(data.userType=="0"){
			 //表示是科室权限
	    document.getElementById("oneShou").style.display = "none"; 
	    document.getElementById("pulsometera").style.display = "block";  
			document.getElementById("diZhi").style.display = "block"; 
			document.getElementById("fastUse").style.display = "block";
	   }
	  }
	})
})