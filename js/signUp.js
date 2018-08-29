$(document).ready(function(){

  var input_email=$("#contact_email");
  var input_password=$("#contact_password");
  var input_confirm_password=$("#confirm-password");

  var email_error_element=$("span#email-blank", input_email.parent());
  var email_error_valid=$("span#email-valid", input_email.parent());

  var password_error_element=$("span#password-blank", input_password.parent());
  var password_error_valid=$("span#password-valid", input_password.parent());

  var confirm_error_password = $("span#confirm-password-blank");
  var confirm_error_password_valid = $("span#confirm-password-valid");
  var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
  $('#contact_email').on('input', function() {
    var is_valid_email=re.test(input_email.val());
    
    if(input_email.val()){
      email_error_element.removeClass("error_show").addClass("error");
      if(is_valid_email){
        input_email.removeClass("invalid").addClass("valid");
        email_error_valid.addClass("error").removeClass("error_show")
      }
      else{
        input_email.removeClass("valid").addClass("invalid");
      }
    }
    else{
      email_error_valid.removeClass("error_show").addClass("error");
    }
  });

  $('#contact_password').on('input', function() {
    is_password = input_password.val()
    
    if(is_password){
      password_error_element.removeClass("error_show").addClass("error");
      if(is_password.length < 6){
        input_password.addClass("invalid").removeClass("valid");
      }
      else{
        input_password.addClass("valid").removeClass("invalid");
        password_error_valid.addClass("error").removeClass("error_show")
      }
    }
    else{
      password_error_valid.removeClass("error_show").addClass("error");
    }
  });

  $('#confirm-password').on('input', function() {
    is_confirm_password = input_confirm_password.val()
    is_password = input_password.val()
    if(is_confirm_password != ""){
      confirm_error_password.removeClass("error_show").addClass("error");
      if(is_password == is_confirm_password){
        confirm_error_password_valid.removeClass("error_show").addClass("error");
        input_confirm_password.addClass("valid").removeClass("invalid");
      }
    }
    else{
      confirm_error_password_valid.removeClass("error_show").addClass("error");
    }
  });
  

  $("#register").on('click', function() {
    
    var is_email=input_email.val();
    var is_password = input_password.val()
    var is_confirm_password = input_confirm_password.val()
    var is_valid_email=re.test(input_email.val());

    if(is_email == ''){
      input_email.removeClass("valid").addClass("invalid");
    }
    else if(!is_valid_email){
      input_email.removeClass("valid").addClass("invalid");
      email_error_valid.removeClass("error").addClass("error_show")
    }
    else if(is_password == ''){
      input_password.removeClass("valid").addClass("invalid");
    }
    else if(is_password.length < 6){
      input_password.addClass("invalid").removeClass("valid");
      password_error_valid.removeClass("error").addClass("error_show")
    }
    else if(is_confirm_password == ''){
      input_confirm_password.removeClass("valid").addClass("invalid");
    } 
    else if(is_password != is_confirm_password){
      confirm_error_password_valid.addClass("error_show").removeClass("error")
      input_confirm_password.addClass("invalid").removeClass("valid")
      confirm_error_password.addClass("error").removeClass("error_show")
    }
    else{
      confirm_error_password_valid.addClass("error").removeClass("error_show")
      input_confirm_password.addClass("valid").removeClass("invalid")
      var API_URL = 'http://34.209.199.114:57001/api/v1/register?register=';

      $.ajax({
        method: 'Get',
        data:({
          email: document.getElementById('contact_email').value,
          password: document.getElementById('contact_password').value,
          super_admin: true
        }),
        success: successCallback,
        url: API_URL
      });
    }
  });

  /* Redirect the page when Signed In*/
  auth_status = localStorage.getItem('log_status')
  if(auth_status == "true"){
    window.location.href = '/google_review.html'
  }

  function successCallback(data){
    status = data['status']
    var signupError = $("div#signUp-error")
    if (status == "true"){
      if (typeof(Storage) != "undefined") {
        localStorage.setItem('success', data['message'])
        localStorage.setItem('pageCookie', "true")
      }
      window.location.href = '/signIn.html'
    }
    else{
      signupError.empty()
      signupError.append(
        '<div class="alert fade in alert-danger ">'
        + '<button class="close" data-dismiss="alert">×</button>' 
        + data['message'] + '</div>'
      )
    }
  }
  
});