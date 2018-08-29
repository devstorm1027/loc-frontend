$(document).ready(function(){
  var current_agency_user = JSON.parse(localStorage.getItem('agency_user'))

  function get_google_stars(){
    var reviewId = window.location.search.match(/\d+/)[0]
    var GET_STARS_URL = 'http://34.209.199.114:57001/api/v1/google_stars_list?google_stars_list=';
    $.ajax({
      method: 'GET',
      url: GET_STARS_URL,
      data:({current_id: reviewId}),
      success: get_stars_successCallback
    });
  }

  var star_data_list = [];
  var starBody = $('tbody#star_num');

  function get_stars_successCallback (data) {
    data_info = data;
    get_allRatings(data)

    var editLocation = $('div#edit-location')
    var detailListing = $('ul#detail-listing')
    
    if (current_agency_user != true){
      editLocation.append(
        '<h1>' + data[0]['listing_name'] + '</h1>'
      )
    }
    else{
      editLocation.append(
        '<h1>' + data[0]['listing_name'] + '</h1>' 
        + '<a class="edit" href="/edit.html?id=' + data[0]['google_id'] + '">' 
        + '<i class="glyphicon glyphicon-pencil"></i> Edit location</a>' 
        + '<br class="hidden-print"><br>'
      )
    }

    detailListing.append(
      '<li>' 
      + '<a id=listing_name href="">' + data[0]['listing_name'] + '</a>' 
      + '</li><li class="active">' + data[0]['listing_name'] + '</li>'
    )
  }

  /* filter the ratings by star */
  $('#starsSelectItem').on('change',function(){

    data = data_info

    if( $(this).val()==="all-rating"){
      get_allRatings(data)
    }

    var selectLength = $('select#starsSelectItem option').length;
    for(j = 1; j < selectLength; j++){

      if( $(this).val()===j.toString()){

        starBody.empty()
        star_data_list = []

        for(var i=0; i<data.length; i++){
          star_data_list.push(data[i]['star_' + j + '']) 
        }
        
        if (!star_data_list.isNull()) {

          for (k = 0; k < star_data_list.length; k++){

            if (star_data_list[k] != null) {

              starBody.append(
                '<tr class="review">' 
                + '<td><br>' 
                + '<div class="clearfix">' 
                + '<div class="pull-left">' 
                + '<div class="rating rating-' + star_data_list[k] + '"><i></i><i></i><i></i><i></i><i></i>' 
                + '</div></div>' 
                + '<div class="rating-side pull-left">&nbsp;' 
                + '<a href="">' + data[k]['listing_name'] + '</a>' 
                + '</div></div>' 
                + '<div class="clearfix review_body" id=review-description>' 
                + '<br><b class="reviewer_name">'
                + '<a>' + data[k]['reviewer'] + '' 
                + '</a></b><br>' + data[k]['review_description'] + '' 
                + '</div></td></tr>'
              );
            }
          }
        }
        else {
          starBody.append(
            '<tr><td class="text-center text-muted">' 
            + '<em>No New Reviews.</em></td></tr>'
          )
        }
      }
    }
  });

  // /* Get the all Ratings */
  function get_allRatings (data_info){

    starBody.empty()
    var star_data = 0
    var reviewer = null
    var review_description = null
    
    for(var i=0; i<data_info.length; i++){
      if (data_info[i]['star_1'] != null) {
        star_data = data_info[i]['star_1']
      }
      if (data_info[i]['star_2'] != null) {
        star_data = data_info[i]['star_2']
      }
      if (data_info[i]['star_3'] != null) {
        star_data = data_info[i]['star_3']
      }
      if (data_info[i]['star_4'] != null) {
        star_data = data_info[i]['star_4']
      }
      if (data_info[i]['star_5'] != null) {
        star_data = data_info[i]['star_5']
      }
      if (data_info[i]['reviewer'] != null) {
        reviewer = data_info[i]['reviewer']
      }
      if (data_info[i]['review_description'] != null) {
        review_description = data_info[i]['review_description']
      }

      if (star_data != null && reviewer != null && review_description != null){
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
          + '<a>' + data_info[i]['reviewer'] + '' 
          + '</a></b><br>' + data_info[i]['review_description'] + '' 
          + '</div></td></tr>'
        );
      }
    }
  }

  /* Disply the details for listing name */
  $('#listing_name').click(function(){
    get_allRatings(data)
  })

  /* function to check the Null for array */
  Array.prototype.isNull = function (){
    return this.join().replace(/,/g,'').length === 0;
  };

  get_google_stars();

});
