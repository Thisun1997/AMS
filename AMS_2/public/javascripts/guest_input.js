$(document).ready(function(){
    var vala = parseInt($('.input-number-group').find('.input-number-adults').val());
    var valc = parseInt($('.input-number-group').find('.input-number-children').val());
    var vali = parseInt($('.input-number-group').find('.input-number-infants').val());
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
        console.log(vali);
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
        if(vala <= 4){
            if ($input.val()<=vala-1){
                $input.val(val + 1);
            }
        }
        else{
            if ($input.val()<=3){
                $input.val(val + 1);
            }
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
  