var getUserRepos = function(user) 
{
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
  
    // make a request to the url then...
    fetch(apiUrl).then
    (
        // use the response to the fetch call in a function
        function(response) 
        {
            // parse the response with json() then...
            response.json().then
            (
                // use the "data" parsed from the json in a function
                function(data) 
                {
                    // console log the data
                    console.log(data);
                }
            );
        }
    );
};
  
getUserRepos();