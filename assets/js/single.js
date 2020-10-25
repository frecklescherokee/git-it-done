// make a DOM Element to contain the list of issues
var issueContainerEl = document.querySelector("#issues-container");

// Display Issues
var displayIssues = function(issues) 
{
    // if there are no issues, alert the user
    if (issues.length === 0) 
    {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    
    
    // for each issue in the data object array:
    for (var i = 0; i < issues.length; i++) 
    {
        // create an anchor <a> element to take users to the issue on github
        var issueEl = document.createElement("a");
        // give the anchor element some classes for styling
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        // set the href attribute to the "html_url" attribute of the issue from the array
        issueEl.setAttribute("href", issues[i].html_url);
        // set the target attribute to "_blank" to open the link in a new tab when clicked
        issueEl.setAttribute("target", "_blank");

        // create span element to hold issue's title attribute
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append the span titleEl into the issueEl
        issueEl.appendChild(titleEl);

        // create a type span element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        // if the issue is a pull request
        if (issues[i].pull_request) 
        {
            // update the typeEl's text content to read "Pull Request"
            typeEl.textContent = "(Pull request)";
        } 
        else 
        {
            // update the typeEl's text content to read "Issue"
            typeEl.textContent = "(Issue)";
        }

        // append the TypeEl to the issueEl container
        issueEl.appendChild(typeEl);

        // append the issueEl to the issueContainerEl DOM element to render it on the page
        issueContainerEl.appendChild(issueEl);
    }
};


// Get Reop Issues
var getRepoIssues = function(repo) 
{
    console.log(repo);
    
    // make a URL to call using the format from Github API documentation plus our username/repo (repo)
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    // get repo info then...
    fetch(apiUrl)
    .then
    (
        // call a function using the fetch response as a parameter
        function(response) 
        {
            // if request was successful
            if (response.ok) 
            {
                // parse the response with json() then...
                response.json()
                .then
                (
                    // call a function with data as a parameter
                    // because we used the API url that fetches issues for a particular user/repo
                    // => the data object array will contain those issues
                    function(data) 
                    {
                        // pass response data object array to dom function
                        displayIssues(data);
                    }
                );
            }   
            else 
            {
                alert("There was a problem with your request!");
            }
        }
    );
};
  
getRepoIssues("facebook/react");