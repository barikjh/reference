(function(){
'use strict';
var loggerModule = angular.module('logger', []);
var logsTobePushed=[];
	if (!window.CVS || !window.CVS.Config ||!window.CVS.Config.serviceHost) {
		window.CVS = {
			Config:{
				serviceHost:{
					stp:"https://stpfast.cvsspecialty.com/api/", /*Please don't make any changes to this*/
					dev1:"https://dev1fast.cvsspecialty.com/api/",
					dev2:"https://dev2fast.cvsspecialty.com/api/",
					dev3:"https://dev3fast.cvsspecialty.com/api/",
					sit1:"https://sit1specialtyservices.caremark.com/",
					sit2:"https://sit2fast.cvsspecialty.com/api/",
					sit3:"https://sit3fast.cvsspecialty.com/api/",
					prod:"https://fast.cvsspecialty.com/api/",
					local:"http://localhost:4501/"
				},
				services:{
					LOG_SERVICE:{URL:"specialty/writeLog", serviceName:"writeLog"}
				}
			}
		}
	}
//var baseUrl = CVS.Config.serviceHost[cvsUtility.queryMap.env]+CVS.Config.services.LOG_SERVICE.URL;
var baseUrl=CVS.Config.serviceHost[cvsUtility.queryMap.env]+CVS.Config.services.LOG_SERVICE.URL+"?"+
"serviceName=writeLog&appName=SPL_WEB&lineOfBusiness=Specialty&serviceCors=True&version=1.0&channelName="+cvsUtility.queryMap.channel+
"&apiKey="+cvsUtility.queryMap.apikey+"&source=SPL_WEB&deviceType=DESKTOP&configEnv="+cvsUtility.queryMap.env;
loggerModule.value('ServiceUrl',baseUrl); // provide service url
loggerModule.value('moduleName',cvsUtility.componentName());
loggerModule.service("remoteLogger",['ServiceUrl','loggerServiceHelper',function(ServiceUrl,loggerServiceHelper){
	return{
		pushToServer: function(data,logLevel){
			$.ajax({
					type: "POST",
					url: ServiceUrl,
					contentType: "application/xml",
					header:{
						'Access-Control-Allow-Origin': '*'
					},
					data: loggerServiceHelper.logRequestBody(data,logLevel)
				});
		}
	};
}]);



/**
 * Exception Logging Service, currently only used by the $exceptionHandler
 * it preserves the default behaviour ( logging to the console) but
 * also posts the error server side after generating a stacktrace.
 */
loggerModule.factory("remoteExceptionLoggingService",["$log","$window", "remoteLogger",
                                                       function($log, $window, remoteLogger){
	function error(exception, cause){

		// preserve the default behaviour which will log the error
		// to the console, and allow the application to continue running.
		$log.error.apply($log, arguments);

		// now try to log the error to the server side.
		if(CVS.Config.loglevel.error && (CVS.Config.loglevel.error != "false")){
			try{
				var errorMessage = exception.toString();
				// use our traceService to generate a stack trace
				var stackTrace = exception.stack;

				var errorData= "URL:"+$window.location.href+" -- MESSAGE:"+errorMessage+"  --TYPE:exception  -- TRACE:"+stackTrace+"  --CAUSE:"+( cause || "");
				var args = [];
				args.unshift(errorData+" ]] ");
				args.unshift("ERROR");
				args.unshift(' [[' + new Date());
				var log=[args.join()];
				remoteLogger.pushToServer(log,'error');
			} catch (loggingError){
				$log.warn("Error server-side logging failed");
				remoteLogger.pushToServer(loggerServiceHelper.createLogObject("ERROR",loggingError),'error');
				$log.log(loggingError);
			}
		}

	}
	return(error);
}]);

/**
 * Override Angular's built in exception handler, and tell it to
 * use our new exceptionLoggingService which is defined below
 */
loggerModule.provider("$exceptionHandler",{
	$get: function(remoteExceptionLoggingService){
		return(remoteExceptionLoggingService);
	}
});



loggerModule.factory('loggerService', function ($log, $rootScope,remoteLogger,loggerServiceHelper) {
	'use strict';
	  return function (prefix,module) {
	    return {
	      info: extracted('info'),
	      log:  extracted('log'),
	      warn: extracted('warn'),
	      error:extracted('error'),
	      fatal:extracted('fatal'),
		  debug:extracted('debug'),
		  entry:extracted('entry'),
		  exit:extracted('exit')
	    };
	    function extracted(prop) {
	        return function () {
				var args = [].slice.call(arguments);
			if (prefix && CVS.Config.loglevel[prop] && (CVS.Config.loglevel[prop] !== "false")) {
             try{

				 if(args[0].contains(CVSLOGHELPER.STEP.END)){
					 args.unshift(prefix+loggerServiceHelper.addCommonParameters());
					 args.unshift('ts='+ new Date());
					 logsTobePushed.push(loggerServiceHelper.createLogObject(prop.toUpperCase(),args.join()));
					 remoteLogger.pushToServer(logsTobePushed,prop);
					 logsTobePushed=[];
				 }else if(CVS.Config.loglevel[prop]){
					 args.unshift(prefix+loggerServiceHelper.addCommonParameters());
					 args.unshift('ts=' + new Date());
					 logsTobePushed.push(loggerServiceHelper.createLogObject(prop.toUpperCase(),args.join()));
					}
				 //$log[prop].apply($log, args);
		        }catch(e){}

          		}


	        };
	    }
	  };
	});


loggerModule.service('loggerServiceHelper',function () {
	'use strict';
	var logHelper={
			logRequestBody:function(data,logLevel) {
				var writeLogDetails= {
				 "log":data
				 };
				var x2js = new X2JS();
				return x2js.json2xml_str({"writeLogDetails":writeLogDetails});
				//return cvsUtility.JSONToXml({"writeLogDetails":writeLogDetails});
		},
		createLogObject:function(type,jsonObject){
			return "CVSEVENT="+type+" {"+jsonObject+"}"
		},
		formatInKeyValue:function(key,value){
			return ""+key+"="+value+","
		},
		setCategory:function(cat){
			return " cat="+cat+", ";
		},
		setAction:function(action){
			return "action="+action+",  ";
		},
		setStep:function(step){
			return "step="+step+",  ";
		},
		getChannelPlatform:function(){
			return "chPlat="+navigator.platform+",  ";
		},
		setTransactionId:function(transId){
			return "transId="+transId+",  ";
		},
		setUID:function(uid){
			return "uid="+uid+",  ";
		},
		setStatus:function(status){
			return "status="+status+",  ";
		},
		setStatusCode:function(statusCode){
			return "statusCde="+statusCode+",  ";
		},
		setDescription:function(description){
			return "desc="+description;
		},
		setServiceName:function(serviceName){
			return "serviceName="+serviceName+",  ";
		},
		setOperationName:function(operationName){
			return "operationName+"+operationName+",  ";
		},
		getComponentName:function(){
			return "componentName="+CVSLOGHELPER.COMPONENT_NAME[componentName()]+",  ";
		},
		getSource:function(source){
			return "src=FAST-UI, ";
		},
		setGrid:function(grid){
			return "grid="+grid+",  ";
		},
		setRespTime:function(responseTime){
			return "responseTime="+responseTime+",  ";
		},
		setFlow:function(flow){
			return "flow="+flow+",  ";
		},
		setLabel:function(label){
			return "label="+label+",  ";
		},
		setValue:function(value){
			return "value="+value+",  ";
		},
		setPageName:function(pageName){
			return "page="+pageName+", ";
		},
		getSessionId:function(){
			return "sessId="+cvsUtility.queryMap.tokenId+",  ";
		},
		setFlowType:function(flowType){
			return "flowType="+flowType+",  ";
		},
		getUserAgent:function(){
			return "ua="+JSON.stringify(getBrowserDetails())+", ";
		},
		getMode:function(){
			if(cvsUtility.queryMap.tokenId){
				return "mode=REGISTERED, ";
			}else{
				return "mode=GUEST, "
			}
		},
		getLineofBussiness:function(){
			return "lineofBussiness=Specialty"
		},
		getChannel:function(){
			return "chan="+cvsUtility.queryMap.channel+", "
		},

		addCommonParameters:function(){
			var commonParameter=" "+logHelper.getComponentName()+logHelper.getChannelPlatform()+logHelper.getSource()+logHelper.getSessionId()+logHelper.getUserAgent()+" custom=FASTLogging, "+logHelper.getChannel()+logHelper.getMode()+logHelper.getLineofBussiness();
			return commonParameter;
		}
	};
	return logHelper;
});
})();
