$(document).ready(function(){
    var vala = 1;
    var valc = 0;
    var vali = 0;
    var $inputt = $('form tr td').find('.total');
    $inputt.val(vala+valc+vali);
    $('form tr td .inc-adults').click(function() {
        var $input = $(this).parents('.input-number-group').find('.input-number-adults');
        var val = parseInt($input.val(), 10);
        if($input.val()<=5){
            val += 1
            $input.val(val);
        }
        vala = parseInt($input.val(), 10);
        $inputt.val(vala+valc+vali);
    });

    
    
    $('form tr td .dec-adults').click(function() {
        var $input = $(this).parents('.input-number-group').find('.input-number-adults');
        var val = parseInt($input.val(), 10);
        if($input.val() > 1){
            $input.val(val - 1);
        }
        vala = parseInt($input.val(), 10);
        $inputt.val(vala+valc+vali);
    });

    $('form tr td .inc-child').click(function() {
        var $input = $(this).parents('.input-number-group').find('.input-number-children');
        var val = parseInt($input.val(), 10);
        if($input.val()<=5){
            $input.val(val + 1);
        }
        valc = parseInt($input.val(), 10);
        $inputt.val(vala+valc+vali);
    });
    
    $('form tr td .dec-child').click(function() {
        var $input = $(this).parents('.input-number-group').find('.input-number-children');
        var val = parseInt($input.val(), 10);
        if($input.val() > 0){
            $input.val(val - 1);
        }
        valc = parseInt($input.val(), 10);
        $inputt.val(vala+valc+vali);
    });
    $('form tr td .inc-infants').click(function() {
        var $input = $(this).parents('.input-number-group').find('.input-number-infants');
        var val = parseInt($input.val(), 10);
        if($input.val() < Math.round(vala/2)) {
            $input.val(val + 1);
        }
        else{
            $input.val(vala/2)
        }
        vali = parseInt($input.val(), 10);
        $inputt.val(vala+valc+vali);
    });
    
    $('form tr td .dec-infants').click(function() {
        var $input = $(this).parents('.input-number-group').find('.input-number-infants');
        var val = parseInt($input.val(), 10);
        if($input.val() > 0){
            $input.val(val - 1);
        }
        vali = parseInt($input.val(), 10);
        $inputt.val(vala+valc+vali);
    });

}); 
  