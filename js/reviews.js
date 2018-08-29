$(document).ready(function(){
  var stars_id = window.location.search.match(/\d+/)[0]
  var single_stars_deails = 'http://34.209.199.114:57001/api/v1/stars_details?stars_details='
  var starBody = $('tbody#star_num');

  $.ajax({
    method: 'GET',
    url: single_stars_deails,
    data:({stars_id: stars_id}),
    success: get_stars_successCallback
  });


  function get_stars_successCallback(data){
    allReviews(data)

    var detailListing = $('ul#detail-listing')
    if(data[0]['listing_name'] != null && data[0]['google_id'] != null){
      detailListing.append(
        '<li>' 
        + '<a id=listing_name href="/home.html">' + data[0]['listing_name'] + '</a>' 
        + '</li>'
        + '<li>'
        + '<a id=listing_name href="/dashboard.html?id=' + data[0]['google_id'] + '">' + data[0]['listing_name'] + '</a>'
        + '</li>'
        + '<li class="active">Review #' + stars_id + '</li>'
      )
    }
  }

  function allReviews(data_info){
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
          + '</div></div> </div>' 
          + '<div class="clearfix review_body" id=review-description>' 
          + '<br><b class="reviewer_name">' 
          + '<a>' + data_info[i]['reviewer'] + '' 
          + '</a></b><br>' + data_info[i]['review_description'] + '' 
          + '</div></td></tr>'
        );
      }
    }
  }
})