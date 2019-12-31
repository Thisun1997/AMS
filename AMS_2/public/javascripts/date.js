$(document).ready(function(){
    var dtToday = new Date();
    
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var day1 = dtToday.getDate()-1;
    var year = dtToday.getFullYear();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    
    var maxDate = year + '-' + month + '-' + day;
    var minDate = year + '-' + month + '-' + day1;
    $('#txtDate').attr('min', maxDate);
    $('#txtDate2').attr('min', maxDate);
    $('#date_of_birth').attr('max', minDate);
   
    
}); 