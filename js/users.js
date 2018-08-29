$(document).ready(function(){
  var current_super_admin = JSON.parse(localStorage.getItem('super_admin'))
  var current_client_admin = JSON.parse(localStorage.getItem('client_admin'))
  var current_agency_user = JSON.parse(localStorage.getItem('agency_user'))
  var current_client_id = JSON.parse(localStorage.getItem('client_id'))
  var current_user_id = localStorage.getItem('user_id')

  var user_info = $("tbody#user-info")
  
  if (current_agency_user == true && current_client_admin != true){
    $('#new-user').hide();
  }
  
  var USERS_LIST_URL = 'http://34.209.199.114:57001/api/v1/users_all?users_all=';
  $.ajax({
    method: 'GET',
    url: USERS_LIST_URL,
    success: UserAllSuccessCallback
  });
  
  
  function UserAllSuccessCallback(data){
    for(var i=0; i<data.length; i++){
      if (current_super_admin == true) {
        if(data[i]['email'] == null){
          data[i]['email'] = ''
        }
        if(data[i]['super_admin'] == null){
          data[i]['super_admin'] = ''
        }
        if(data[i]['client_admin'] == null){
          data[i]['client_admin'] = ''
        }
        if(data[i]['agency_user'] == null){
          data[i]['agency_user'] = ''
        }
        if(data[i]['client_id'] == null){
          data[i]['client_id'] = ''
        }
        user_info.append(
          '<tr><td><i class="glyphicon glyphicon-user" style=""></i> '+ data[i]['email'] +'</td>'
          + '<td><div class="label label-success">Normal</div></td>'
          + '<td><a class="edit-trash users-remove-trash" id="'+ data[i]['user_id'] +'"><i class="glyphicon glyphicon-trash"></i> Delete</a></td>'
          + '<td><a class="edit-trash users-edit-trash" id="'+ data[i]['email'] +'" href="/user_edit.html?id=' + data[i]['user_id'] + '"><i class="glyphicon glyphicon-pencil"></i> Edit</a></td>'
          + '</tr>'
        )
      }else if(current_super_admin != true && current_agency_user != true && data[i]['client_id'] != null){
        if (current_client_id == data[i]['client_id'] || 
          data[i]['client_id'] == current_user_id || current_client_id == data[i]['user_id']){
        
          if(data[i]['email'] == null){
            data[i]['email'] = ''
          }
          if(data[i]['super_admin'] == null){
            data[i]['super_admin'] = ''
          }
          if(data[i]['client_admin'] == null){
            data[i]['client_admin'] = ''
          }
          if(data[i]['agency_user'] == null){
            data[i]['agency_user'] = ''
          }
          if(data[i]['client_id'] == null){
            data[i]['client_id'] = ''
          }
          user_info.append(
            '<tr><td><i class="glyphicon glyphicon-user" style=""></i> '+ data[i]['email'] +'</td>'
            + '<td><div class="label label-success">Normal</div></td>'
            + '<td><a class="edit-trash users-remove-trash" id="'+ data[i]['user_id'] +'"><i class="glyphicon glyphicon-trash"></i> Delete</a></td>'
            + '<td><a class="edit-trash users-edit-trash" id="'+ data[i]['email'] +'" href="/user_edit.html?id=' + data[i]['user_id'] + '"><i class="glyphicon glyphicon-pencil"></i> Edit</a></td>'
            + '</tr>'
          )
        }
      } 
      else if(data[i]['super_admin'] != true && current_agency_user != true && current_client_admin == true){
        if (current_user_id == data[i]['user_id'] || current_client_id == data[i]['user_id']){
          if(data[i]['email'] == null){
            data[i]['email'] = ''
          }
          if(data[i]['super_admin'] == null){
            data[i]['super_admin'] = ''
          }
          if(data[i]['client_admin'] == null){
            data[i]['client_admin'] = ''
          }
          if(data[i]['agency_user'] == null){
            data[i]['agency_user'] = ''
          }
          if(data[i]['client_id'] == null){
            data[i]['client_id'] = ''
          }
          user_info.append(
            '<tr><td><i class="glyphicon glyphicon-user" style=""></i> '+ data[i]['email'] +'</td>'
            + '<td><div class="label label-success">Normal</div></td>'
            + '<td><a class="edit-trash users-remove-trash" id="'+ data[i]['user_id'] +'"><i class="glyphicon glyphicon-trash"></i> Delete</a></td>'
            + '<td><a class="edit-trash users-edit-trash" id="'+ data[i]['email'] +'" href="/user_edit.html?id=' + data[i]['user_id'] + '"><i class="glyphicon glyphicon-pencil"></i> Edit</a></td>'
            + '</tr>'
          )
        }
      }
      else if(data[i]['super_admin'] != true && current_agency_user == true && current_client_admin == true){
        if (current_client_id == data[i]['user_id'] || current_client_id == data[i]['client_id'] 
          || current_user_id == data[i]['client_id']){
          if(data[i]['email'] == null){
            data[i]['email'] = ''
          }
          if(data[i]['super_admin'] == null){
            data[i]['super_admin'] = ''
          }
          if(data[i]['client_admin'] == null){
            data[i]['client_admin'] = ''
          }
          if(data[i]['agency_user'] == null){
            data[i]['agency_user'] = ''
          }
          if(data[i]['client_id'] == null){
            data[i]['client_id'] = ''
          }
          user_info.append(
            '<tr><td><i class="glyphicon glyphicon-user" style=""></i> '+ data[i]['email'] +'</td>'
            + '<td><div class="label label-success">Normal</div></td>'
            + '<td><a class="edit-trash users-remove-trash" id="'+ data[i]['user_id'] +'"><i class="glyphicon glyphicon-trash"></i> Delete</a></td>'
            + '<td><a class="edit-trash users-edit-trash" id="'+ data[i]['email'] +'" href="/user_edit.html?id=' + data[i]['user_id'] + '"><i class="glyphicon glyphicon-pencil"></i> Edit</a></td>'
            + '</tr>'
          )
        }
      }
      else if(data[i]['super_admin'] != true && current_agency_user == true && current_user_id == data[i]['user_id']){
        if(data[i]['email'] == null){
          data[i]['email'] = ''
        }
        if(data[i]['super_admin'] == null){
          data[i]['super_admin'] = ''
        }
        if(data[i]['client_admin'] == null){
          data[i]['client_admin'] = ''
        }
        if(data[i]['agency_user'] == null){
          data[i]['agency_user'] = ''
        }
        if(data[i]['client_id'] == null){
          data[i]['client_id'] = ''
        }
        user_info.append(
          '<tr><td><i class="glyphicon glyphicon-user" style=""></i> '+ data[i]['email'] +'</td>'
          + '<td><div class="label label-success">Normal</div></td>'
          + '</tr>'
        )
      }
    }
  }
  
  /* Remove the User logged In*/
  $('body').on('click', 'a.users-remove-trash', function() {
    var USERS_SELECTED = 'http://34.209.199.114:57001/api/v1/users_details?users_details=';
    
    var selected_user_id = parseInt($(this).attr('id'));
    var confirm_message = confirm("Are you sure? Deleting means the user will no longer have access to this account.?");
    
    if(confirm_message){
        $.ajax({
          method: 'GET',
          url: USERS_SELECTED,
          data:({
            user_id: selected_user_id
          }),
          success: UserDeatilsSuccessCallback
        });
    }
    else
      return false;
  })

  function UserDeatilsSuccessCallback (data){
    var USER_REMOVE_API = 'http://34.209.199.114:57001/api/v1/users_remove?users_remove=';
    var stars_remove = 'http://34.209.199.114:57001/api/v1/stars_remove?stars_remove='
    var google_remove = 'http://34.209.199.114:57001/api/v1/google_remove?google_remove='
    selected_agency_user = data[0]['agency_user']
    selected_user_id = data[0]['user_id']
    
    if (selected_agency_user == true){
      $.ajax({
        method: 'GET',
        url: stars_remove,
        data:({
          user_id: selected_user_id
        }),
        success: function(){
          $.ajax({
            method: 'GET',
            url: google_remove,
            data:({
              user_id: selected_user_id
            }),
            success: function(){
              $.ajax({
                method: 'GET',
                url: USER_REMOVE_API,
                data:({
                  user_id: selected_user_id
                }),
                success: function(){
                  if(selected_user_id == current_user_id.toString()){
                    window.location.href = '/signIn.html'
                    localStorage.setItem('log_status', 'false')
                  }
                  else{
                    window.location.href = '/users.html'
                  }
                }
              });
            }
          });
        }
      });
    }
    else{
      $.ajax({
        method: 'GET',
        url: USER_REMOVE_API,
        data:({
          user_id: selected_user_id
        }),
        success: function(){
          if(selected_user_id == current_user_id){
            window.location.href = '/signIn.html'
            localStorage.setItem('log_status', 'false')
          }
          else{
            window.location.href = '/users.html'
          }
        }
      });
    }
  }
  $('body').on('click', 'a.users-edit-trash', function() {
    var selected_user_email = $(this).attr('id');
    localStorage.setItem('editing_user_email', selected_user_email)
    localStorage.setItem('loggedIn_user_id', current_user_id)
  })
});