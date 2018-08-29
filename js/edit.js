$(document).ready(function(){
  
  function edit (data){
    var reviewId = window.location.search.match(/\d+/)[0]
    var GOOGLE_Analytics_URL = 'http://34.209.199.114:57001/api/v1/google_analytics?google_analytics=';

    $.ajax({
      method: 'GET',
      url: GOOGLE_Analytics_URL,
      data:({analytics_id: reviewId}),
      success: edit_successCallback
    });
  }

  function edit_successCallback (data) {

    var editForm = $('div#edit-form');
    if (data[0]['city']){
      address = data[0]['city'].split(',')[0]
      city = data[0]['city'].split(',')[1]
    }
    if (data[0]['state'] == 'USA') {
      state = 'United States'
    }
    else{
      state = data[0]['state']
    }

    editForm.append(
      '<div class="form-group">'
      + '<label for="location_duty">Name</label>' 
      + '<input class="form-control" value="' + data[0]['name'] + '" type="text" id="location_name">' 
      + '</div>' + 
      '<div class="form-group">'
      + '<label for="location_address">Address</label>' 
      + '<input class="form-control" value="' + address.toString() + '" type="text" id="location_address">' 
      + '</div>' + 
      '<div class="form-group">'
      + '<label for="location_city">City</label>' 
      + '<input class="form-control" value="' + city + '" type="text" id="location_city">' 
      + '</div>' + 
      '<div class="form-group">'
      + '<label for="location_state">State</label>' 
      + '<input class="form-control" value="' + state + '" type="text" id="location_state">' 
      + '</div>' + 
      '<div class="form-group">'
      + '<label for="location_zip">Zip</label>' 
      + '<input class="form-control" value="' + data[0]['zipcode'] + '" type="text" id="location_zip">' 
      + '</div>'
    );
  }
  edit();
});
