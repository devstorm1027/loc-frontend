$(document).ready(function(){
  
  var current_user_id = localStorage.getItem('user_id')
  var current_client_id = localStorage.getItem('client_id')

  $("#create_location").click(function() {
    var API_URL = 'http://34.209.199.114:57001/api/v1/google?google=';
    $.ajax({
      method: 'GET',
      data:({
        name: document.getElementById('location_name').value,
        address: document.getElementById('location_address').value,
        city: document.getElementById('location_city').value,
        state: document.getElementById('location_state').value,
        zipcode: document.getElementById('location_zip').value,
        users_id: current_user_id,
        client_id: current_client_id
      }),
      success: successCallback,
      url: API_URL
    });
  });

  $("#csv").click(function() {

    var CSV_API_URL = 'http://34.209.199.114:57001/api/v1/csv_download?csv_download=';

    $.ajax({
      method: 'GET',
      success: csv_successCallback,
      url: CSV_API_URL
    });
  });

  function successCallback(data){
    var STAR_SEARCH_URL = 'http://34.209.199.114:57001/api/v1/google_stars?google_stars=';
    current_id = data['id']
    $.ajax({
      method: 'GET',
      url: STAR_SEARCH_URL,
      data:({
        analytics_id: current_id,
        users_id: current_user_id,
        client_id: current_client_id
      }),
      success: stars_search_successCallback
    });
  }

  function stars_search_successCallback(){
    window.location.href = '/google_review.html'
  }

  function csv_successCallback(){

  }
  
});
