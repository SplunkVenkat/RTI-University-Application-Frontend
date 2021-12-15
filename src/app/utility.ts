export function getDate(): string {
    let today:any = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
  
    if(dd<10) {
        dd = '0'+dd
    } 
  
    if(mm<10) {
        mm = '0'+mm
    } 
  
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}
export function addDaysToDate(date:string,days:number):Date{
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}