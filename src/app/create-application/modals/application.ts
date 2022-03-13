class Application{
    public name : string = '';
    public ofName : string = '';
    public dateCreated : string = '';
    public address : string = '';
    public mobilenumber : string = '';
    public dateReceive : string = '';
    public isSvu : string = '';
    public lastDate : string = '';
    public endorsementDate : string = '';
    public endorsement : string = '';
    public applicationRelated : string = '';
    public addressTransmitted : string = '';
    public applicationNumber : number = 0;
    public firstAppeal? : any;
    public commissionAppeal? :any; 
}

class FirstAppeal {
    public appealDate : string = '';
    public appealDateReceive : string = '';
    public appealApplicationNumber : string = '';
    public appealReason : string = '';
    public appealEndorsement : string = '';
}

class CommissionAppeal {
    public commissionDate : string = '';
    public noticeDate : string = '';
    public hearingDate : string = '';
    public commissionApplicationNumber : string = '';
    public commissionCaseNumber : string = '';
    public commissionFileNumber : string = '';
    public commissionEndorsement : string = '';
}