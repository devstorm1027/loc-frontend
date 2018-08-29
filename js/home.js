$(document).ready(function(){
  var current_super_admin = JSON.parse(localStorage.getItem('super_admin'))
  var current_client_admin = JSON.parse(localStorage.getItem('client_admin'))
  var current_agency_user = JSON.parse(localStorage.getItem('agency_user'))
  var current_client_id = JSON.parse(localStorage.getItem('client_id'))
  var current_user_id = localStorage.getItem('user_id')

  var div_auth_message = $("div#auth-message")
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

  function get_google_stars(){
    var GET_STARS_URL = 'http://34.209.199.114:57001/api/v1/google_stars_user?google_stars_user=';
    $.ajax({
      method: 'GET',
      url: GET_STARS_URL,
      success: get_stars_successCallback
    });

    var GOOGLE_LIST_URL = 'http://34.209.199.114:57001/api/v1/google_list?google_list=';
    $.ajax({
      method: 'GET',
      url: GOOGLE_LIST_URL,
      success: google_successCallback
    });
  }

  var star_data_list = [];
  var starBody = $('tbody#star_num');

  /* Google stars SuccessCallback */
  function get_stars_successCallback (data) {
    data_info = data;
    var listing = 'listing'
    var checked_name = "listing_name"
    var checked_name_list = []
    var listing_name_list = []
    var google_stars_id_list = []
    var listing_id_list = []
    var rating_0, rating_1, rating_2, rating_3, rating_4, rating_5;
    var filter_status = localStorage.getItem('filter_status')
    var filtered_review_list = localStorage.getItem('filtered_review_list')
    if(filtered_review_list != null){
      filtered_review_list = filtered_review_list.split(',')
    }
    var google_id_list = localStorage.getItem('google_id_list')
    if(google_id_list != null){
      google_id_list = google_id_list.split(',')
    }

    for(i=0; i<=data.length-1; i++){
      if(filter_status == 'true'){
        rating_1 = localStorage.getItem('rating_1')
        rating_2 = localStorage.getItem('rating_2')
        rating_3 = localStorage.getItem('rating_3')
        rating_4 = localStorage.getItem('rating_4')
        rating_5 = localStorage.getItem('rating_5')
        if(localStorage.getItem(listing + ''+i+'') != null){
          listing_id_list.push(localStorage.getItem(listing + ''+i+''))
        }
        if(localStorage.getItem(checked_name + ''+i+'') != null){
          checked_name_list.push(localStorage.getItem(checked_name + ''+i+''))
        }
      }
      else{
        rating_0 = 'true'
        rating_1 = 'true'
        rating_2 = 'true'
        rating_3 = 'true'
        rating_4 = 'true'
        rating_5 = 'true'
        listing_id_list.push("true")
        checked_name_list.push(data[i]['listing_name'])
      }
    }
    /* Get the List of Listing Name */
    for(i=0; i<=data.length-1; i++){
      listing_name_list.push(data[i]['listing_name'])
      google_stars_id_list.push(data[i]['google_id'])
    }
    localStorage.setItem('listing_name_list', listing_name_list)
    localStorage.setItem('google_stars_id_list', google_stars_id_list)
    
    var current_page = 1;
    var records_per_page = 5;
    get_allRatings(data, rating_0, rating_1, rating_2, 
      rating_3, rating_4, rating_5, listing_id_list, 
      checked_name_list, filtered_review_list, google_id_list)
    
  }

  function google_successCallback (data){
    var listing_list = [];
    var listing_id_list = []
    var google_id_list = []
    
    var city_list = []
    var review_list = []
    var dataBody = $('tbody#home-dataBody');
    var listing_title_list = []
    var listing_name = $('h1#listing-name')

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
        dataBody.append(
          '<tr><td><small><a href="/dashboard.html?id=' + data[i]['id'] + '">'+ data[i]['name'] + '</a></small><br>'
           +'<small class="text-muted">'+ city + ', ' + state +'<br>'
           + '<div class="rating rating-' + data[i]['average_rating'].toString() + '">' 
           + '<i></i><i></i><i></i><i></i><i></i>' 
           + '</div></small>'
        );
        listing_title_list.push(data[i]['name'])
        google_id_list.push(data[i]['id'])
        city_list.push(data[i]['city'].split(',')[1])
        review_list.push(data[i]['review_name'])
      }
      else if(current_client_admin == true){
        if(data[i]['client_id'] == current_client_id || current_user_id == data[i]['client_id'] 
          || current_client_id == data[i]['users_id']){
          dataBody.append(
          '<tr><td><small><a href="/dashboard.html?id=' + data[i]['id'] + '">'+ data[i]['name'] + '</a></small><br>'
           +'<small class="text-muted">'+ city + ', ' + state +'<br>'
           + '<div class="rating rating-' + data[i]['average_rating'].toString() + '">' 
           + '<i></i><i></i><i></i><i></i><i></i>' 
           + '</div></small>'
          );
          
          listing_title_list.push(data[i]['name'])
          google_id_list.push(data[i]['id'])
          city_list.push(data[i]['city'].split(',')[1])
          review_list.push(data[i]['review_name'])
        }
      }
      else if(current_client_admin != true && current_agency_user == true){
        if(current_user_id == data[i]['users_id']){
          dataBody.append(
          '<tr><td><small><a href="/dashboard.html?id=' + data[i]['id'] + '">'+ data[i]['name'] + '</a></small><br>'
           +'<small class="text-muted">'+ city + ', ' + state +'<br>'
           + '<div class="rating rating-' + data[i]['average_rating'].toString() + '">' 
           + '<i></i><i></i><i></i><i></i><i></i>' 
           + '</div></small>'
          );

          listing_title_list.push(data[i]['name'])
          google_id_list.push(data[i]['id'])
          city_list.push(data[i]['city'].split(',')[1])
          review_list.push(data[i]['review_name'])
        }
      }
    }
    // listing_name.append(listing_title_list[0])
    localStorage.setItem('google_id_list', google_id_list)
    localStorage.setItem('city_list', city_list)
    localStorage.setItem('review_list', review_list)
  }
  // /* Get the all Ratings */
  function get_allRatings (data_info, rating_0, rating_1, rating_2, rating_3, rating_4, rating_5, listing_id_list, checked_name_list,filtered_review_list, google_id_list){
    starBody.empty()
    localStorage.setItem('filtered_status', true)
    for(var i=0; i<data_info.length; i++){
      var star_data = 0
      var reviewer = null
      var review_description = null

      if(listing_id_list[i] == "true"){
        if(rating_1 == "true" && checked_name_list[i] != null){
          if(checked_name_list[i].indexOf('(') != -1){
            if(checked_name_list[i].split('(')[0].trim() == data_info[i]['listing_name']){
              for(var j=0; j<=filtered_review_list.length; j++){
                if(checked_name_list[i] == filtered_review_list[j]){
                  if(data_info[i]['google_id'] == google_id_list[j]){
                    if (data_info[i]['star_1'] != null) {
                      star_data = data_info[i]['star_1']
                      if (data_info[i]['reviewer'] != null) {
                        reviewer = data_info[i]['reviewer']
                      }
                      if (data_info[i]['review_description'] != null) {
                        review_description = data_info[i]['review_description']
                      }
                    }
                  }
                }
              }
            }
          }else if(checked_name_list[i] == data_info[i]['listing_name']){
            if (data_info[i]['star_1'] != null) {
              star_data = data_info[i]['star_1']
              if (data_info[i]['reviewer'] != null) {
                reviewer = data_info[i]['reviewer']
              }
              if (data_info[i]['review_description'] != null) {
                review_description = data_info[i]['review_description']
              }
            }
          }
          localStorage.setItem('rating_1', true)
        }
        if(rating_2 == "true" && checked_name_list[i] != null){
          if(checked_name_list[i].indexOf('(') != -1){
            if(checked_name_list[i].split('(')[0].trim() == data_info[i]['listing_name']){
              for(var j=0; j<=filtered_review_list.length; j++){
                if(checked_name_list[i] == filtered_review_list[j]){
                  if(data_info[i]['google_id'] == google_id_list[j]){
                    if (data_info[i]['star_2'] != null) {
                      star_data = data_info[i]['star_2']
                      if (data_info[i]['reviewer'] != null) {
                        reviewer = data_info[i]['reviewer']
                      }
                      if (data_info[i]['review_description'] != null) {
                        review_description = data_info[i]['review_description']
                      }
                    }
                  }
                }
              }
            }
          }else if(checked_name_list[i] == data_info[i]['listing_name']){
            if (data_info[i]['star_2'] != null) {
              star_data = data_info[i]['star_2']
              if (data_info[i]['reviewer'] != null) {
                reviewer = data_info[i]['reviewer']
              }
              if (data_info[i]['review_description'] != null) {
                review_description = data_info[i]['review_description']
              }
            }
          }
          localStorage.setItem('rating_2', true)
        }
        if(rating_3 == "true" && checked_name_list[i] != null){
          if(checked_name_list[i].indexOf('(') != -1){
            if(checked_name_list[i].split('(')[0].trim() == data_info[i]['listing_name']){
              for(var j=0; j<=filtered_review_list.length; j++){
                if(checked_name_list[i] == filtered_review_list[j]){
                  if(data_info[i]['google_id'] == google_id_list[j]){
                    if (data_info[i]['star_3'] != null) {
                      star_data = data_info[i]['star_3']
                      if (data_info[i]['reviewer'] != null) {
                        reviewer = data_info[i]['reviewer']
                      }
                      if (data_info[i]['review_description'] != null) {
                        review_description = data_info[i]['review_description']
                      }
                    }
                  }
                }
              }
            }
          }else if(checked_name_list[i] == data_info[i]['listing_name']){
            if (data_info[i]['star_3'] != null) {
              star_data = data_info[i]['star_3']
              if (data_info[i]['reviewer'] != null) {
                reviewer = data_info[i]['reviewer']
              }
              if (data_info[i]['review_description'] != null) {
                review_description = data_info[i]['review_description']
              }
            }
          }
          localStorage.setItem('rating_3', true)
        }
        if(rating_4 == "true" && checked_name_list[i] != null){
          if(checked_name_list[i].indexOf('(') != -1){
            if(checked_name_list[i].split('(')[0].trim() == data_info[i]['listing_name']){
              for(var j=0; j<=filtered_review_list.length; j++){
                if(checked_name_list[i] == filtered_review_list[j]){
                  if(data_info[i]['google_id'] == google_id_list[j]){
                    if (data_info[i]['star_4'] != null) {
                      star_data = data_info[i]['star_4']
                      if (data_info[i]['reviewer'] != null) {
                        reviewer = data_info[i]['reviewer']
                      }
                      if (data_info[i]['review_description'] != null) {
                        review_description = data_info[i]['review_description']
                      }
                    }
                  }
                }
              }
            }
          }else if(checked_name_list[i] == data_info[i]['listing_name']){
            if (data_info[i]['star_4'] != null) {
              star_data = data_info[i]['star_4']
              if (data_info[i]['reviewer'] != null) {
                reviewer = data_info[i]['reviewer']
              }
              if (data_info[i]['review_description'] != null) {
                review_description = data_info[i]['review_description']
              }
            }
          }
          localStorage.setItem('rating_4', true)
        }
        if(rating_5 == "true" && checked_name_list[i] != null){
          if(checked_name_list[i].indexOf('(') != -1){
            if(checked_name_list[i].split('(')[0].trim() == data_info[i]['listing_name']){
              for(var j=0; j<=filtered_review_list.length; j++){
                if(checked_name_list[i] == filtered_review_list[j]){
                  if(data_info[i]['google_id'] == google_id_list[j]){
                    if (data_info[i]['star_5'] != null) {
                      star_data = data_info[i]['star_5']
                      if (data_info[i]['reviewer'] != null) {
                        reviewer = data_info[i]['reviewer']
                      }
                      if (data_info[i]['review_description'] != null) {
                        review_description = data_info[i]['review_description']
                      }
                    }
                  }
                }
              }
            }
          }else if(checked_name_list[i] == data_info[i]['listing_name']){
            if (data_info[i]['star_5'] != null) {
              star_data = data_info[i]['star_5']
              if (data_info[i]['reviewer'] != null) {
                reviewer = data_info[i]['reviewer']
              }
              if (data_info[i]['review_description'] != null) {
                review_description = data_info[i]['review_description']
              }
            }
          }
          localStorage.setItem('rating_5', true)
        }
        if (current_super_admin == true){
          if (star_data != 0 && reviewer != null && review_description != null){
            starBody.append(
              '<tr class="review" data-id="2885362" id="review-2885362">' 
              + '<td><br>' 
              + '<div class="clearfix">' 
              + '<div class="pull-left">' 
              + '<div class="rating rating-' + star_data + '"><i></i><i></i><i></i><i></i><i></i>' 
              + '</div></div>' 
              + '<div class="rating-side pull-left">&nbsp;' 
              + '<a href="">' + data_info[i]['listing_name'] + '</a>' 
              + '</div></div>' 
              + '<div class="clearfix review_body" id=review-description>' 
              + '<br><b class="reviewer_name">' 
              + '<a>' + reviewer + '' 
              + '</a></b><br>' + review_description + '' 
              + '</div></td></tr>'
            );
          }
          localStorage.setItem(checked_name_list[i], true)
        }else if(current_client_admin == true){
          if(data_info[i]['client_id'] == current_client_id || current_user_id == data_info[i]['client_id'] 
            || current_client_id == data_info[i]['users_id']){
            if (star_data != 0 && reviewer != null && review_description != null){
              starBody.append(
                '<tr class="review" data-id="2885362" id="review-2885362">' 
                + '<td><br>' 
                + '<div class="clearfix">' 
                + '<div class="pull-left">' 
                + '<div class="rating rating-' + star_data + '"><i></i><i></i><i></i><i></i><i></i>' 
                + '</div></div>' 
                + '<div class="rating-side pull-left">&nbsp;' 
                + '<a href="">' + data_info[i]['listing_name'] + '</a>' 
                + '</div></div>' 
                + '<div class="clearfix review_body" id=review-description>' 
                + '<br><b class="reviewer_name">' 
                + '<a>' + reviewer + '' 
                + '</a></b><br>' + review_description + '' 
                + '</div></td></tr>'
              );
            }
            localStorage.setItem(checked_name_list[i], true)  
          }          
        }else if(current_client_admin != true && current_agency_user == true){
          if(current_user_id == data_info[i]['users_id']){
            if (star_data != 0 && reviewer != null && review_description != null){
              starBody.append(
                '<tr class="review" data-id="2885362" id="review-2885362">' 
                + '<td><br>' 
                + '<div class="clearfix">' 
                + '<div class="pull-left">' 
                + '<div class="rating rating-' + star_data + '"><i></i><i></i><i></i><i></i><i></i>' 
                + '</div></div>' 
                + '<div class="rating-side pull-left">&nbsp;' 
                + '<a href="">' + data_info[i]['listing_name'] + '</a>' 
                + '</div></div>' 
                + '<div class="clearfix review_body" id=review-description>' 
                + '<br><b class="reviewer_name">' 
                + '<a>' + reviewer + '' 
                + '</a></b><br>' + review_description + '' 
                + '</div></td></tr>'
              );
            }
            localStorage.setItem(checked_name_list[i], true)  
          }
        }
      }else{
        localStorage.setItem(checked_name_list[i], false)
      }
    }
  }

  /* Disply the details for listing name */
  // $('#listing_name').click(function(){
  //   get_allRatings(data)
  // })

  /* function to check the Null for array */
  Array.prototype.isNull = function (){
    return this.join().replace(/,/g,'').length === 0;
  };

  get_google_stars();

});
