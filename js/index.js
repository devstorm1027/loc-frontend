$(document).ready(function(){
  /* Redirect the page when Signed In*/
  auth_status = localStorage.getItem('log_status')
  if(auth_status == "true"){
    window.location.href = '/google_review.html'
  }
});
