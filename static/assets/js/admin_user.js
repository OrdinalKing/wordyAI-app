const ROLE = ['User', 'Admin'];

$(document).ready(async function(){
  $('#backdrop').hide();
  $('#custom_data_table').DataTable();
  $('#backdrop').show();
  await getUserData();
  $('#backdrop').hide();

  $('#main-check').change(function() {
    if ($('#main-check').prop('checked')){
        $(':checkbox').each(function() {
            $(this).prop('checked', true);
        });
    }
    else{
        $(':checkbox').each(function() {
            $(this).prop('checked', false);
        });
    }
  });

})

async function getUserData() {
  $('#page1').show();
  $('#page2').hide();
  response = await fetch(admin_app_url + "/user/get_user_data", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
      },
      body: {}
  })
  response = await(response.json());
  console.log(response);

  $('#custom_data_table').DataTable().destroy();
  $('#custom_data_table tbody').empty();

  data ='';
  for(let i=0;i<response.length;i++)
  {
      let status;
      let statusStyle;
      let statusIcon;
      let statusMethod;
      let statusTitle;
      if (response[i].activate) 
      {
        status = 'Active';
        statusStyle = 'text-primary';
        statusIcon = 'bx-trash'
        statusMethod = 'deleteUserDataById'
        statusTitle = 'title = "delete user data"'
      }
      else 
      {
        status = 'Deleted';
        statusStyle = 'text-danger';
        statusIcon = 'bx-check'
        statusMethod = 'activateUserDataById'
        statusTitle = 'title = "activate user data"'
      }
      data = data + '<tr>'+
      '<td>'+
      '<input type="checkbox" data_id="'+ response[i].id +'">' +
      '</td>' +
      '<td>' + response[i].username+ '</td>' +
      '<td>' + response[i].email + '</td>' +
      '<td>' + ROLE[response[i].role -1 ] + '</td>' +
      '<td class="'+ statusStyle + '">' + status + '</td>' +
      '<td><i title="change user role" class="bx bx-edit-alt text-primary ft24 cursor-pointer me-3" onclick=toggleUserRole("'+ response[i].id + '")></i><i '+ statusTitle + 'class="bx ' + statusIcon + ' text-danger ft24 cursor-pointer" onclick=' + statusMethod + '("'+ response[i].id + '")></i></td>'
      '</tr>';
  }   
  $('#custom_data_table tbody').append(data);
  $('#custom_data_table').DataTable()

}

async function showCustomer(id) {
  $('#backdrop').show();
  response = await fetch(admin_app_url + "/user/get_user_data_by_id", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({
          'id': id
      })
  })
  response = await(response.json());
  console.log(response);
  /*
  data = '<p class="text-secondary fw700 ft24">'+ response.customerid +'</p>' +
       +'<p class="text-secondary fw700 ft24">'+ response.customerid +'</p>' +
       +'<p class="text-secondary fw700">'+ response.email +'</p>' +
       +'<p class="text-secondary fw700">'+ response.company +'</p>' +
       +'<p class="text-secondary fw700">'+ response.country +'</p>' +
       +'<p class="text-secondary fw700">'+ response.state +'</p>' +
       +'<p class="text-secondary fw700">'+ response.zipcode +'</p>' +
       +'<p class="text-secondary fw700">'+ response.taxid +'</p>' +
       +'<p class="text-secondary fw700">'+ response.vatnum +'</p>' +
       +'<p class="text-secondary fw700">'+ response.bill_address +'</p>' +
       +'<p class="text-secondary fw700">'+ response.mobile +'</p>';
  */
       data = '<div class="d-flex flex-row justify-content-between mb-4">' +
       '<p class="text-secondary fw700 ft24 mb-0">'+ response.customerid +'</p>' +
       '<button class="btn btn-primary px-3" onclick="goBack()">Back</button>'+
       '</div>'+ 
       '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Email: </span>' + response.email +'</p>' +
       '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Company: </span>' + response.company +'</p>' +
       '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Country: </span>' + response.country +'</p>'+
       '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">State: </span>' + response.state +'</p>'+
       '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Zipcode: </span>' + response.zipcode +'</p>'+
       '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Taxid: </span>' + response.taxid +'</p>'+
       '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Vatnum: </span>' + response.vatnum +'</p>'+
       '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">BillAddress: </span>' + response.bill_address +'</p>'+
       '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Mobile: </span>' + response.mobile +'</p>'+
       '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Created Time: </span>' + new Date(Date.parse(response.created_at)) +'</p>'+
       '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Updated Time: </span>' + new Date(Date.parse(response.updated_at)) +'</p>';


  $('#page2').show();
  $('#page2').empty();
  $('#page2').append(data);
  $('#page1').hide();
  $('#backdrop').hide();
}

