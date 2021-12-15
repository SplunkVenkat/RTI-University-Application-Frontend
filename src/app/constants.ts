export const BASE_APPLICATION = {
title:"Fresh Application",
formFields:[
    {
      "type": "text",
      "formControlName": "name",
      "label": "Name of the Applicant",
      "value": "",
      "required": true
    },
    {
      "type": "text",
      "formControlName": "ofName",
      "label": "S/o, D/o ,W/o, C/o",
      "value": "",
      "required": false
    },
    {
      "type": "date",
      "formControlName": "dateCreated",
      "label": "Date on the application",
      "value": "",
      "required": true
    },
    {
      "type": "text",
      "formControlName": "address",
      "label": "Address",
      "value": "",
      "required": false
    },
    {
      "type": "text",
      "formControlName": "mobilenumber",
      "label": "Contact Number",
      "value": "",
      "required": false
    },
    {
      "type": "date",
      "formControlName": "dateReceive",
      "label": "Date of receiving the said application",
      "value": "",
      "required": true
    },
    {
      "type": "radio",
      "formControlName": "isSvu",
      "label": "Whether the application is related to SVU",
      "value": "yes",
      "options": [
        {
          "id": 1,
          "value": "Yes"
        },
        {
          "id": 2,
          "value": "No"
        }
      ],
      "required": true
    },
    {
      "type": "date",
      "formControlName": "lastDate",
      "label": "Last date for submission of information",
      "value": "",
      "required": true
    },
    {
      "type": "date",
      "formControlName": "endorsementDate",
      "label": "Endorsement date",
      "value": "",
      "required": true
    },
    {
      "type": "dropdown",
      "formControlName": "endorsement",
      "label": "Endorsement given sections",
      "value": [],
      "options": [
        {
          "id": 1,
          "value": "Opt1"
        },
        {
          "id": 2,
          "value": "Opt2"
        }
      ],
      "required": true
    },
    {
      "type": "text",
      "formControlName": "applicationRelated",
      "label": "Application is related",
      "value": "",
      "required": true
    },
    {
      "type": "text",
      "formControlName": "addressTransmitted",
      "label": "Address to which it is to be transmitted",
      "value": "",
      "required": true
    }
  ]
}

  export const FA_SECTION = {
    title:"First Appeal",
    formFields:[
    {
      "type": "date",
      "formControlName": "appealDate",
      "label": "Date of First appeal",
      "value": "",
      "required": true
    },
    {
      "type": "date",
      "formControlName": "appealDateReceive",
      "label": "First appeal received date",
      "value": "",
      "required": true
    },
    {
      "type": "radio",
      "formControlName": "appealReason",
      "label": "Reasons for filing first appeal",
      "value": "",
      "options": [
        {
          "id": 1,
          "value": "Non receipt of the information"
        },
        {
          "id": 2,
          "value": "Not satisfied by the information"
        },
        {
          "id": 3,
          "value": "Both"
        }
      ],
      "required": true
    },
    {
      "type": "dropdown",
      "formControlName": "appealEndorsement",
      "label": "FA Endorsement given sections",
      "value": "1",
      "options": [
        {
          "id": 1,
          "value": "Opt1"
        },
        {
          "id": 2,
          "value": "Opt2"
        }
      ],
      "required": true
    }
  ]
}

  export const CA_SECTION = {
    title:"Commission Appeal",
    formFields:[
    {
      "type": "text",
      "formControlName": "commissionFileNumber",
      "label": "Commission file letter Number",
      "value": "",
      "required": true
    },
    {
      "type": "date",
      "formControlName": "commissionDate",
      "label": "Commission letter date",
      "value": "",
      "required": true
    },
    {
      "type": "text",
      "formControlName": "commissionCaseNumber",
      "label": "Commission case No.",
      "value": "",
      "required": true
    },
    {
      "type": "date",
      "formControlName": "noticeDate",
      "label": "Notice received date",
      "value": "",
      "required": true
    },
    {
      "type": "date",
      "formControlName": "hearingDate",
      "label": "Date of hearing",
      "value": "",
      "required": true
    }
  ]
}