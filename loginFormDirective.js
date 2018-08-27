(function () {
  'use strict';

  angular
    .module('cvsApp')
    .directive('loginForm', loginFormDirective);

  /** @ngInject */
  function loginFormDirective() {

    var directive = {
      restrict: 'E',
      templateUrl: '../authentication/app/components/loginForm/loginForm.template.html',
      controller: ['$scope', '$uibModal', '$timeout', 'formErrorsService', '$sce', '$filter', '$cookies', '$cookieStore', '$window', '$location', 'loggerService', 'loggerServiceHelper', 'cvsAppData', '$anchorScroll', 'authenticateService', 'decryptUtilityService', 'webTrendsService', '$state' , loginFormController],
      controllerAs: 'loginForm',
      bindToController: true
    };

    return directive;

    function loginFormController($scope, $uibModal, $timeout, formErrorsService, $sce, $filter, $cookies, $cookieStore, $window, $location, loggerService, loggerServiceHelper, CAD, $anchorScroll, AUTHS, DUS, WTS, $state) {
     // $cookies.remove('DO_REMEMBER_ME');
      // if ($cookies.get('DO_REMEMBER_ME')) {
      //   // createChannelUrl('login');
      //   $window.location.href = createChannelUrl('login');
      // }
        var log = loggerService(loggerServiceHelper.setCategory(CVSLOGHELPER.CATEGORY.Authentication));
        var loginAttempts = 0,
        loginAttemptCap = 2;
        var d = new Date();
        CAD.setSessionStartTimestamp(d);
        CAD.setIpAddress("10.121.136.154");
        CAD.setApiKey(cvsUtility.queryMap.apikey);
        $scope.formErrors = [];
        $cookies.remove('portalSession', {'path': '/', 'secure': true});
        $cookies.remove('secureChatAttrs', {'path': '/', 'secure': true});
        $cookies.remove('userAttrs', {'path': '/', 'secure': true});
        $cookies.remove('userLogAttrs', {'path': '/', 'secure': true});
        $scope.generateTarget = function(){

        var targetURL = CAD.checkIfTLPLogin()? "/wps/myportal/quickregistration?" : "/wps/myportal/specialty/patients/myprescriptions/dashboard?";

        if(CAD.checkIfTLPLogin()){
            var queryObj = CAD.getTlpUrlInfo();
          switch(queryObj.REDIRECTTO){
              case "qr_tap":
                  targetURL += "qrComp=TAP&redirectTo=qr_tap&accessKey="+queryObj.accessKey+"&source="+queryObj.source;
                  break;
              case "qr":
                  targetURL += "qrComp=QR&redirectTo=qr&accessKey="+queryObj.accessKey+"&source="+queryObj.source;
                  break;
              case "qr_rfr":
                  targetURL += "qrComp=RFR&redirectTo=qr_rfr&accessKey="+queryObj.accessKey+"&source="+queryObj.source;
                  break;
              case "qr_op":
                  targetURL += "qrComp=OP&redirectTo=qr_op&accessKey="+queryObj.accessKey+"&source="+queryObj.source;
                  break;
              case "securechat"://TODO
                  targetURL += "qrComp=TAP&redirectTo=qr_tap&accessKey="+queryObj.accessKey+"&source="+queryObj.source;
                  break;
          }

        }
        else{
//Check once with Portal. Applies to secure chat
            var queryObj = CAD.getLoginUrlInfo();
            targetURL += queryObj.hasOwnProperty('REDIRECTTO') ? ("&redirectTo="+queryObj.REDIRECTTO) : "";
            targetURL += queryObj.hasOwnProperty('messageID') ? ("&messageID="+queryObj.messageID) : "";
        }
        return targetURL;
      };
      /** ITPR020511- Specialty End to End Optimization - 01/17/2018
					 sets the sitmeminder object
			**/
      $scope.siteminder = {
        siteminderLoginURL: $sce.trustAsResourceUrl(createChannelUrl('siteMinderURL')),
        email: '',
        password: '',
        rememberMe: false,
        redirectURL: $scope.generateTarget(),
        smagentname: cvsUtility.queryMap["smagentname"]
      };
        /** ITPR020511- Specialty End to End Optimization - 01/17/2018
         Navigates to Forgot Password Page
         **/
      $scope.navPassword = function () {
        $window.top.location = createChannelUrl('forgotPassword');
      }

      $scope.submitForm = function (form) {
          if (log && log.info) {
              log.info(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.FORM_SUBMIT) +
                  loggerServiceHelper.setStep(CVSLOGHELPER.STEP.START) + loggerServiceHelper.setDescription("Login form submit"));
          }
        $scope.$parent.loginInvalidcredentials = false;
          $scope.$parent.isLocked = false;

        $scope.errorList = formErrorsService.getMatchingErrors(form.$error);
        $scope.isLocked = false;
        $scope.loginInvalidcredentials = false;
        if (form.$valid) {
          //form.submit()
          // SPEC-618 add timinigs to logs for login portal and fast login flow through dashboard
          var loginClickTime = (new Date()).getTime();
          // Setting a cookie
          var currentDate = new Date();
          var expireDate = new Date();
          expireDate.setMinutes(expireDate.getMinutes() + 5);
          $cookies.put('loginClickTime', loginClickTime, { 'path': '/', 'expires': expireDate });
          if(!$scope.loginForm.rememberMe.$modelValue){
            $cookies.remove('spltyremember', { 'path': '/'});
          }
            if(CAD.checkIfTLPLogin()) {
              var result = document.getElementById("loginSuccess");

              $scope.siteminder.email = form.email.$modelValue;
              $scope.siteminder.password = form.userpassword.$modelValue;
              $scope.siteminder.rememberMe = form.rememberMe.$modelValue? "on" : "off";
              $scope.siteminder.redirectURL = form.rememberMe.$modelValue ? ($scope.siteminder.redirectURL+"&RememberMeChkOption=Yes"): $scope.generateTarget();
                var expireDate = new Date();
                expireDate.setMinutes(expireDate.getMinutes() + 30);
                $cookies.putObject('tlpUrlInfo', CAD.getTlpUrlInfo(), {'expires': expireDate, 'path': '/'});
                if (log && log.info) {
                  log.info(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.FORM_SUBMIT) +
                      loggerServiceHelper.setStep(CVSLOGHELPER.STEP.END) + loggerServiceHelper.setDescription("Login form submitted to Siteminder"));
              }
                $timeout(function () {

                  angular.element("#authentcationLoader").show();
                  result.submit();
                }, 100);
            }
            else{
                var expireDate = new Date();
                expireDate.setMinutes(expireDate.getMinutes() + 30);
                $cookies.putObject('loginUrlInfo', CAD.getLoginUrlInfo(), {'expires': expireDate,  'path': '/'});
                var oAuthenticate = {
                  "username": form.email.$modelValue,
                  "password": form.userpassword.$modelValue,
                  "sessionStartTimestamp": $filter('date')(new Date(), 'dd-MMM-yyyy hh:mm.ss a', 'GMT'),
                  "ipAddress": CAD.getIpAddress()
                }
                
              if (log && log.debug) {
                log.debug(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.FORM_SUBMIT) +
                  loggerServiceHelper.setStep(CVSLOGHELPER.STEP.ServiceCallStart) + loggerServiceHelper.setDescription("Authenticate service called."));
              }
                angular.element("#authentcationLoader").show();
                AUTHS.authenticate($scope.authenticationSuccess, oAuthenticate);

            }
            
          
        } else {
            if (log && log.error) {
                log.error(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.FORM_SUBMIT) +
                    loggerServiceHelper.setStep(CVSLOGHELPER.STEP.END) + loggerServiceHelper.setDescription("Login form submitted with form errors."));
            }
          $timeout(function () {
            document.getElementById("loginErrorBlock").focus();
            document.getElementById("loginErrorBlock").scrollIntoView({ behavior: 'smooth' });
              if(cvsUtility.isMobile()){
                  $('html,body').scrollTop(0);
                  $('body', window.parent.document).scrollTop(0);
              }
              // $anchorScroll();
          }, 100);
        }
      };
      $scope.authenticationSuccess= function(data) { 
        var pageError;
        if (log && log.debug) {
          log.debug(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.FORM_SUBMIT) +
            loggerServiceHelper.setStep(CVSLOGHELPER.STEP.ServiceCallDone) + loggerServiceHelper.setDescription("Authenticate service success"));
        }
        if (data.SERVER_ERROR) {
          loginAttempts++;
          $cookies.remove('SPLTY_TOKEN_ID', { 'path': '/'});
          angular.element("#authentcationLoader").hide();
          log.error(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.FORM_SUBMIT) +
            loggerServiceHelper.setStep(CVSLOGHELPER.STEP.END) + loggerServiceHelper.setServiceName("authentication") +
            loggerServiceHelper.setStatus("ERROR") + loggerServiceHelper.setDescription("response  " + JSON.stringify(data)));

          pageError = cvsUtility.getPageError(data, 'Fatal', 'authenticateUser');
          WTS.webTrendsUtag("LINK", {
            page_error: pageError
          });
          $state.go('processingerror');
          return;
        }
        var header = data.getHeader();
        var statusCode = header.statusCode;
        // if(header.refId){
        //   CAD.setRefId(header.refId);
        // }
        if (data.getError() === '' && statusCode === '0000') {
          loginAttempts = 0;
          $scope.loginAttemptsExceeded = false;

              /**
             * Check if user belongs to super user group
             */
            var userObj = data.getAuthResponse().specialtyUser;
            var isSuperUser = false;
            
            if(userObj.userInfo.userGroups){
              if(Array.isArray(userObj.userInfo.userGroups.groupName)){

                    $.each(userObj.userInfo.userGroups.groupName, function(key, grp){
                      if(grp === 'dspSuperUsers'){
                        isSuperUser = true;
                      }
                    });
              }
              else{
                if(userObj.userInfo.userGroups.groupName === 'dspSuperUsers'){
                    isSuperUser = true;
                }
              }
            }
            /**
             * check if user has to be verified
             */
            var verificationRequired = false;
            if($scope.loginForm.rememberMe.$modelValue){
              var rememberMeObj = (data.getAuthResponse().hasOwnProperty('rememberMe')) ? (data.getAuthResponse().rememberMe.data.encryptedValue) : '';
              var expireDate = new Date();
              expireDate.setHours(expireDate.getHours()+24);
              $cookies.put('spltyremember', rememberMeObj, { 'path': '/', 'expires': expireDate });
            }
            if(userObj.compControlInactive === 'YES' || userObj.compControlAction !== 'NO_ACTION_REQUIRED'){
              verificationRequired = true;
            }
            if(isSuperUser){
                $scope.loginInvalidcredentials = true;
                $scope.errorMsg = authErrorMessage.Login["8002"];
                $timeout(function () {
                    document.getElementById("invalidCredentialsBlock").focus();
                    document.getElementById("invalidCredentialsBlock").scrollIntoView({ behavior: 'smooth' });
                    angular.element("#authentcationLoader").hide();
                }, 100);
               angular.element("#authentcationLoader").hide();
            }
            else{
              var userAttrs = {
                lastLoggedIn: userObj.userInfo.lastLoginTimestamp,
                userName: userObj.patientProfile.firstName+ ' '+ userObj.patientProfile.lastName+'!',
                userType: 'specialtyUser',
              }
              var expireDate = new Date();
              expireDate.setMinutes(expireDate.getMinutes() + 10);
              $cookies.put('SPLTY_TOKEN_ID', header.tokenID, { 'path': '/', 'expires': expireDate});
              $cookies.put('userLogAttrs', JSON.stringify(userAttrs), { 'path': '/'});
                 if(verificationRequired){
                   //launch security controls
                   if (log && log.debug) {
                    log.debug(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.FORM_SUBMIT) +
                      loggerServiceHelper.setStep(CVSLOGHELPER.STEP.END) + loggerServiceHelper.setDescription("Taking to security Control"));
                  }
                   if(cvsUtility.queryMap.env !== 'local')
                   window.location.href = window.location.origin+'/FASTPROXY/patients/'+window.location.search+'#/securitycontrols';
                 }
                 else{
                   //launch dashboard
                   if (log && log.debug) {
                    log.debug(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.FORM_SUBMIT) +
                      loggerServiceHelper.setStep(CVSLOGHELPER.STEP.END) + loggerServiceHelper.setDescription("Taking to Dashboard page"));
                  }
                   if(cvsUtility.queryMap.env !== 'local')
                   window.location.href = window.location.origin+'/FASTPROXY/patients/'+window.location.search+'#/prescriptions/refill-prescriptions';
                 }
            }
            // angular.element("#authentcationLoader").hide();

            // if(isSuperUser){
            //     $scope.showServerError = true;
            //     $scope.showAccountMatchError = false;
            //     $scope.loginAttemptsExceeded = false;
            //     $scope.errorMsg = authErrorMessage.Login["8002"];
            //     $timeout(function () {
            //         document.getElementById("serverErrorBlock").focus();
            //         document.getElementById("serverErrorBlock").scrollIntoView({ behavior: 'smooth' });
            //         angular.element("#authentcationLoader").hide();
            //     }, 100);
            //     return;
            // }
          }
          else {
            $cookies.remove('SPLTY_TOKEN_ID', { 'path': '/'});
            loginAttempts++;

          if (loginAttempts >= loginAttemptCap) {
            $scope.loginAttemptsExceeded = true;

            $timeout(function () {
              document.getElementById("loginAttemptsExceededBlock").focus();
              document.getElementById("loginAttemptsExceededBlock").scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
            angular.element("#authentcationLoader").hide();
            pageError = cvsUtility.getPageError(data, 'Fatal', 'searchUser');
            WTS.webTrendsUtag("LINK", {
              page_error: pageError
            });
            switch (statusCode) {
              case '8888': {
                // $scope.showServerError = true;
                // $scope.showAccountMatchError = false;
                $scope.isLocked = true;
                $scope.errorMsg = authErrorMessage.Login["8888"];
                $timeout(function () {
                  document.getElementById("lockedErrorBlock").focus();
                  document.getElementById("lockedErrorBlock").scrollIntoView({ behavior: 'smooth' });
                }, 100);
                break;
              }
              case '8002':
              case '7700':
              case '5502':
                case '5504':{
                // $scope.showServerError = true;
                // $scope.showAccountMatchError = false;
                $scope.loginInvalidcredentials = true;
                $scope.errorMsg = authErrorMessage.Login["8002"];
                $timeout(function () {
                  document.getElementById("invalidCredentialsBlock").focus();
                  document.getElementById("invalidCredentialsBlock").scrollIntoView({ behavior: 'smooth' });
                  angular.element("#authentcationLoader").hide();
              }, 100);
                break;
              }
              default: {
                $state.go('processingerror');
                break;
              }
            }
            if (log && log.error) {
              log.error(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.FORM_SUBMIT) +
                loggerServiceHelper.setStep(CVSLOGHELPER.STEP.END) + loggerServiceHelper.setDescription("Authenticate service error " +
                  JSON.stringify(data.getError())));
            }
            return;
          }
      }

      $scope.stateChanged = function (qId) {
        if ($scope.rememberMe) { //If it is checked
          
        } else {
          
        }
      }
      $scope.triggerRememberMeModal = function ($event) {

        $event.preventDefault();
        var modalInstance = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: '../authentication/app/components/rememberEmailModal/rememberEmailModal.template.html',
          controller: 'rememberEmailModalController',
          controllerAs: 'rememberEmailModalCtrl'
        });
      };
      $scope.$on('emitRememberMe', function (event, rememberMeObj) {
        $scope.rememberMe = true;
        $scope.email = rememberMeObj.rememberMe.data[0].encryptedValue;
      });

      $scope.rememberMeDecrypt = function(response){
        var pageError;
        if (log && log.debug) {
          log.debug(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.PAGE_LOAD) +
            loggerServiceHelper.setStep(CVSLOGHELPER.STEP.ServiceCallDone) + loggerServiceHelper.setDescription("Decrypt service success"));
        }
        if (response.SERVER_ERROR) {
          angular.element("#authentcationLoader").hide();
          log.error(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.PAGE_LOAD) +
            loggerServiceHelper.setStep(CVSLOGHELPER.STEP.END) + loggerServiceHelper.setServiceName("decrypt") +
            loggerServiceHelper.setStatus("ERROR") + loggerServiceHelper.setDescription("response  " + JSON.stringify(response)));

          pageError = cvsUtility.getPageError(response, 'Fatal', 'utilityService-decrypt');
          WTS.webTrendsUtag("LINK", {
            page_error: pageError
          });
          
          return;
        }
        var header = response.getHeader();
        var statusCode = header.statusCode;
        // if(header.refId){
        //   CAD.setRefId(header.refId);
        // }
        if (response.getError() === '' && statusCode === '0000') {
            var rememberMeObj = response.getDetails();
            $scope.$emit('emitRememberMe', rememberMeObj);

            if (log && log.debug) {
              log.debug(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.PAGE_LOAD) +
                loggerServiceHelper.setStep(CVSLOGHELPER.STEP.END) + loggerServiceHelper.setDescription("Decrypt service success"));
            }

          }
          else {
           
            if (log && log.error) {
              log.error(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.PAGE_LOAD) +
                loggerServiceHelper.setStep(CVSLOGHELPER.STEP.END) + loggerServiceHelper.setDescription("Decrypt service error " +
                  JSON.stringify(response.getError())));
            }
            return;
          }
      }
      
      $scope.checkRemember = function () {
        if (log && log.info) {
          log.info(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.PAGE_LOAD) +
              loggerServiceHelper.setStep(CVSLOGHELPER.STEP.START) + loggerServiceHelper.setDescription("RememberMe functionality onLoad of Form"));
        }
        if ($cookies.get('spltyremember', {'path': '/'})) {
          var reqObj = {
            rememberMe: {
              
                "data": [{
                  type: "email",
                  encryptedValue: $cookies.get('spltyremember', {'path': '/'})
            }]
          }}
          if (log && log.debug) {
            log.debug(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.PAGE_LOAD) +
              loggerServiceHelper.setStep(CVSLOGHELPER.STEP.ServiceCallStart) + loggerServiceHelper.setDescription("decrypt service called."));
          }
          
            DUS.decrypt($scope.rememberMeDecrypt, reqObj)
            
        }
    }

        if (log && log.info) {
            log.exit(loggerServiceHelper.setFlow(CVSLOGHELPER.FLOW.Login) + loggerServiceHelper.setAction(CVSLOGHELPER.ACTION.PAGE_LOAD) +
                loggerServiceHelper.setStep(CVSLOGHELPER.STEP.END) + loggerServiceHelper.setDescription("Login Page is loaded" +
                    window.location));
        }
        $timeout(function(){
           $scope.checkRemember();
        },300);

    }
  }

})();
