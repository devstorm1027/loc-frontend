$(document).ready(function(){
  $("#edit_location").click(function() {
    var API_URL = 'http://34.209.199.114:57001/api/v1/google_edit?google_edit=';
    var current_id = window.location.search.match(/\d+/)[0]
    $.ajax({
      method: 'GET',
      data:({
        name: document.getElementById('location_name').value,
        address: document.getElementById('location_address').value,
        city: document.getElementById('location_city').value,
        state: document.getElementById('location_state').value,
        zipcode: document.getElementById('location_zip').value,
        current_id: current_id
      }),
      success: successCallback,
      url: API_URL
    });
  });

  function successCallback(){
    window.location.href = '/google_review.html'
  }
  
