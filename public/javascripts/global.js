(function () {

    var host = location.origin.replace(/^http/, 'ws');

    var ws = new WebSocket(host);

    ws.onmessage = function(message){
        var message = JSON.parse(message.data);

        if(message.type==="gif")
        {
            var div = document.createElement('div');
            div.className = 'col-md-2';
            div.className += ' GifBox';
            div.innerHTML = "<img src='"+message.data+"'>";
            document.querySelector('#gifBox').appendChild(div);
        }
        else if(message.type==='connections')
        {
            $("#updates .count").html(message.data);
        }
    }

    $("#gifSubmit").submit(function(event){

        event.preventDefault();

        var _this = this;

        var queryData = $(_this).find('#query').val();

        $.ajax({
            url: "/gif", 
            type: "POST",
            data:{query:queryData},
            success: function(result){
                $(_this).find('#query').val("");
            },
            error: function(object,string,error){
                alert("No Gifs Found :(");
            }
        });

    });

}());