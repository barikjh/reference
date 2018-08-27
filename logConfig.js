    /**
     * Created by Z179603 on 9/8/2016.
     */
    CVSLOGHELPER={
        CVSEvents: {
            METRICS:"METRICS", IDENT:"IDENT", INFO:"INFO", ERROR:"ERROR", ACTION:"ACTION", TRANSACTION:"TRANSACTION", AUDIT:"AUDIT", WARNING:"WARNING",
            INSTRUMENT:"INSTRUMENT", FAULTTOL:"FAULTTOL", ENTRY:"ENTRY", BLOB:"BLOB", HEALTH:"HEALTH", EXIT:"EXIT"
        },
       CATEGORY:{
                "PAYMENT_REGISTERED":"Payment",
                "QR":"QuickRegistration",
                "TAP":"TrackPackage",
                "Refill":"Refill",
                "GuestRefill":"GuestRefill",
                "StoreLocator":"StoreLocator",
                "OpenEnrollment":"OpenEnrollment",
                "ScheduleCallBack":"ScheduleCallBack",
                "REGISTRATION":"Registration",
                "SC":"SecurityControls",
                "RecentOrders": "RecentOrders",
                "TrackOrder": "TrackOrder",
                "MyAccount": 'My Account',
                "Authentication": 'Authentication',
        "SSO": "SSO",
                "Selfenroll": "Selfenroll",
        "Login": "Login",
        "SuperUser": "SuperUser",
        "Patients": "Patients"
            },
            COMPONENT_NAME:{
                "OLP":"Payments",
                "QR":"QuickReg",
                "RFR":"readyForRefill",
                "SL":"StoreLocator",
                "myAccount":"myAccount",
                "Login": "Standard Login",
                "TLPLogin": "TLP Login",
                "ForgotPassword": "Forgot Password",
                "UnlockAcc": "Unlock Account",
                "OTHER":"OTHER"
            },
            ACTION:{
                "PAGE_LOAD":"PageLoad",
                "BUTTON_CLICK":"ButtonClick",
                "NAVIGATION":"Navigation",
                "FORM_SUBMIT":"FormSubmit",
                "VALIDATION":"Validation"
            },
            MODE:{
               "REGISTERED":"REGISTERED",
                "GUEST":"GUEST"
            },
            FLOW:{
                "ABP":"AccountBalanceAndPayment",
                "MakeAPayment":"MakePayment",
                "PaymentMethod":"PaymentMethod",
                "AddCreditCard":"AddCreditCard",
                "AddBankAccount":"AddBankAccount",
                "AddEditCreditCard":"Add/EditCreditCard",
                "AddEditBankAccount":"Add/EditBankAccount",
                "EditCreditCard":"EditCreditCard",
                "EditBankAccount":"EditBankAccount",
                "PaymentReview":"PaymentReview",
                "PaymentConfirmation":"PaymentConfirmation",
                "SETAUTO":"SetUpAutomaticPayment",
                "BALANCE":"Balance&Payment-Home",
                "PaymentType":"SelectPaymentType",
                "Register":"Register",
                "RefillDashboard":"RefillDashboard",
                "GuestRefill":"GuestRefill",
                "ReviewRefills":"ReviewRefills",
                "PznQuestions":"PznQuestions",
                "RefillConfirmation":"RefillConfirmation",
                "Registration1":"STEP_1 Start managing your care online",
                "Registration2":"STEP_2 Confirm your identity",
                "Registration3":"STEP_3 Manage account security and password",
                "VerifyIdentity":"Verify your identity",
                "RecentOrders": "Recent Orders",
                "TrackOrder": "Track Order",
                "MyAccount": 'My Account',
                "Selfenroll": "Selfenroll",
                "Authentication": 'Authentication',
        "SuperUserLogin": "Super User Login",
                "Login": "Login",
                "TLPLogin": "TLP Login",
                "ForgotPassword": "Forgot Password",
                "CheckActivationKey": "Check Activation Key",
                "UnlockAccount": "Unlock Account",
                "VerifyAnswers": "Verify Answers",
                "ResetPassword": "Reset Password",
        "SessionTimeout": "SessionTimeout",
        "ProcessingError": "ProcessingError",
        "SSO": "SSO",
        "RefreshToken": "Refresh Session",
        "PatientsLoad": "Patient Component Loaded"
            },
            PAGE:{
                MAKE_PAYMENT:"MakePayment",
                ACCOUNT_BALANCE:"AccountBalance",
                AUTOMATIC_PAYMENT:"AutomaticPayment",
                ADD_BANK_ACCOUNT:"AddBankAccount",
                ADD_CREDIT_CARD:"AddCreditCard",
                REVIEW_ORDER_PAGE:"AddReviewOrderPage",
                CONFIRM_ORDER:"ConfirmOrder"
            },
            STEP:{
                START:"START",
                END:"END",
                "VerifyIdentity":"VerifyIdentity",
                "OneTimeFullPayment":"OneTimeFullPayment",
                "AutomaticPayment":"AutomaticPayment",
                "OneTimePartialPayment":"OneTimePartialPayment",
                "BALANCE":"Balance",
                "ServiceCallStart":"ServiceCallStart",
                "ServiceCallDone":"ServiceCallDone",
                "ReadQueryParam": "Read Query Params",
                "ShowError": "Show Error"
            },
            HELPER:{
                DELIMITER : "::",
                KEY_VALUE_SEPARATOR : "=",
                KEY_TIMESTAMP : "ts",
                KEY_CHANNEL : "chan",
                KEY_CHANNEL_PLATFORM : "chPlat",
                KEY_GLOBAL_DIGITAL_ID : "glbDigitId",
                KEY_GLOBAL_REF_ID : "grid",
                KEY_SOURCE :"src",
                KEY_SERVICE_NAME: "serviceName",
                KEY_OPERATION_NAME: "operationName",
                KEY_TRANSACTION_ID : "transId",
                KEY_OPERATION_MODE : "mode", //It could be Test or Prod mode
                KEY_RESPONSE_TIME :"respTime",
                KEY_CATEGORY : "cat",
                KEY_FLOW : "flow",
                KEY_STEP : "step",
                KEY_INSTANCE : "instance",
                KEY_CLUSTER :"cluster",
                KEY_IP_ADDRESS : "ipaddr",
                KEY_USER_ID : "uid",
                KEY_PROCESS_ID : "pid",
                KEY_SESSION_ID : "sessId",
                KEY_USER_AGENT : "ua",
                KEY_DESCRIPTION : "desc",
                KEY_ACTION : "action",
                KEY_LABEL : "label",
                KEY_VALUE :"value",
                KEY_STATUS_CODE : "statusCde",
                KEY_STATUS_MSG :"statusMsg",
                KEY_STATUS : "status",
                KEY_STATUS_ORIGIN : "statusOrigin",
                KEY_STATUS_TYPE : "statusType",
                KEY_HTTP_STATUS_CODE : "httpStatusCode",
                KEY_HTTP_STATUS_MSG :"httpStatusMsg",
                KEY_HTTP_METHOD_NAME : "httpMethodName",
                KEY_HTTP_REQ_PAYLOAD_SIZE : "httpReqPayloadSize",
                KEY_HTTP_RESP_SIZE : "httpRespSize",
                KEY_LINE_OF_BUSINESS : "lineOfBusiness"
       }

    }
