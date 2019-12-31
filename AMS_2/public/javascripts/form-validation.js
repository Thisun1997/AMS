// Wait for the DOM to be ready
$(document).ready(function() {
 
    $('#registration').submit(function(e) {
      e.preventDefault();
      var full_name = $('#full_name').val();
      var gender = $('#gender').val();
      var email = $('#email').val();
      var date_of_birth = $('#date_of_birth').val();
      var citizenship = $('#citizenship').val();
      var password = $('#password').val();
      var confirm_password = $('#confirm_password').val();
   
      $(".error_2").remove();
  
      if (password.length < 6) {
        $('#password').after('<td class="error_2">Password must be at least 8 characters long</td>');
      }
      else if(confirm_password.length<1){
        $('#confirm_password').after('<td class="error_2">Password must be at provided</td>');
      }
      else {
        var regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        var validEmail = regEx.test(email);
        if (!validEmail || password != confirm_password) {
            if (!validEmail || password){
                $('#email').after('<td class="error_2">Enter a valid email</td>');
            }
            if(password != confirm_password){
                $('#confirm_password').after('<td class="error_2">two passwords do not match</td>');
            }
        }
        else{
            $(this).unbind('submit').submit()
        }
      }
    });



    $('#guestlogin').submit(function(e) {
        e.preventDefault();
        var full_name = $('#full_name').val();
        var gender = $('#gender').val();
        var email = $('#email').val();
        var date_of_birth = $('#date_of_birth').val();
        var citizenship = $('#citizenship').val();
     
        $(".error_2").remove();
     
        if (full_name.length < 1) {
          $('#full_name').after('<std class="error_2">This field is required</td>');
        }
        if (gender.length < 1) {
          $('#gender').after('<td class="error_2">This field is required</td>');
        }
        if (citizenship.length < 1) {
          $('#citizenship').after('<td class="error_2">This field is required<</td>');
        } if (email.length < 1) {
          $('#email').after('<td class="error_2">This field is required</td>');
        }
        if (date_of_birth.length < 8) {
          $('#password').after('<td class="error_2">Password must be at least 8 characters long</td>');
        }
          else {
          var regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
          var validEmail = regEx.test(email);
          if (!validEmail) {
            $('#email').after('<td class="error_2">Enter a valid email</td>');
          }
          else{
            $(this).unbind('submit').submit()
        }
        }
      });
   
   });

