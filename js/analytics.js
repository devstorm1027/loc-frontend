$(document).ready(function(){
  
  var filtered_info = []
  var filtered_data;
  var location_list = []
  var group_rating = 0
  var group_total_number = 0
  var group_total_number;
  var reviewId;

  function google_list(){
    var GOOGLE_LIST_URL = 'http://34.209.199.114:57001/api/v1/google_list?google_list=';

    $.ajax({
      method: 'GET',
      url: GOOGLE_LIST_URL,
      success: google_successCallback
    });
  }

  function google_successCallback (data){
    var total_number_list = []
    var group_rating_list = []

    filtered_data = group_filter_byLocation(data, reviewId)
    for(j = 0; j<filtered_data.length; j++){
      for(var i = 0; i < data.length; i++){
        if(filtered_data[j] == data[i]['id']){
          if(data[i]['average_rating'] == null || data[i]['total_number'] == null){
            data[i]['average_rating'] = 0
            data[i]['total_number'] = 0
          }

          total_number_list.push(data[i]['total_number'])
          group_rating_list.push(data[i]['average_rating'])
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
  }

  /* Get all of the city and filter about same city */
  function group_filter_byLocation(data, reviewId){
    for(i = 0; i < data.length; i++){
      if (data[i]['city'] != null){
        location_list.push(data[i]['city'].split(',')[1])  
      }
    }

    for (i = 0; i < data.length; i++){
      if(data[i]['id'] == reviewId){
        current_location = data[i]['city'].split(',')[1]
      }
    }
    for (k = 0; k < location_list.length; k++){
      if(current_location == location_list[k]){
        filtered_info.push(data[k]['id'])
      }
    }
    if(filtered_info == null){
      filtered_info.push(data[reviewId-1]['id'])
    }
    return filtered_info
  }

  function analytics (data){
    
    reviewId = window.location.search.match(/\d+/)[0]
    var GOOGLE_Analytics_URL = 'http://34.209.199.114:57001/api/v1/google_analytics?google_analytics=';

    $.ajax({
      method: 'GET',
      url: GOOGLE_Analytics_URL,
      data:({analytics_id: reviewId}),
      success: analytics_successCallback
    });
  }

  function analytics_successCallback (data) {

    var dataBody = $('div#single-review');
    var reviewName = $('span#review-name');
    var ratingValue = $('span#rating-value');
    var ratingRangeValue = $('span#rating-range-value');
    var ratingTotalValue = $('span#rating-total-value')
    var groupComparsion = $('tbody#group-comparsion');

    for(var i = 0; i < data.length; i++){
      if (data[i]['average_rating'] == null || data[i]['total_number'] == null){
        data[i]['average_rating'] = 0
        data[i]['total_number'] = 0
      }

      ratingValue.append(parseInt(data[i]['average_rating']).toString());
      ratingTotalValue.append(data[i]['total_number'].toString())

      var range_value = (data[i]['average_rating'] - parseInt(data[i]['average_rating'])).toFixed(1)
      if (range_value > 0){
        ratingRangeValue.append("+" + range_value.toString())   
      }

      /* Difference of group and this location */
      var difference_rating_value = (group_rating - data[i]['average_rating']).toFixed(1)
      var difference_total_value = data[i]['total_number'] - group_total_number
      
      if (difference_rating_value < 0 || difference_total_value < 0){
        difference_rating_value = "+" + (Math.abs(difference_rating_value)).toString()
        difference_total_value = "+" + Math.abs(difference_total_value).toString()
      }

      groupComparsion.append(
        '<tr><td class="col_left"><strong>This Location</strong></td><td>' 
        + data[i]['average_rating'] 
        + '</td><td>' + data[i]['total_number']
        + '</td><td>50</td><td>1</td></tr>' 
        + '<tr><td class="col_left"><strong>Group Average</strong></td><td>' 
        + group_rating
        + '</td><td>'+ group_total_number 
        + '</td><td>50</td><td>1</td></tr>'
        + '<tr><td class="col_left"><strong>Difference</strong></td><td>' 
        + '<span class="green">' + difference_rating_value + '</span>'
        + '</td><td><span class="green">'+ difference_total_value + '</span>'
        + '</td><td>50</td><td>1</td></tr>'
        );
      
      if (data[i]['average_rating'].toString().indexOf('.') == 1){
        data[i]['average_rating'] = data[i]['average_rating'].toString().replace('.', '-')
      }

      dataBody.append(
        '<div class="rating rating-' + data[i]['average_rating'].toString() 
        + '"><i></i><i></i><i></i><i></i><i></i></div>'
      );
      reviewName.append('<h3>' + data[i]['name'] + '</h3>');
    }
  }

  /* Get the Star Information from Database */
  function get_google_stars(){
    reviewId = window.location.search.match(/\d+/)[0]
    var GET_STARS_URL = 'http://34.209.199.114:57001/api/v1/google_stars_list?google_stars_list=';
    $.ajax({
      method: 'GET',
      url: GET_STARS_URL,
      data:({current_id: reviewId}),
      success: get_stars_successCallback
    });
  }

  /* Navbar for speicial analytics */
  function get_special_analytics(){
    var navBody = $('ul#anaytics-nav-body');
    navBody.append(
      '<li class=""><a href="/groups.html?id=' + reviewId + '">Overview</a></li>'
      +'<li class="active"><a href="/groups.html?id=' + reviewId + '">Locations</a></li>' 
      +'<li class=""><a href="/">By Site</a></li>'
      +'<li class=""><a href="/">Listing</a></li>'
      +'<li class=""><a href="/">Expert</a></li>'
      
    )
  }

  function get_stars_successCallback (stars_data) {
    data_info = stars_data;

    var review_year, review_month, review_day;

    ratingDistChart(data_info)
    reviewCount(data_info)
    ratingOverTime(data_info)
  }

  /* Rating Over Time */
  function ratingOverTime(data_info) {
    star_data_info = []

    for (i=0; i<data_info.length; i++){
      star_data_info.push(i)
      star_data_info[i] = 0

      if (data_info[i]['star_1'] != null) {
        star_data_info[i] = data_info[i]['star_1']
      }
      if (data_info[i]['star_2'] != null) {
        star_data_info[i] = data_info[i]['star_2']
      }
      if (data_info[i]['star_3'] != null) {
        star_data_info[i] = data_info[i]['star_3']
      }
      if (data_info[i]['star_4'] != null) {
        star_data_info[i] = data_info[i]['star_4']
      }
      if (data_info[i]['star_5'] != null) {
        star_data_info[i] = data_info[i]['star_5']
      }
    }

    getReviewDate(data_info)

    var ctx = document.getElementById("rating-over-time");

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
  function ratingDistChart(data_info) {
    Chart_byStar(data_info)

    var ctx = document.getElementById("rating-Dist");

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
              beginAtZero:false,
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
  function reviewCount(data_info){
    review_count_data = []

    for (i=0; i<data_info.length; i++){

      /* Get element of review count data by data length*/
      review_count_data.push(i)
      review_count_data[i] = 0

      if (data_info[i]['star_1'] != null) {
        review_count_data[i] += 1
      }
      if (data_info[i]['star_2'] != null) {
        review_count_data[i] += 1
      }
      if (data_info[i]['star_3'] != null) {
        review_count_data[i] += 1
      }
      if (data_info[i]['star_4'] != null) {
        review_count_data[i] += 1
      }
      if (data_info[i]['star_5'] != null) {
        review_count_data[i] += 1
      }

    }

    getReviewDate(data_info)

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

    var ctx = document.getElementById("review-count");
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
  function Chart_byStar(data_info) {
    rating_by_stars = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}
    
    for (i=0; i<data_info.length; i++){
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

    data = [rating_by_stars[5], rating_by_stars[4],
     rating_by_stars[3], rating_by_stars[2], rating_by_stars[1]
     ]

    return data
  }

  function getReviewDate(data_info) {
    date = new Date()

    var current_year = date.getFullYear();
    var current_month = date.toDateString().substring(4, 7);
    var current_day = date.getDate()

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    review_count_date = []
    review_count_year_list = []
    review_count_month_list = []
    review_count_day_list = []

    for (i = 0; i < data_info.length; i++){
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
              current_review_year = review_count_year_list[i]
              review_count_year_list[i] = current_review_year - 1
            }else{
              review_count_month_list.push(review_month)
            }
          }else {
            review_month = getMonth(current_month) - 1
            if (review_month <= 0){
              review_month = 12 + review_month
              review_count_month_list.push(review_month)
              current_review_year = review_count_year_list[i]
              review_count_year_list[i] = current_review_year - 1
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
              current_review_month = review_count_month_list[i]
              review_count_month_list[i] = current_review_month - 1
            }else{
              review_count_day_list.push(review_day)
            }

          }else {
            review_day = current_day - 7
            if (review_day <= 0){
              review_day = 30 + review_day
              review_count_day_list.push(review_day)
              current_review_month = review_count_month_list[i]
              review_count_month_list[i] = current_review_month - 1
            }else{
              review_count_day_list.push(review_day)  
            }
          }
        }else {
          review_count_day_list.push(current_day)
        }
      }
    }

    /* Join the YY-MM-DD */
    for (j = 0; j < review_count_year_list.length; j++){
      var index = review_count_year_list.indexOf(review_count_year_list[j])
      review_count_date.push([[monthNames[(review_count_month_list[j] - 1)], review_count_day_list[j].toString()].join(' '), review_count_year_list[j]].join(', '))
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
  analytics();
  get_google_stars();
  get_special_analytics();
});