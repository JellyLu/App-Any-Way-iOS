/**
 * ios 交互
 */


/**
 * 替换
 * @param s1
 * @param s2
 * @return
 */
String.prototype.replaceAll=function (s1,s2){
    return this.split(s1).join(s2);
}

function invokeMethod( param ) {
	if( param.methodName == 'exitSoft' ){
        return;
    }
	
    var inv ="invoke://?";

    var content = JSON.stringify(param);
    content = content.replaceAll("#","@%%%()&^%&&");
     if(param) inv += encodeURI(content);

    location.href=inv;
}
