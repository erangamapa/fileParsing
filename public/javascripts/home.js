$(document).ready(function(){
    // Fake Random User Unique ID, I usually use Mixpanel or Kissmetrics UID here will a fallback function for people who block their JS libraries
    var channelId = Math.floor((Math.random()*100)+1);
    $('#operations_table').hide();
    $('#companies_table').hide();

    Pusher.logToConsole = true;

    var pusher = new Pusher('0650e45d333a22a63199', {
      cluster: 'ap1',
      encrypted: true
    });

    var channelName = 'channel' + channelId;
    var channel = pusher.subscribe(channelName); // The Channel you want to subscribe to
    var totalLines;
    var currentLines = 0;

    channel.bind('update', function(data) {
        var messageBox = $('.messages');
        var progressBar = $('#realtime-progress-bar');
        currentLines++;
        if(totalLines){
            var percentage = parseInt(currentLines*100/totalLines);
            console.log(percentage + "%");
            progressBar.width(percentage+"%");
            messageBox.html(percentage+'%'+' Finished');

            // Process is complete,Do whatever you want now, maybe redirect them to their freshly created account?
            if (totalLines == currentLines) {
                $('.progress').addClass('hide');
                messageBox.html('Parsing completed. Find your results below');
                $('#operations_table').show();
                $('#companies_table').show();
                $('#mybutton').prop('disabled', false);
                $.ajax({
                  url: '/records/getOperationsRecords',
                  success: function(data){
                    console.log(data);
                    $('#operations_table').dynatable({
                      dataset: {
                        records: data
                      }
                    });
                  }
                });
                $.ajax({
                  url: '/records/getCompanyRecords',
                  success: function(data){
                    console.log(data);
                    $('#companies_table').dynatable({
                      dataset: {
                        records: data
                      }
                    });
                  }
                });
            }
        }
    });

    channel.bind('linecount', function(data) {
        console.log(data.value);
        totalLines = data.value;
    });

    // Submit the forms using AJAX, nothing to see here.
    $('#mybutton').on('click', function(){  
        $('.progress').removeClass('hide');
        $('.btn').prop('disabled', true);
        // append other variables to data if you want: data.append('field_name_x', field_value_x);
        $.ajax({
            type: 'POST',               
            processData: false, // important
            contentType: false, // important
            data: {},
            url: '/files/parseFile?channelName=' + channelName + '&fileName=' + $('#fileName').attr('value'),
            dataType : 'json',  
            // in PHP you can call and process file in the same way as if it was submitted from a form:
            // $_FILES['input_file_name']
            success: function(jsonData){
                console.log('success');
            }
        }); 
    });
});