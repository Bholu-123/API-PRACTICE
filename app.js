//create a GitHub Class
class Github {
    constructor() {
      this.client_id = '87ac792bddf9065d8b1d';
      this.client_secret = '92ed006b739fcecc8f5c2b1e00d1b8e13cc73005';
      this.repos_count = 5;
      this.repos_sort = 'created: asc';
    }
  
    async getUser(user) {
      const profileResponse = await fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`);
      const repoResponse = await fetch(`https://api.github.com/users/${user}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}&client_id=${this.client_id}&client_secret=${this.client_secret}`);

      const profile = await profileResponse.json();
      const repos = await repoResponse.json();

  
      return {
        profile,
        repos
      }
    }
}

class UI{
    //UI constructor
    constructor(){
       this.profile=document.querySelector("#profile");
       this.error=document.querySelector(".error");
       this.input=document.querySelector('#searchUser');
    }

    //show error function
    showError(){
        //if there is an error first we remove
        this.clearAlert();

        this.error.style.display="block";

        // Timeout after 3 sec
        setTimeout(() => {
            this.clearAlert();
        }, 3000);
    }

    clearAlert() {
        const currentAlert = document.querySelector('.error');
        if(currentAlert){
          currentAlert.remove();
        }
    }

    showProfile(user) {
        this.profile.innerHTML = `
            <div class="card card-body mb-3">
                <div class="row">
                    <div class="col-left">
                        <img src="${user.avatar_url}">
                        <a href="${user.html_url}" target="_blank">View Profile</a>
                    </div>
                    <div class="col-right">
                        <span class="badge badge-repos">Public Repos: ${user.public_repos}</span>
                        <span class="badge badge-gists">Public Gists: ${user.public_gists}</span>
                        <span class="badge badge-followers">Followers: ${user.followers}</span>
                        <span class="badge badge-following">Following: ${user.following}</span>
                        <br><br>
                        <ul class="list-group">
                            <li class="list-group-item">Company: ${user.company}</li>
                            <li class="list-group-item">Blog: ${user.blog}</li>
                            <li class="list-group-item">Location: ${user.location}</li>
                            <li class="list-group-item">Member Since: ${user.created_at}</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    // Show user repos
    showRepos(repos) {
        let output = '';
        //traverse in the repos and for each repo we will add dynamic html
        repos.forEach(function(repo) {
        output += `
            <div class=" repo-card ">
                <div class="repo-row">
                    <div class="repoName">
                        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    </div>
                    <div class="badges-group">
                        <span class="badge badge-stars">Stars: ${repo.stargazers_count}</span>
                        <span class="badge badge-watchers">Watchers: ${repo.watchers_count}</span>
                        <span class="badge badge-forks">Forks: ${repo.forms_count}</span>
                    </div>
                </div>
            </div>
        `;
        });

        document.getElementById('repos').innerHTML = output;
    }

    clearProfile() {
        this.profile.innerHTML = '';
    }
}

//init Github Class
const github = new Github;

//init UI class
const ui = new UI;

//Get the value of Search bar
const searchBar=document.querySelector('#searchUser');
searchBar.addEventListener('keyup', (e) =>{
   const userName=e.target.value;
   if(userName!=''){
       github.getUser(userName)
       
       .then(data => {
           console.log(data);
           if(data.profile.message==='Not Found'){
                //show error
               ui.showError(); 
           }
           else{
               //show user details
               ui.showProfile(data.profile);
               ui.showRepos(data.repos);
           }
       })

       .catch(err => {
           console.log(err);
       })
   }
   else{
       ui.clearProfile();
   }
})

