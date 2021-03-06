var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

// create a querey selector not for each button, but for the div containing all 3 buttons
var languageButtonsEl = document.querySelector("#language-buttons");











// Display Repos
var displayRepos = function(repos, searchTerm) 
{
    // check if api returned any repos
    if (repos.length === 0) 
    {
        // if user exists, but has no repos, make the repo container element say "no repos found"
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    
    console.log(repos);
    console.log(searchTerm);

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) 
    {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
  
        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        // give the repoEL an href that points to the single repo html page
        // use a query parameter to also pass the repoName
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    
        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
    
        // append to title element to the container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) 
        {
            statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } 
        else 
        {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append status element to container
        repoEl.appendChild(statusEl);
    
        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

// Get Featured Repos
var getFeaturedRepos = function(language) {
    // create the URL to query the API endpoint looking for the entered language and the attribute
    // is:featured
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
    console.log("Made it into the Get Featured Repos function with " + language + " language.");
    //debugger;

    // fetch the API data then...
    fetch(apiUrl)
    .then
    (
        // make a function using the fetch's response
        function(response) 
        {
            // if the response is valid
            if (response.ok) 
            {
                // parse the response with json() then...
                response.json()
                .then
                (
                    // make a function with the response.data as a parameter
                    function(data) 
                    {
                        // call the Display Repos function using data.items and language as parameters
                        displayRepos(data.items, language);
                    }
                );
            } 
            else 
            {
                alert("Error: " + response.statusText);
            }
        }
    );
};

// Button Click Handler
var buttonClickHandler =function (event)
{
    event.preventDefault();
    // get the data-language attribute from the button click event
    var language = event.target.getAttribute("data-language");
    console.log(language);

    // if the language value is valid
    if (language) 
    {
        // call the Get Featured Repos function with language as a parameter
        getFeaturedRepos(language);
      
        // clear old content
        repoContainerEl.textContent = "";
    }
}

// Form Submit Handler
var formSubmitHandler = function(event) 
{
    event.preventDefault();
    
    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) 
    {
        getUserRepos(username);
        nameInputEl.value = "";
    } 
    else 
    {
        alert("Please enter a GitHub username");
    }
};

// Get User Repos
var getUserRepos = function(user) 
{
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
  
    // make a request to the url then...
    fetch(apiUrl)
    .then
    (
        // call a function using the fetch response as a parameter
        function(response) 
        {
            // request was successful (status code in the 200's)
            if (response.ok) 
            {
                // parse the response with json()
                response.json()
                // then
                .then
                (
                    // call a function using the data from the fetch as a parameter
                    function(data) 
                    {
                        // call the Display Repos function, passing the data object array and user value
                        displayRepos(data, user);
                    }
            )   ;
            }    
            // if request was unsuccessful (status code not in the 200's)
            else 
            {
                // make an error message pop up showing the status text of the response
                alert("Error: " + response.statusText);
            }
        }
    )
    // add this catch() function to catch connectivity errors
    .catch
    (
        function(error) 
        {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
        }
    );
};
  
// Add a listener to listen for any submit coming from the user form then call the form submit handler
userFormEl.addEventListener("submit", formSubmitHandler);

// add an event listener for the language buttons which calls the Button Click Handler function
languageButtonsEl.addEventListener("click", buttonClickHandler);