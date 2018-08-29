$(document).ready(function(){
  /* Remove the strings duplicated */
  Array.prototype.removeDuplicate = function(){
   var result = [];
   for(var i =0; i < this.length ; i++){
       if(result.indexOf(this[i]) == -1) result.push(this[i]);
   }
   return result;
  }

  /* Get the Listing Name */
  var checked_listing_name_list = []
  var google_stars_id_list = localStorage.getItem('google_stars_id_list').split(',')
  var listing_name_list = localStorage.getItem('listing_name_list').split(',')
  
  var google_id_list = localStorage.getItem('google_id_list').split(',')
  localStorage.setItem('google_id_list', google_id_list)

  var city_list = localStorage.getItem('city_list').split(',')
  var review_list = localStorage.getItem('review_list')

  for(var k=0; k<=google_stars_id_list.length-1; k++){
    for(var l=0; l<=google_id_list.length-1; l++){
      if(google_stars_id_list[k] == google_id_list[l]){
        checked_listing_name_list.push(listing_name_list[k] + ' (' + city_list[l] + ' )')
      }
    }
  }
  /* Make the checkbox Component when loading the page at first*/
  var filtered_review_list = checked_listing_name_list.removeDuplicate();
  localStorage.setItem('filtered_review_list', filtered_review_list)
  if(filtered_review_list != null){
    for(i=0; i<=filtered_review_list.length-1; i++){
      if(filtered_review_list[i] != null){
        $('#listing-name').append(
          '<div class="checkbox">'
          + '<label><input type="checkbox" id="listing'+ i +'" class="listing-checkbox">'+ filtered_review_list[i] +'</label>'
          + '</div>'
        )
      }
    }
  }

  /* Checkbox for Rating Option */
  var filtered_status = localStorage.getItem('filtered_status')
  var filtered_listing_name_list = []
  if (filtered_status == "true"){
    $('#reviews_filter_ratings_1').prop('checked', string_to_boolean(localStorage.getItem('rating_1')))
    $('#reviews_filter_ratings_2').prop('checked', string_to_boolean(localStorage.getItem('rating_2')))
    $('#reviews_filter_ratings_3').prop('checked', string_to_boolean(localStorage.getItem('rating_3')))
    $('#reviews_filter_ratings_4').prop('checked', string_to_boolean(localStorage.getItem('rating_4')))
    $('#reviews_filter_ratings_5').prop('checked', string_to_boolean(localStorage.getItem('rating_5')))
    for(var j=0; j<=listing_name_list.length-1; j++){
      if(localStorage.getItem(listing_name_list[j]) != null){
        filtered_listing_name_list.push(listing_name_list[j])
      }
    }

    filtered_listing_name_list = filtered_listing_name_list.removeDuplicate()
    for(var i=0; i<=filtered_review_list.length-1; i++){
      if(localStorage.getItem(filtered_review_list[i]) != null){
        $('#listing'+ i +'').prop('checked', string_to_boolean(localStorage.getItem(filtered_review_list[i])))
      }
      else{
        $('#listing'+ i +'').prop('checked', string_to_boolean(localStorage.getItem(filtered_review_list[i].split('(')[0].trim())))
      }
    }
  }

  /* Select the all checkbox for rating */
  $('#rating-select').on('click', function(e){
    e.preventDefault();
    if($(this).data('clicked', true)){
      $('.rating-checkbox').each(function(){
        $(this).prop('checked', true)                  
      });
    }
  });

  /* Clear the all checkbox for rating */
  $('#rating-clear').click(function(e){
    e.preventDefault();
    if($(this).data('clicked', true)){
      $('.rating-checkbox').each(function(){
        $(this).prop('checked', false)                  
      });
    }
  })

  /* Select the all checkbox for listing name */
  $('#location-select').on('click', function(e){
    e.preventDefault();
    if($(this).data('clicked', true)){
      $('.listing-checkbox').each(function(){
        $(this).prop('checked', true)                  
      });
    }
  });

  /* Clear the all checkbox for listing name */
  $('#location-clear').click(function(e){
    e.preventDefault();
    if($(this).data('clicked', true)){
      $('.listing-checkbox').each(function(){
        $(this).prop('checked', false)                  
      });
    }
  })

  /* Cancel Button */
  $('#rating-cancel, #location-cancel').click(function(){
    window.location.href = '/home.html'
    return false;
  })

  $('#rating-save, #location-save').click(function(){
    for(i=0; i<=filtered_review_list.length; i++){
      for(j=0; j<=checked_listing_name_list.length; j++){
        if(filtered_review_list[i] == checked_listing_name_list[j]){
          if($('#listing'+ i +'').prop('checked')){
            localStorage.setItem('listing'+ j +'', true)
            localStorage.setItem('listing_name'+ j +'', checked_listing_name_list[j])
          }else{
            localStorage.setItem('listing'+ j +'', false)
            localStorage.setItem('listing_name'+ j +'', checked_listing_name_list[j])
          }
        }
      }
    }
    if($('#reviews_filter_ratings_1').prop('checked')){
      localStorage.setItem('rating_1', true)
    }else{
      localStorage.setItem('rating_1', false)
    }

    if($('#reviews_filter_ratings_2').prop('checked')){
      localStorage.setItem('rating_2', true)
    }else{
      localStorage.setItem('rating_2', false)
    }
    if($('#reviews_filter_ratings_3').prop('checked')){
      localStorage.setItem('rating_3', true)
    }else{
      localStorage.setItem('rating_3', false)
    }
    if($('#reviews_filter_ratings_4').prop('checked')){
      localStorage.setItem('rating_4', true)
    }else{
      localStorage.setItem('rating_4', false)
    }
    if($('#reviews_filter_ratings_5').prop('checked')){
      localStorage.setItem('rating_5', true)
    }else{
      localStorage.setItem('rating_5', false)
    }
    localStorage.setItem('filter_status', true)
    window.location.href = "/home.html"
  })

  
  /*Convert "true/false" into Boolean true/false */
  function string_to_boolean(str) {
    if(str != null){
      switch (str.toLowerCase ()) {
        case "true":
          return true;
        case "false":
          return false;
        default:
          throw new Error ("Boolean.parse: Cannot convert string to boolean.");
      }
    }
  };
});