$(document).ready(function(){
  var current_super_admin = JSON.parse(localStorage.getItem('super_admin'))
  var current_client_admin = JSON.parse(localStorage.getItem('client_admin'))
  var current_agency_user = JSON.parse(localStorage.getItem('agency_user'))
  var current_client_id = JSON.parse(localStorage.getItem('client_id'))
  var current_user_id = localStorage.getItem('user_id')
  
  /* Hide Another New Location if Current User is Super or Admin */
  if (current_super_admin == true || current_client_admin == true){
    if (current_agency_user != true){
      $('#another-add-location').hide();
    }
  }
  
  /* Get the user ID */
  var user_id = localStorage.getItem('user_id')
  
  /* Change the to sign out auth status */
  var div_auth_message = $("div#auth-message")
  auth_status = localStorage.getItem('log_status')
  if (auth_status == "true"){
    $("#sign-out").show();
    $("#settings").show()
    $("#sign-in").hide();
    $("#sign-up").hide();
    $("#google-review").show();
    $("#home").show();
  }
  else{
    window.location.href = '/signIn.html'
    localStorage.setItem('unsigned_status', 'true')
  }

  /* Event for Sign Out */
  $('#sign-out').click(function(){
    window.location.href = '/signIn.html'
    localStorage.setItem('log_status', 'false')
    localStorage.setItem('signOut_message_status', 'true')
    $("#sign-up").show();
    $("#sign-in").show();
    $("#sign-out").hide();
    $("#google-review").hide();
  })
  
  /* Get the Success message for sign In */
  auth_message = localStorage.getItem('success_message')
  /* Get the Cookie */
  var signInSuccess = localStorage.getItem("signIn_success_cookie")
  if(signInSuccess == "true"){
    div_auth_message.append(
      '<div class="alert fade in alert-success ">'
      + '<button class="close" data-dismiss="alert">×</button>' 
      + auth_message + '</div>'
    )
    localStorage.setItem("signIn_success_cookie", "false")
  }

  /* Print the Error Message so that not redirect into signIn or signUp page when Signed In*/
  redirect_status = localStorage.getItem('redirect_status')
  redirect_message = localStorage.getItem('redirect-message')
  if(redirect_status == 'true'){
    div_auth_message.append(
      '<div class="alert fade in alert-danger ">'
      + '<button class="close" data-dismiss="alert">×</button>' 
      + redirect_message + '</div>'
    )
    localStorage.setItem('redirect_status', 'false')
  }

  var GOOGLE_LIST_URL = 'http://34.209.199.114:57001/api/v1/google_list?google_list=';
  $.ajax({
    method: 'GET',
    url: GOOGLE_LIST_URL,
    success: google_successCallback
  });

  function google_successCallback (data){
    
    var dataBody = $('tbody#dataBody');
    for(var i = 0; i < data.length; i++){
      
      if (data[i]['average_rating'] == null) {
        data[i]['average_rating'] = ''
      }
      if (data[i]['average_rating'].toString().indexOf('.') == 1){
        data[i]['average_rating'] = data[i]['average_rating'].toString().replace('.', '-')
      }
      
      var city = data[i]['city'].split(',')[1]
      var state = data[i]['state']
      if (state = 'USA'){
        state = 'United States'
      }
      if (current_super_admin == true){
        if(current_agency_user == true){
          if (current_user_id == data[i]['users_id']){
            dataBody.append(
              '<tr><td><strong><a href="/locations/">'+ data[i]['name'] + '</a></strong>'
               +'<span class="location-title"> ('+ city + ', ' + state +')</span><br>' 
               + '<small class="mini_menu">' 
               + '<a id="dashboard-id" href="/dashboard.html?id=' + data[i]['id'] + '">Dashboard</a> | ' 
               + '<a href="/analytics.html?id=' + data[i]['id'] + '">Analytics</a>' 
               + '</small></td>' 
               + '<td><div class="rating rating-' + data[i]['average_rating'].toString() + '">' 
               + '<i></i><i></i><i></i><i></i><i></i>' 
               + '</div></td>' 
               + '<td><a class="edit-trash" href="/edit.html?id=' + data[i]['id'] + '">' 
               + '<i class="glyphicon glyphicon-pencil"></i> Edit</a></td>'
               + '<td><a class="edit-trash trash" id="'+ data[i]['id'] +'">' 
               + '<i class="glyphicon glyphicon-trash"></i> Delete</a></td></tr>'
            );
          }
          else{
            dataBody.append(
              '<tr><td><strong><a href="/locations/">'+ data[i]['name'] + '</a></strong>'
               +'<span class="location-title"> ('+ city + ', ' + state +')</span><br>' 
               + '<small class="mini_menu">' 
               + '<a id="dashboard-id" href="/dashboard.html?id=' + data[i]['id'] + '">Dashboard</a> | ' 
               + '<a href="/analytics.html?id=' + data[i]['id'] + '">Analytics</a>' 
               + '</small></td>' 
               + '<td><div class="rating rating-' + data[i]['average_rating'].toString() + '">' 
               + '<i></i><i></i><i></i><i></i><i></i>' 
               + '</div></td>'
            );  
          }
        }
        else{
          dataBody.append(
            '<tr><td><strong><a href="/locations/">'+ data[i]['name'] + '</a></strong>'
             +'<span class="location-title"> ('+ city + ', ' + state +')</span><br>' 
             + '<small class="mini_menu">' 
             + '<a id="dashboard-id" href="/dashboard.html?id=' + data[i]['id'] + '">Dashboard</a> | ' 
             + '<a href="/analytics.html?id=' + data[i]['id'] + '">Analytics</a>' 
             + '</small></td>' 
             + '<td><div class="rating rating-' + data[i]['average_rating'].toString() + '">' 
             + '<i></i><i></i><i></i><i></i><i></i>' 
             + '</div></td>'
          );
        }
      }
      else if(current_client_admin == true && current_agency_user != true){
        if(data[i]['client_id'] == current_client_id || current_user_id == data[i]['client_id'] 
          || current_client_id == data[i]['users_id']){
          dataBody.append(
            '<tr><td><strong><a href="/locations/">'+ data[i]['name'] + '</a></strong>'
             +'<span class="location-title"> ('+ city + ', ' + state +')</span><br>' 
             + '<small class="mini_menu">' 
             + '<a id="dashboard-id" href="/dashboard.html?id=' + data[i]['id'] + '">Dashboard</a> | ' 
             + '<a href="/analytics.html?id=' + data[i]['id'] + '">Analytics</a>' 
             + '</small></td>' 
             + '<td><div class="rating rating-' + data[i]['average_rating'].toString() + '">' 
             + '<i></i><i></i><i></i><i></i><i></i>' 
             + '</div></td>'
          );
        }
      }else if(current_client_admin == true && current_agency_user == true){
        if(data[i]['client_id'] == current_client_id || current_user_id == data[i]['client_id'] 
          || current_client_id == data[i]['users_id']){
          if(current_user_id == data[i]['users_id']){
            dataBody.append(
              '<tr><td><strong><a href="/locations/">'+ data[i]['name'] + '</a></strong>'
               +'<span class="location-title"> ('+ city + ', ' + state +')</span><br>' 
               + '<small class="mini_menu">' 
               + '<a id="dashboard-id" href="/dashboard.html?id=' + data[i]['id'] + '">Dashboard</a> | ' 
               + '<a href="/analytics.html?id=' + data[i]['id'] + '">Analytics</a>' 
               + '</small></td>' 
               + '<td><div class="rating rating-' + data[i]['average_rating'].toString() + '">' 
               + '<i></i><i></i><i></i><i></i><i></i>' 
               + '</div></td>' 
               + '<td><a class="edit-trash" href="/edit.html?id=' + data[i]['id'] + '">' 
               + '<i class="glyphicon glyphicon-pencil"></i> Edit</a></td>'
               + '<td><a class="edit-trash trash" id="'+ data[i]['id'] +'">' 
               + '<i class="glyphicon glyphicon-trash"></i> Delete</a></td></tr>'
            );
          }
          else{
            dataBody.append(
              '<tr><td><strong><a href="/locations/">'+ data[i]['name'] + '</a></strong>'
               +'<span class="location-title"> ('+ city + ', ' + state +')</span><br>' 
               + '<small class="mini_menu">' 
               + '<a id="dashboard-id" href="/dashboard.html?id=' + data[i]['id'] + '">Dashboard</a> | ' 
               + '<a href="/analytics.html?id=' + data[i]['id'] + '">Analytics</a>' 
               + '</small></td>' 
               + '<td><div class="rating rating-' + data[i]['average_rating'].toString() + '">' 
               + '<i></i><i></i><i></i><i></i><i></i>' 
               + '</div></td>'
            );
          }
        }
      }
      else if(current_client_admin != true && current_agency_user == true){
        if(current_user_id == data[i]['users_id']){
          dataBody.append(
            '<tr><td><strong><a href="/locations/">'+ data[i]['name'] + '</a></strong>'
             +'<span class="location-title"> ('+ city + ', ' + state +')</span><br>' 
             + '<small class="mini_menu">' 
             + '<a id="dashboard-id" href="/dashboard.html?id=' + data[i]['id'] + '">Dashboard</a> | ' 
             + '<a href="/analytics.html?id=' + data[i]['id'] + '">Analytics</a>' 
             + '</small></td>' 
             + '<td><div class="rating rating-' + data[i]['average_rating'].toString() + '">' 
             + '<i></i><i></i><i></i><i></i><i></i>' 
             + '</div></td>' 
             + '<td><a class="edit-trash" href="/edit.html?id=' + data[i]['id'] + '">' 
             + '<i class="glyphicon glyphicon-pencil"></i> Edit</a></td>'
             + '<td><a class="edit-trash trash" id="'+ data[i]['id'] +'">' 
             + '<i class="glyphicon glyphicon-trash"></i> Delete</a></td></tr>'
          );
        }
      }
    }

    /* Remove the data created */
    $(".trash").click(function(){
      var current_id = parseInt($(this).attr('id'));
      var stars_remove = 'http://34.209.199.114:57001/api/v1/stars_remove?stars_remove='
      var google_remove = 'http://34.209.199.114:57001/api/v1/google_remove?google_remove='
      $.ajax({
        method: 'GET',
        url: stars_remove,
        data:({
          current_id: current_id
        }),
        success: google_remove_successCallback
      });

      $.ajax({
        method: 'GET',
        url: google_remove,
        data:({
          current_id: current_id
        }),
        success: google_remove_successCallback
      });
    })
  }
  function google_remove_successCallback(data){
    window.location.href = '/google_review.html'
  }
});