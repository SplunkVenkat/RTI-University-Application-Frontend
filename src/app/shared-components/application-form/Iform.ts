export interface IFields {
    type: string;
    formControlName: string;
    label: string;
    value: any;
    options?:any;
    required: boolean;
}
export interface IForm {
    title:string;
    showRevokeButton:boolean;
    showPrintButton:boolean;
    formFields :Array<IFields>
}