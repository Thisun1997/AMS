$(document).ready(function(){
$('.airport_location').on('change', function(event ) {
    var prevValue = $(this).data('previous');
 $('.airport_location').not(this).find('option[value="'+prevValue+'"]').show();    
    var value = $(this).val();
   $(this).data('previous',value); $('.airport_location').not(this).find('option[value="'+value+'"]').hide();
 });
});