function deleteUserDataById(id){
  confirmToast(' Are you going to delete user data?', 
      function() { // confirm ok
          fetch(admin_app_url + "/user/delete_user_data_by_id", { 
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCookie('csrftoken'),
              },
              body: JSON.stringify({
                  'id': parseInt(id),
              })
          }).then(response => response.json()).then(
              
              response => {
                  if (response.status === 'success')
                  {
                      toastr.options = {
                          "positionClass": "toast-top-right",
                          "timeOut": "3000"
                        }
                      toastr.success(response.message);
                      $('#category').val('');
                      getCategoryData();
                  }
                  else
                  {
                      toastr.options = {
                          "positionClass": "toast-top-right",
                          "timeOut": "3000"
                        }
                      toastr.error(response.message);
                  }
              }
          )
      },
      function() {} // confirm cancel           
  );
}

function toggleUserRole(id){
  confirmToast(' Are you going to change the user role?', 
      function() { // confirm ok
          fetch(admin_app_url + "/user/change_user_role", { 
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCookie('csrftoken'),
              },
              body: JSON.stringify({
                  'id': parseInt(id),
              })
          }).then(response => response.json()).then(
              
              response => {
                  if (response.status === 'success')
                  {
                      toastr.options = {
                          "positionClass": "toast-top-right",
                          "timeOut": "3000"
                        }
                      toastr.success(response.message);
                      $('#category').val('');
                      getCategoryData();
                  }
                  else
                  {
                      toastr.options = {
                          "positionClass": "toast-top-right",
                          "timeOut": "3000"
                        }
                      toastr.error(response.message);
                  }
              }
          )
      },
      function() {} // confirm cancel           
  );
}

function activateUserDataById(id){
  confirmToast(' Are you going to activate the user?', 
      function() { // confirm ok
          fetch(admin_app_url + "/user/activate_user_data_by_id", { 
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCookie('csrftoken'),
              },
              body: JSON.stringify({
                  'id': parseInt(id),
              })
          }).then(response => response.json()).then(
              
              response => {
                  if (response.status === 'success')
                  {
                      toastr.options = {
                          "positionClass": "toast-top-right",
                          "timeOut": "3000"
                        }
                      toastr.success(response.message);
                      $('#category').val('');
                      getCategoryData();
                  }
                  else
                  {
                      toastr.options = {
                          "positionClass": "toast-top-right",
                          "timeOut": "3000"
                        }
                      toastr.error(response.message);
                  }
              }
          )
      },
      function() {} // confirm cancel           
  );
}

function deleteUserBulk(){
  arr = [];
  $('#main-check').prop('checked', false);
  $(':checkbox').each(function() {
      if ($(this).prop('checked'))
      {
          arr.push(parseInt($(this).attr('data_id')));
      }    
  });

  confirmToast(' Are you going to activate the user?', 
      function() { // confirm ok
          fetch(admin_app_url + "/user/delete_user_bulk", { 
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCookie('csrftoken'),
              },
              body: JSON.stringify({
                  'ids': parseInt(ids),
              })
          }).then(response => response.json()).then(
              
              response => {
                  if (response.status === 'success')
                  {
                      toastr.options = {
                          "positionClass": "toast-top-right",
                          "timeOut": "3000"
                        }
                      toastr.success(response.message);
                      $('#category').val('');
                      getCategoryData();
                  }
                  else
                  {
                      toastr.options = {
                          "positionClass": "toast-top-right",
                          "timeOut": "3000"
                        }
                      toastr.error(response.message);
                  }
              }
          )
      },
      function() {} // confirm cancel           
  );
}


function goBack(){
  $('#page1').show();
  $('#page2').hide();
}