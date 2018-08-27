describe("Authentication:: Module", function() {
    describe("Login :: Components", function() {
        beforeEach(module('cvsApp'));
        beforeEach(module('templates'));
        describe('On Submit click in Standard login flow', function(){
            var  compile, $controller, scope, elm, vm, AUTHS, DUS, CAD, $filter, authenticateModel, $cookies, $state, $rootScope, WTS;
            function getCompiledElement() {
                var compiledDirective = compile(angular.element("<login-form></login-form>"))(scope);
                scope.$digest();
                return compiledDirective;
            }
            beforeEach(function(){
                mock = {decrypt: function(){}};
                module(function($provide) {
                    $provide.value('decryptUtilityService', mock);
                  });
            })
            
            beforeEach(function() {            
                inject(function(_$rootScope_, _$compile_, _$controller_, $compile, $templateCache, authenticateService,decryptUtilityService, cvsAppData, _$filter_, 
                    _authenticateModel_, _$cookies_, _$state_, webTrendsService){
                    $controller = _$controller_;
                    compile=$compile;
                    $rootScope = _$rootScope_;
                    scope=_$rootScope_.$new();
                    AUTHS = authenticateService;   
                    DUS = decryptUtilityService;                 
                    CAD = cvsAppData;
                    $filter = _$filter_;
                    authenticateModel = _authenticateModel_;                   
                    $cookies = _$cookies_;
                    $state = _$state_;
                    WTS = webTrendsService;
                    CAD.setAsTLPLogin(false);
                    elm = getCompiledElement();
                    dirScope = elm.isolateScope();
                    
                })
            })

            it('submitForm method should exist', function(){                
                expect(scope.submitForm).toBeDefined();
              
            });
            it('should create dashboardLoaded cookie', function() {
                scope.loginForm.email.$setViewValue('test@gmail.com');
                scope.loginForm.userpassword.$setViewValue('test@gmail.com');
                scope.submitForm(scope.loginForm);
                var loginClickTime = $cookies.get('loginClickTime');
                expect(loginClickTime).toBeDefined();
            });
            it('submitForm method should call authentication service', function(){                
                spyOn(AUTHS, 'authenticate');
                scope.loginForm.email.$setViewValue('test@gmail.com');
                scope.loginForm.userpassword.$setViewValue('test@gmail.com');
                scope.submitForm(scope.loginForm);
                expect(AUTHS.authenticate).toHaveBeenCalled();
                var oAuthenticate = {
                    "username": scope.loginForm.email.$modelValue,
                    "password": scope.loginForm.userpassword.$modelValue,
                    "sessionStartTimestamp": $filter('date')(new Date(), 'dd-MMM-yyyy hh:mm.ss a', 'GMT'),
                    "ipAddress": CAD.getIpAddress()
                  }
                expect(AUTHS.authenticate).toHaveBeenCalledWith(scope.authenticationSuccess, oAuthenticate);
            })

            it('submitForm method should remove remember me cookie if check box is not selected', function(){                
                $cookies.put('spltyremember', 'test', { 'path': '/'});
                scope.loginForm.email.$setViewValue('test@gmail.com');
                scope.loginForm.userpassword.$setViewValue('test@gmail.com');
                scope.loginForm.rememberMe.$setViewValue(false);
                scope.submitForm(scope.loginForm);
                
                expect($cookies.get('spltyremember', { 'path': '/'})).not.toBeDefined();
            })
           
            it('authenticationSuccess method should exist', function(){
                expect(scope.authenticationSuccess).toBeDefined();
            })

            it('submitForm method should call authentication service with proper params', function(){                
                spyOn(AUTHS, 'authenticate');
                scope.loginForm.email.$setViewValue('test@gmail.com');
                scope.loginForm.userpassword.$setViewValue('test@gmail.com');
                scope.submitForm(scope.loginForm);
                var oAuthenticate = {
                    "username": scope.loginForm.email.$modelValue,
                    "password": scope.loginForm.userpassword.$modelValue,
                    "sessionStartTimestamp": $filter('date')(new Date(), 'dd-MMM-yyyy hh:mm.ss a', 'GMT'),
                    "ipAddress": CAD.getIpAddress()
                  }
                expect(AUTHS.authenticate).toHaveBeenCalledWith(scope.authenticationSuccess, oAuthenticate);
            })

            it('authenticationSuccess method should have been called', function(){
                spyOn(scope, 'authenticationSuccess');
                scope.authenticationSuccess();
                expect(scope.authenticationSuccess).toHaveBeenCalled();
            })

            it('authenticationSuccess method should have been called with proper success response', function(){
                var dataStr = '<authenticateResponse><header><serviceName>loginAuthentication</serviceName><statusCode>0000</statusCode><statusDesc>SUCCESS</statusDesc><refId>Id-20318b5a71c5f6b9b5573767</refId><tokenID>4136490105E23CC282CAF6DA6AAAF883</tokenID></header><details><specialtyUser><userInfo><digitalUserID>2205</digitalUserID><privateID>4426814012483883238</privateID><emailAddress>fazalsuper@sit3.com</emailAddress><userGroups><groupName></groupName></userGroups><lastLoginTimestamp>02/19/2018 10:26 AM CST</lastLoginTimestamp></userInfo><userPreferences/><patientIdentifiers><patientIdentifier/></patientIdentifiers><patientProfile><firstName>Fazal</firstName><lastName>Saiyed</lastName><patientsAddresses><patientsAddress><addressLine1>909 E Collins</addressLine1><addressLine2/><zipCode>75081</zipCode><addressType>DBMODEL</addressType></patientsAddress></patientsAddresses><dateOfBirth>1970-01-01</dateOfBirth><gender>M</gender></patientProfile><compControlInactive>No</compControlInactive><compControlAction>NO_ACTION_REQUIRED</compControlAction></specialtyUser></details></authenticateResponse>'
                authenticateModel.setResponse(dataStr);
                spyOn(scope, 'authenticationSuccess').and.callThrough();
                scope.authenticationSuccess(authenticateModel.getResponse());
                expect(scope.authenticationSuccess).toHaveBeenCalledWith(authenticateModel.getResponse());
            })

            it('authenticationSuccess method should create cookie with proper success response', function(){
                var dataStr = '<authenticateResponse><header><serviceName>loginAuthentication</serviceName><statusCode>0000</statusCode><statusDesc>SUCCESS</statusDesc><refId>Id-20318b5a71c5f6b9b5573767</refId><tokenID>4136490105E23CC282CAF6DA6AAAF883</tokenID></header><details><specialtyUser><userInfo><digitalUserID>2205</digitalUserID><privateID>4426814012483883238</privateID><emailAddress>fazalsuper@sit3.com</emailAddress><userGroups><groupName></groupName></userGroups><lastLoginTimestamp>02/19/2018 10:26 AM CST</lastLoginTimestamp></userInfo><userPreferences/><patientIdentifiers><patientIdentifier/></patientIdentifiers><patientProfile><firstName>Fazal</firstName><lastName>Saiyed</lastName><patientsAddresses><patientsAddress><addressLine1>909 E Collins</addressLine1><addressLine2/><zipCode>75081</zipCode><addressType>DBMODEL</addressType></patientsAddress></patientsAddresses><dateOfBirth>1970-01-01</dateOfBirth><gender>M</gender></patientProfile><compControlInactive>No</compControlInactive><compControlAction>NO_ACTION_REQUIRED</compControlAction></specialtyUser></details></authenticateResponse>'
                authenticateModel.setResponse(dataStr);
                spyOn(scope, 'authenticationSuccess').and.callThrough();
                scope.authenticationSuccess(authenticateModel.getResponse());
                expect($cookies.get('SPLTY_TOKEN_ID', { 'path': '/'})).toEqual('4136490105E23CC282CAF6DA6AAAF883');
            })

            it('authenticationSuccess method should create remember me cookie with proper success response', function(){
                $cookies.remove('spltyremember', { 'path': '/'});
                scope.loginForm.rememberMe.$setViewValue(true);
                var dataStr = '<authenticateResponse><header><serviceName>loginAuthentication</serviceName><statusCode>0000</statusCode><statusDesc>SUCCESS</statusDesc><refId>Id-20318b5a71c5f6b9b5573767</refId><tokenID>4136490105E23CC282CAF6DA6AAAF883</tokenID></header><details><specialtyUser><userInfo><digitalUserID>2205</digitalUserID><privateID>4426814012483883238</privateID><emailAddress>fazalsuper@sit3.com</emailAddress><userGroups><groupName></groupName></userGroups><lastLoginTimestamp>02/19/2018 10:26 AM CST</lastLoginTimestamp></userInfo><userPreferences/><patientIdentifiers><patientIdentifier/></patientIdentifiers><patientProfile><firstName>Fazal</firstName><lastName>Saiyed</lastName><patientsAddresses><patientsAddress><addressLine1>909 E Collins</addressLine1><addressLine2/><zipCode>75081</zipCode><addressType>DBMODEL</addressType></patientsAddress></patientsAddresses><dateOfBirth>1970-01-01</dateOfBirth><gender>M</gender></patientProfile><compControlInactive>No</compControlInactive><compControlAction>NO_ACTION_REQUIRED</compControlAction></specialtyUser></details></authenticateResponse>'
                authenticateModel.setResponse(dataStr);
                
                scope.authenticationSuccess(authenticateModel.getResponse());
                expect($cookies.get('spltyremember', { 'path': '/'})).toBeDefined();
            })

            it('authenticationSuccess method should create userAttrs cookie with proper success response', function(){
                $cookies.remove('userAttrs', { 'path': '/'});
                var dataStr = '<authenticateResponse><header><serviceName>loginAuthentication</serviceName><statusCode>0000</statusCode><statusDesc>SUCCESS</statusDesc><refId>Id-20318b5a71c5f6b9b5573767</refId><tokenID>4136490105E23CC282CAF6DA6AAAF883</tokenID></header><details><specialtyUser><userInfo><digitalUserID>2205</digitalUserID><privateID>4426814012483883238</privateID><emailAddress>fazalsuper@sit3.com</emailAddress><userGroups><groupName></groupName></userGroups><lastLoginTimestamp>02/19/2018 10:26 AM CST</lastLoginTimestamp></userInfo><userPreferences/><patientIdentifiers><patientIdentifier/></patientIdentifiers><patientProfile><firstName>Fazal</firstName><lastName>Saiyed</lastName><patientsAddresses><patientsAddress><addressLine1>909 E Collins</addressLine1><addressLine2/><zipCode>75081</zipCode><addressType>DBMODEL</addressType></patientsAddress></patientsAddresses><dateOfBirth>1970-01-01</dateOfBirth><gender>M</gender></patientProfile><compControlInactive>No</compControlInactive><compControlAction>NO_ACTION_REQUIRED</compControlAction></specialtyUser></details></authenticateResponse>'
                authenticateModel.setResponse(dataStr);
                
                scope.authenticationSuccess(authenticateModel.getResponse());
                expect($cookies.get('userLogAttrs', { 'path': '/'})).toBeDefined();
            })

            it('authenticationSuccess method should call WTS service when there is network issue', function(){
                spyOn(WTS, 'webTrendsUtag');
                var data = {SERVER_ERROR: true};
                scope.authenticationSuccess(data);
                expect(WTS.webTrendsUtag).toHaveBeenCalled();
            });

            it('authenticationSuccess method should call WTS service with proper tagging when there is network issue', function(){
                spyOn(WTS, 'webTrendsUtag');
                var data = {SERVER_ERROR: true};
                scope.authenticationSuccess(data);
                expect(WTS.webTrendsUtag).toHaveBeenCalledWith("LINK", {page_error: cvsUtility.getPageError(data, 'Fatal', 'authenticateUser')});
            });

            it('authenticationSuccess method should take user to processing error page when there is network issue', function(){
                // var dataStr = '<authenticateResponse><header><serviceName>loginAuthentication</serviceName><statusCode>9999</statusCode><statusDesc>SUCCESS</statusDesc><refId>Id-20318b5a71c5f6b9b5573767</refId><tokenID>4136490105E23CC282CAF6DA6AAAF883</tokenID></header><details><specialtyUser><userInfo><digitalUserID>2205</digitalUserID><privateID>4426814012483883238</privateID><emailAddress>fazalsuper@sit3.com</emailAddress><userGroups><groupName></groupName></userGroups><lastLoginTimestamp>02/19/2018 10:26 AM CST</lastLoginTimestamp></userInfo><userPreferences/><patientIdentifiers><patientIdentifier/></patientIdentifiers><patientProfile><firstName>Fazal</firstName><lastName>Saiyed</lastName><patientsAddresses><patientsAddress><addressLine1>909 E Collins</addressLine1><addressLine2/><zipCode>75081</zipCode><addressType>DBMODEL</addressType></patientsAddress></patientsAddresses><dateOfBirth>1970-01-01</dateOfBirth><gender>M</gender></patientProfile><compControlInactive>No</compControlInactive><compControlAction>NO_ACTION_REQUIRED</compControlAction></specialtyUser></details></authenticateResponse>'
                // authenticateModel.setResponse({SERVER_ERROR: true});
                scope.authenticationSuccess({SERVER_ERROR: true});
                $rootScope.$digest();
                expect($state.current.name).toBe('processingerror');
            });

            it('authenticationSuccess method should show invalid credentials for 5504 error code', function(){
                var dataStr = '<authenticateResponse><header><serviceName>loginAuthentication</serviceName><statusCode>5504</statusCode><statusDesc>SUCCESS</statusDesc><refId>Id-20318b5a71c5f6b9b5573767</refId><tokenID>4136490105E23CC282CAF6DA6AAAF883</tokenID></header><details><specialtyUser><userInfo><digitalUserID>2205</digitalUserID><privateID>4426814012483883238</privateID><emailAddress>fazalsuper@sit3.com</emailAddress><userGroups><groupName></groupName></userGroups><lastLoginTimestamp>02/19/2018 10:26 AM CST</lastLoginTimestamp></userInfo><userPreferences/><patientIdentifiers><patientIdentifier/></patientIdentifiers><patientProfile><firstName>Fazal</firstName><lastName>Saiyed</lastName><patientsAddresses><patientsAddress><addressLine1>909 E Collins</addressLine1><addressLine2/><zipCode>75081</zipCode><addressType>DBMODEL</addressType></patientsAddress></patientsAddresses><dateOfBirth>1970-01-01</dateOfBirth><gender>M</gender></patientProfile><compControlInactive>No</compControlInactive><compControlAction>NO_ACTION_REQUIRED</compControlAction></specialtyUser></details></authenticateResponse>'
                authenticateModel.setResponse(dataStr);
                spyOn(scope, 'authenticationSuccess').and.callThrough();
                scope.authenticationSuccess(authenticateModel.getResponse());
                expect(scope.loginInvalidcredentials).toBeTruthy()
            })

            it('authenticationSuccess method should display guest refill banner after 1 inavlid attempt', function(){
                var dataStr = '<authenticateResponse><header><serviceName>loginAuthentication</serviceName><statusCode>5504</statusCode><statusDesc>SUCCESS</statusDesc><refId>Id-20318b5a71c5f6b9b5573767</refId><tokenID>4136490105E23CC282CAF6DA6AAAF883</tokenID></header><details><specialtyUser><userInfo><digitalUserID>2205</digitalUserID><privateID>4426814012483883238</privateID><emailAddress>fazalsuper@sit3.com</emailAddress><userGroups><groupName></groupName></userGroups><lastLoginTimestamp>02/19/2018 10:26 AM CST</lastLoginTimestamp></userInfo><userPreferences/><patientIdentifiers><patientIdentifier/></patientIdentifiers><patientProfile><firstName>Fazal</firstName><lastName>Saiyed</lastName><patientsAddresses><patientsAddress><addressLine1>909 E Collins</addressLine1><addressLine2/><zipCode>75081</zipCode><addressType>DBMODEL</addressType></patientsAddress></patientsAddresses><dateOfBirth>1970-01-01</dateOfBirth><gender>M</gender></patientProfile><compControlInactive>No</compControlInactive><compControlAction>NO_ACTION_REQUIRED</compControlAction></specialtyUser></details></authenticateResponse>'
                authenticateModel.setResponse(dataStr);
                spyOn(scope, 'authenticationSuccess').and.callThrough();
                scope.authenticationSuccess(authenticateModel.getResponse());
                scope.authenticationSuccess(authenticateModel.getResponse());
                scope.authenticationSuccess(authenticateModel.getResponse());
                expect(scope.loginAttemptsExceeded).toBeTruthy()
            })

            it('authenticationSuccess method should show invalid credentials for 8888 error code', function(){
                var dataStr = '<authenticateResponse><header><serviceName>loginAuthentication</serviceName><statusCode>8888</statusCode><statusDesc>SUCCESS</statusDesc><refId>Id-20318b5a71c5f6b9b5573767</refId><tokenID>4136490105E23CC282CAF6DA6AAAF883</tokenID></header><details><specialtyUser><userInfo><digitalUserID>2205</digitalUserID><privateID>4426814012483883238</privateID><emailAddress>fazalsuper@sit3.com</emailAddress><userGroups><groupName></groupName></userGroups><lastLoginTimestamp>02/19/2018 10:26 AM CST</lastLoginTimestamp></userInfo><userPreferences/><patientIdentifiers><patientIdentifier/></patientIdentifiers><patientProfile><firstName>Fazal</firstName><lastName>Saiyed</lastName><patientsAddresses><patientsAddress><addressLine1>909 E Collins</addressLine1><addressLine2/><zipCode>75081</zipCode><addressType>DBMODEL</addressType></patientsAddress></patientsAddresses><dateOfBirth>1970-01-01</dateOfBirth><gender>M</gender></patientProfile><compControlInactive>No</compControlInactive><compControlAction>NO_ACTION_REQUIRED</compControlAction></specialtyUser></details></authenticateResponse>'
                authenticateModel.setResponse(dataStr);
                spyOn(scope, 'authenticationSuccess').and.callThrough();
                scope.authenticationSuccess(authenticateModel.getResponse());
                expect(scope.isLocked).toBeTruthy()
            })
            it('rememberMeDecrypt method should exist', function(){                
                expect(scope.rememberMeDecrypt).toBeDefined();              
            });
           
            it('rememberMeDecrypt method should call WTS service when there is network issue', function(){
                spyOn(WTS, 'webTrendsUtag');
                var response = {SERVER_ERROR: true};
                scope.rememberMeDecrypt(response);
                expect(WTS.webTrendsUtag).toHaveBeenCalled();
            });
            
            it('rememberMeDecrypt method should have been called', function(){
                spyOn(scope, 'rememberMeDecrypt');
                scope.rememberMeDecrypt();
                expect(scope.rememberMeDecrypt).toHaveBeenCalled();
            });
            it('checkRemember method should exist', function(){                
                expect(scope.checkRemember).toBeDefined();              
            });
            it('checkRemember method should have been called', function(){
                spyOn(scope, 'checkRemember');
                scope.checkRemember();
                expect(scope.checkRemember).toHaveBeenCalled();
            });
            it('checkRemember method should call decrypt service', function(){   
                $cookies.put('spltyremember','test', {'path': '/'})
                  spyOn(DUS, 'decrypt');
                  scope.checkRemember();
                  expect(DUS.decrypt).toHaveBeenCalled();
                
            })
            
        })      
    })
})
