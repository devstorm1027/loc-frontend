$(document).ready(function(){
  /* Get the Success Message for sign up */
  auth_message = localStorage.getItem('success')
  var signInMessage = $("div#logIn-message")

  /*Get the cookie*/
  var SignUpSuccess = localStorage.getItem("pageCookie")

  if (SignUpSuccess == "true") {
    signInMessage.append(
      '<div class="alert fade in alert-success ">'
      + '<button class="close" data-dismiss="alert">×</button>' 
      + auth_message + '</div>'
    )
    localStorage.setItem("pageCookie", "false")
  }
  
  /* Redirect_Error into signIn or signUp page when Signed In*/
  auth_status = localStorage.getItem('log_status')
  if(auth_status == "true"){
    var redirect_message = 'You are already Signed In'
    localStorage.setItem('redirect-message', redirect_message)
    localStorage.setItem('redirect_status', 'true')
    window.location.href = '/google_review.html'
  }

  /* Print the message when signed out*/
  signOut_message_status = localStorage.getItem('signOut_message_status')
  if(signOut_message_status == 'true'){
    signInMessage.append(
      '<div class="alert fade in alert-success ">'
      + '<button class="close" data-dismiss="alert">×</button>' 
      + 'Signed out successfully</div>'
    )
    localStorage.setItem('signOut_message_status', 'false')
  }

  /* Redirect Error into google review page when unSigned In */
  redirect_error_status = localStorage.getItem('unsigned_status')
  if(redirect_error_status == 'true'){
    var message = 'You need to sign in or sign up before continuing'
    signInMessage.prepend(
      '<div class="alert fade in alert-danger ">'
      + '<button class="close" data-dismiss="alert">×</button>' 
      + message + '</div>'
    )
    localStorage.setItem('unsigned_status', 'false')
  }

  /* Event for Sign In*/
  $("#signIn").click(function() {
    var API_URL = 'http://34.209.199.114:57001/api/v1/login?login=';
    $.ajax({
      method: 'GET',
      data:({
        email: document.getElementById('contact_email').value,
        password: document.getElementById('contact_password').value
      }),
      success: successCallback,
      url: API_URL
    });
  });

  function successCallback(data){
    auth_status = data['logged_in']
    if (auth_status == true){
      if (typeof(Storage) != "undefined") {
        localStorage.setItem('log_status', "true")
        localStorage.setItem('signIn_success_cookie', "true")
        localStorage.setItem('success_message', data["message"])
        localStorage.setItem('user_id', data['user_id'])
        localStorage.setItem('user_email', data['email'])
        localStorage.setItem('super_admin', data['super_admin'])
        localStorage.setItem('client_admin', data['client_admin'])
        localStorage.setItem('agency_user', data['agency_user'])
        localStorage.setItem('client_id', data['client_id'])
      }
      
      window.location.href = '/home.html'
    }
    else{
      signInMessage.empty();
      signInMessage.prepend(
        '<div class="alert fade in alert-danger ">'
        + '<button class="close" data-dismiss="alert">×</button>' 
        + data['message'] + '</div>'
      )
    }
  }
  
});