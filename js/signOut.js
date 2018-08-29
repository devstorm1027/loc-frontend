$(document).ready(function(){
  $("#register").click(function() {
    var API_URL = 'http://34.209.199.114:57001/api/v1/logout?logout=';

    $.ajax({
      method: 'GET',
      success: successCallback,
      url: API_URL
    });
  });

  function successCallback(data){
    debugger
    window.location.href = '/signup.html'
  }
});