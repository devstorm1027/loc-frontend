$(document).ready(function(){
  var edit_user_id = window.location.search.match(/\d+/)[0]
  var editing_email = localStorage.getItem('editing_user_email')
  logged_super_admin = JSON.parse(localStorage.getItem('super_admin'))
  logged_client_admin = JSON.parse(localStorage.getItem('client_admin'))
  logged_agency_user = JSON.parse(localStorage.getItem('agency_user'))

  var cli_adm = false
  var age_user = false
  var cli_id = null
  var current_user_id = null
  var current_super_admin = null
  var current_client_admin = false
  var current_agency_user = false
  var current_client_id = null

  var USERS_API_URL_ID = 'http://34.209.199.114:57001/api/v1/users_details?users_details=';
  $.ajax({
    method: 'Get',
    data:({
      user_id: edit_user_id
    }),
    success: users_successCallback,
    url: USERS_API_URL_ID
  });

  function users_successCallback(data){
    for(var i=0; i<data.length; i++){
      current_super_admin = JSON.parse(data[i]['super_admin'])
      var current_client_admin = JSON.parse(data[i]['client_admin'])
      current_agency_user = JSON.parse(data[i]['agency_user'])
      current_client_id = data[i]['client_id']
      current_user_id = data[i]['user_id']
    }
    // if (JSON.parse(current_super_admin) == true){
    //   $('#admin-panel').show()
    //   $('#admin-check').prop('checked', true)
    // }
    if (logged_client_admin == true || logged_super_admin == true){
      $('.admin-user-check').show()
      if (current_client_admin == true) {
        $('#admin-check').prop('checked', true)
      }
      if (JSON.parse(current_agency_user) == true) {
        $('#user-check').prop('checked', true) 
      }
    }
  }

  $("#contact_email").val(editing_email)
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
  

  $("#edit").on('click', function() {
    if($('#admin-check').is(':checked')){
      cli_adm = true
    }
    if($('#user-check').is(':checked')){
      age_user = true
    }
    if($('#admin-check').is(':checked') || $('#user-check').is(':checked')) {
      if ((JSON.parse(current_super_admin) == true && JSON.parse(current_client_admin) == true) || (JSON.parse(current_super_admin) != true)){
        if (JSON.parse(current_user_id) != null){
          if (JSON.parse(current_client_id) != null){
            cli_id = current_client_id
          }else{
            cli_id = current_user_id
          }
        }
      }
    }

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
    else if(current_super_admin != true && !$('#admin-check').is(':checked') && !$('#user-check').is(':checked')) {
      $('#admin-check').addClass("checkbox-invalid");
      $('#user-check').addClass("checkbox-invalid");
    }
    else{
      confirm_error_password_valid.addClass("error").removeClass("error_show")
      input_confirm_password.addClass("valid").removeClass("invalid")
      var API_URL = 'http://34.209.199.114:57001/api/v1/user_edit?user_edit=';
      
      $.ajax({
        method: 'Get',
        data:({
          email: document.getElementById('contact_email').value,
          password: document.getElementById('contact_password').value,
          user_id: edit_user_id,
          client_admin: cli_adm,
          agency_user: age_user,
          client_id: cli_id
        }),
        success: successCallback,
        url: API_URL
      });
    }
  });

  function successCallback(data){
    changed_user_id = data['id']
    loggedIn_user_id = localStorage.getItem('loggedIn_user_id')
    if(changed_user_id.toString() == loggedIn_user_id){
      localStorage.setItem('log_status', "false")
      window.location.href = '/signIn.html'
    }
    else{
      window.location.href = '/users.html'
    }
  }
  
});