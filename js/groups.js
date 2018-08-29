$(document).ready(function(){

  var current_super_admin = JSON.parse(localStorage.getItem('super_admin'))
  var current_client_admin = JSON.parse(localStorage.getItem('client_admin'))
  var current_agency_user = JSON.parse(localStorage.getItem('agency_user'))
  var current_client_id = JSON.parse(localStorage.getItem('client_id'))
  var current_user_id = localStorage.getItem('user_id')

  var group_id_list = []
  var lat;
  var lng;
  var reviewId;
  var location_list = []
  var filtered_id_list = []
  var filtered_info = []
  var filtered_data;

  function google_list(){
    var GOOGLE_LIST_URL = 'http://34.209.199.114:57001/api/v1/google_list?google_list=';

    $.ajax({
      method: 'GET',
      url: GOOGLE_LIST_URL,
      success: google_successCallback
    });
  }

  function google_successCallback (data){
    var groupTotalValue = $('span#group-total-value')
    var groupRatingValue = $('span#group-rating-value')
    var groupReview = $('div#group-single-review');
    var groupRangeValue = $('span#group-rating-range-value')
    var group_total_number = 0
    var group_rating = 0
    var total_number_list = []
    var group_rating_list = []

    filtered_data = group_filter_byLocation(data, reviewId)
    
    for(j = 0; j<filtered_data.length; j++){
      for(var i = 0; i < data.length; i++){
        if(filtered_data[j] == data[i]['id']){
          if(current_super_admin == true){
            if(data[i]['average_rating'] == null || data[i]['total_number'] == null){
              data[i]['average_rating'] = 0
              data[i]['total_number'] = 0
            }
            total_number_list.push(data[i]['total_number'])
            group_rating_list.push(data[i]['average_rating'])
          }
          else if(current_client_admin == true){
            if(data[i]['client_id'] == current_client_id || current_user_id == data[i]['client_id'] 
              || current_client_id == data[i]['users_id']){
              if(data[i]['average_rating'] == null || data[i]['total_number'] == null){
                data[i]['average_rating'] = 0
                data[i]['total_number'] = 0
              }
              total_number_list.push(data[i]['total_number'])
              group_rating_list.push(data[i]['average_rating'])  
            }
          }
          else if(current_client_admin != true && current_agency_user == true){
            if(current_user_id == data[i]['users_id']){
              if(data[i]['average_rating'] == null || data[i]['total_number'] == null){
                data[i]['average_rating'] = 0
                data[i]['total_number'] = 0
              }
              total_number_list.push(data[i]['total_number'])
              group_rating_list.push(data[i]['average_rating'])   
            }
          }
        }
      }
    }

    for(var i in total_number_list){
      group_total_number += total_number_list[i]
    }
    for(var j in group_rating_list){
      group_rating += group_rating_list[j]
    }
    
    group_rating = (group_rating / group_rating_list.length).toFixed(1)
    if (group_rating.toString().indexOf('.') == 1){
      group_rating_sign = group_rating.toString().replace('.', '-')
    } 
    groupReview.append(
      '<div class="rating rating-' + group_rating_sign.toString() 
          + '"><i></i><i></i><i></i><i></i><i></i></div>'
    )
    groupTotalValue.append(group_total_number.toString())
    groupRatingValue.append(parseInt(group_rating).toString())
    var range_value = (group_rating - parseInt(group_rating)).toFixed(1)
    if (range_value > 0){
      groupRangeValue.append("+" + range_value.toString())
    }
    get_google_all_stars();
  }

  /* Get all of the city and filter about same city */
  function group_filter_byLocation(data, reviewId){
    for(i = 0; i < data.length; i++){
      if(current_super_admin == true){
        if (data[i]['city'] != null){
          location_list.push(data[i]['city'].split(',')[1])
          filtered_id_list.push(data[i]['id'])
        }
        if(data[i]['id'] == reviewId){
          current_location = data[i]['city'].split(',')[1]
        }

      }
      else if(current_client_admin == true){
        if(data[i]['client_id'] == current_client_id || current_user_id == data[i]['client_id'] 
          || current_client_id == data[i]['users_id']){
          if (data[i]['city'] != null){
            location_list.push(data[i]['city'].split(',')[1])
            filtered_id_list.push(data[i]['id'])
          }
          if(data[i]['id'] == reviewId){
            current_location = data[i]['city'].split(',')[1]
          }
        }
      }
      else if(current_client_admin != true && current_agency_user == true){
        if(current_user_id == data[i]['users_id']){
          if (data[i]['city'] != null){
            location_list.push(data[i]['city'].split(',')[1])
            filtered_id_list.push(data[i]['id']) 
          }
          if(data[i]['id'] == reviewId){
            current_location = data[i]['city'].split(',')[1]
          }
        }
      }
    }
    if (filtered_id_list){
      for (k = 0; k < location_list.length; k++){
        if(current_location == location_list[k]){
          filtered_info.push(filtered_id_list[k])
        }
      }
    }
    if(filtered_info == null){
      filtered_info.push(data[reviewId-1]['id'])
    }
    return filtered_info
  }

  function get_google_list_byId (data){
    
    reviewId = window.location.search.match(/\d+/)[0]
    var GOOGLE_Analytics_URL = 'http://34.209.199.114:57001/api/v1/google_analytics?google_analytics=';

    $.ajax({
      method: 'GET',
      url: GOOGLE_Analytics_URL,
      data:({analytics_id: reviewId}),
      success: google_list_ById_successCallback
    });
  }

  function google_list_ById_successCallback (data){
    if (data[0]['lat']){
      lat = data[0]['lat']
    }
    if (data[0]['lng']){
      lng = data[0]['lng']
    }
    initMap(lat, lng)
  }
  function initMap(lat, lng){
    var map = new google.maps.Map(document.getElementById('site-map'), {
      center: {lat: lat, lng: lng},
      zoom: 8
    });
    var marker = new google.maps.Marker({
      position: {lat: lat, lng: lng},
      map: map,
      title: 'Hello World!'
    });
  }

  /* Get the Star Information from Database */
  function get_google_all_stars(){
    var reviewId = window.location.search.match(/\d+/)[0]
    var GET_STARS_URL = 'http://34.209.199.114:57001/api/v1/google_stars_all_list?google_stars_all_list=';
    $.ajax({
      method: 'GET',
      url: GET_STARS_URL,
      success: get_stars_successCallback
    });
  }

  function get_stars_successCallback(data){
    ratingDistChart(data, filtered_data)
    reviewCount(data, filtered_data)
    ratingOverTime(data, filtered_data)
  }

  /* Rating Over Time */
  function ratingOverTime(data_info, filtered_data) {
    star_data_info = []
    k = 0
    
    for (j = 0; j < filtered_data.length; j++){
      for (i = 0; i < data_info.length; i++){
        if (filtered_data[j] == data_info[i]['google_id']){

          k = k-(i-i)
          star_data_info.push(k)
          star_data_info[k] = 0

          if (data_info[i]['star_1'] != null) {
            star_data_info[k] = data_info[i]['star_1']
          }
          if (data_info[i]['star_2'] != null) {
            star_data_info[k] = data_info[i]['star_2']
          }
          if (data_info[i]['star_3'] != null) {
            star_data_info[k] = data_info[i]['star_3']
          }
          if (data_info[i]['star_4'] != null) {
            star_data_info[k] = data_info[i]['star_4']
          }
          if (data_info[i]['star_5'] != null) {
            star_data_info[k] = data_info[i]['star_5']
          }
          k = k + 1
        }
      }
    }
    
    getReviewDate(data_info, filtered_data)
    var ctx = document.getElementById("group-rating-over-time");

    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: review_count_date,
        datasets: [{
          label: 'Rating',
          data: star_data_info,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:false,
            },
            scalesShowVerticalLines: false,
            gridlines:{
              display: false,
              drawBorder: false,
            }
          }],
          xAxes: [{
            gridLines: {
              display: true 
            }
          }]
        },
        title: {
          display: true,
          text: 'Rating'
        }
      }
    });
  }

  /* Rating Distribution */
  function ratingDistChart(data_info, filtered_data) {
    Chart_byStar(data_info, filtered_data)

    var ctx = document.getElementById("group-rating-Dist");

    var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: ["5 stars", "4 stars", "3 stars", "2 stars", "1 stars"],
        datasets: [{
          label: 'Total',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true,
            },
            scalesShowVerticalLines: false,
            gridlines:{
              display: false,
              drawBorder: false,
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero:true,
            },
            gridLines: {
              display: true 
            }
          }]
        },
        title: {
          display: true,
          text: 'Rating Ditribution'
        }
      }
    });
  }

  /* Chart for Reviews Count */
  function reviewCount(data_info, filtered_data){
    review_count_data = []
    k = 0

    for (j = 0; j < filtered_data.length; j++){
      for (i = 0; i < data_info.length; i++){
        current_first_index = i;
        if (filtered_data[j] == data_info[i]['google_id']){

          /* Get element of review count data by data length*/
          k = k-(i-i)
          review_count_data.push(k)
          review_count_data[k] = 0

          if (data_info[i]['star_1'] != null) {
            review_count_data[k] += 1
          }
          if (data_info[i]['star_2'] != null) {
            review_count_data[k] += 1
          }
          if (data_info[i]['star_3'] != null) {
            review_count_data[k] += 1
          }
          if (data_info[i]['star_4'] != null) {
            review_count_data[k] += 1
          }
          if (data_info[i]['star_5'] != null) {
            review_count_data[k] += 1
          }
          k = k + 1
        }
      }
    }

    getReviewDate(data_info, filtered_data)
    /* Remove and increase Date and Value duplicated */
    for (k = 0; k < review_count_date.length; k++){
      for (l = k+1; l <= review_count_date.length; l++){
        if (review_count_date[k] == review_count_date[l]){
          review_count_data[k] = review_count_data[k] + review_count_data[l]
          review_count_data.splice(l, 1) /* remove the value of review count by index */
          review_count_date.splice(l, 1) /* remove the value of review date by index */
          l = l - 1
        }
      }
    }

    var ctx = document.getElementById("group-review-count");
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: review_count_date,
        datasets: [{
          label: 'Count',
          data: review_count_data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true,
              ticks: {
                min: 0,
                max: 100,
                stepSize: 10
              },
              gridlines:{
                display: true
              }
            }
          }],
          xAxes: [{
            gridLines: {
              display: true 
            }
          }]
        },
        title: {
          display: true,
          text: 'Number of Reviews'
        },
        elements: {
          rectangle: {
            borderWidth: 2,
          }
        }
      }
    });
  }

  /* Get the Data for Chart by Star value */
  function Chart_byStar(data_info, filtered_data) {
    rating_by_stars = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}

    for (j = 0; j < filtered_data.length; j++){
      for (i=0; i<data_info.length; i++){
        if(filtered_data[j] == data_info[i]['google_id']){

          if (data_info[i]['star_1'] != null) {
            star_data = data_info[i]['star_1']
            rating_by_stars[star_data] += 1
          }
          if (data_info[i]['star_2'] != null) {
            star_data = data_info[i]['star_2']
            rating_by_stars[star_data] += 1
          }
          if (data_info[i]['star_3'] != null) {
            star_data = data_info[i]['star_3']
            rating_by_stars[star_data] += 1
          }
          if (data_info[i]['star_4'] != null) {
            star_data = data_info[i]['star_4']
            rating_by_stars[star_data] += 1
          }
          if (data_info[i]['star_5'] != null) {
            star_data = data_info[i]['star_5']
            rating_by_stars[star_data] += 1
          }
        }
      }
    }

    data = [rating_by_stars[5], rating_by_stars[4],
     rating_by_stars[3], rating_by_stars[2], rating_by_stars[1]
     ]

    return data
  }

  function getReviewDate(data_info, filtered_data) {
    date = new Date()
    var current_year = date.getFullYear();
    var current_month = date.toDateString().substring(4, 7);
    var current_day = date.getDate()

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    review_count_date = []
    review_count_year_list = []
    review_count_month_list = []
    review_count_day_list = []

    for (j = 0; j < filtered_data.length; j++){
      for (i = 0; i < data_info.length; i++){
        if (filtered_data[j] == data_info[i]['google_id']){
          if (data_info[i]['review_date'] != null) {
            if (isAlphanumeric(data_info[i]['review_date'], 'year') == true){
              if (isAlphanumeric(data_info[i]['review_date'], 'years') == true){
                review_year = current_year - data_info[i]['review_date'].match(/\d+/)[0]
                  review_count_year_list.push(review_year)
                }else {
                  review_year = current_year - 1
                  review_count_year_list.push(review_year)
                }
              }else {
                review_count_year_list.push(current_year)
              }
              
            if (isAlphanumeric(data_info[i]['review_date'], 'month') == true){
              if (isAlphanumeric(data_info[i]['review_date'], 'months') == true){
                review_month = getMonth(current_month) - data_info[i]['review_date'].match(/\d+/)[0]
                if (review_month <= 0){
                  review_month = 12 + review_month
                  review_count_month_list.push(review_month)
                  current_review_year = review_count_year_list.slice(-1)[0]
                  review_count_year_list[review_count_year_list.length - 1] = current_review_year - 1
                }else{
                  review_count_month_list.push(review_month)
                }
              }else {
                review_month = getMonth(current_month) - 1
                if (review_month <= 0){
                  review_month = 12 + review_month
                  review_count_month_list.push(review_month)
                  current_review_year = review_count_year_list.slice(-1)[0]
                  review_count_year_list[review_count_year_list.length - 1] = current_review_year - 1
                }else {
                  review_count_month_list.push(review_month)
                }
              }
            }else {
              review_count_month_list.push(getMonth(current_month))
            }

            if (isAlphanumeric(data_info[i]['review_date'], 'week') == true){
              if (isAlphanumeric(data_info[i]['review_date'], 'weeks') == true){
                review_day = current_day - 7 * data_info[i]['review_date'].match(/\d+/)[0]
                if (review_day <= 0){
                  review_day = 30 + review_day
                  review_count_day_list.push(review_day)
                  current_review_month = review_count_month_list.slice(-1)[0]
                  review_count_month_list[review_count_month_list.length - 1] = current_review_month - 1
                }else{
                  review_count_day_list.push(review_day)
                }

              }else {
                review_day = current_day - 7
                if (review_day <= 0){
                  review_day = 30 + review_day
                  review_count_day_list.push(review_day)
                  current_review_month = review_count_month_list.slice(-1)[0]
                  review_count_month_list[review_count_month_list.length - 1] = current_review_month - 1
                }else{
                  review_count_day_list.push(review_day)  
                }
              }
            }else {
              review_count_day_list.push(current_day)
            }
          }
        }
      }
    }

    /* Join the YY-MM-DD */
    for (j = 0; j < review_count_year_list.length; j++){
      if(review_count_year_list[j] != null){
        var index = review_count_year_list.indexOf(review_count_year_list[j])
        review_count_date.push([[monthNames[(review_count_month_list[j] - 1)], review_count_day_list[j].toString()].join(' '), review_count_year_list[j]].join(', '))
      }
    }

    return review_count_date
  }

  /* Convert to Digit the Current Month(String) */
  function getMonth(monthStr){
    return new Date(monthStr+'-1-01').getMonth()+1
  }

  /* Check the Charactor from String */
  function isAlphanumeric(fullstring, chart){
    if(fullstring.indexOf(chart) !== -1){
      return true
    }
    else{
      return false
    }
  }
  google_list();
  get_google_list_byId();
});
